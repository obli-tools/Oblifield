import { db } from '../db';
import { logger } from '../utils/logger';
import { liveAlertService } from './liveAlert.service';

/**
 * Data retention for the append-only technical tables. Business tables
 * (interventions, timeline_events, photos, signatures, parts...) are NEVER
 * touched here: they are the customer's record.
 *
 * Started at boot (+5 min), then every 6 h; a pass never overlaps the
 * previous one. Deletes go by batches of ids (LIMIT on a sub-select) so a
 * large backlog never holds one long lock; each table is capped per pass and
 * the remainder is picked up by the next pass.
 */

export const NOTIFICATION_LOG_RETENTION_DAYS = 30;
export const AUDIT_LOG_RETENTION_DAYS = 365;
export const LIVE_ALERT_RETENTION_DAYS = 30;
/** Used or expired reset tokens are kept one day (debugging a failed reset), then dropped. */
export const PASSWORD_RESET_TOKEN_GRACE_DAYS = 1;

const FIRST_RUN_DELAY_MS = 5 * 60_000;
const INTERVAL_MS = 6 * 60 * 60_000;
const BATCH_SIZE = 1000;
const MAX_BATCHES_PER_TABLE = 200;

type QueryFactory = () => ReturnType<typeof db>;

async function deleteInBatches(table: string, where: QueryFactory): Promise<number> {
  let total = 0;
  for (let i = 0; i < MAX_BATCHES_PER_TABLE; i++) {
    const ids = where().select('id').limit(BATCH_SIZE);
    const deleted = Number(await db(table).whereIn('id', ids).delete()) || 0;
    total += deleted;
    if (deleted < BATCH_SIZE) break;
  }
  return total;
}

export async function runDataRetention(now: Date = new Date()): Promise<void> {
  const daysAgo = (days: number): Date => new Date(now.getTime() - days * 86_400_000);
  // Each step is independent: one failing table never skips the others.
  const step = async (name: string, run: () => Promise<number>): Promise<number> => {
    try {
      return await run();
    } catch (err) {
      logger.warn({ err: (err as Error)?.message, step: name }, 'Retention step failed');
      return 0;
    }
  };

  const notificationLog = await step('notification_log', () => deleteInBatches('notification_log',
    () => db('notification_log').where('created_at', '<', daysAgo(NOTIFICATION_LOG_RETENTION_DAYS))));
  const auditLogs = await step('audit_logs', () => deleteInBatches('audit_logs',
    () => db('audit_logs').where('created_at', '<', daysAgo(AUDIT_LOG_RETENTION_DAYS))));
  const liveAlerts = await step('live_alerts', () => liveAlertService.cleanup(LIVE_ALERT_RETENTION_DAYS));
  const tokenCutoff = daysAgo(PASSWORD_RESET_TOKEN_GRACE_DAYS);
  const resetTokens = await step('password_reset_tokens', () => deleteInBatches('password_reset_tokens',
    () => db('password_reset_tokens').where((q) => {
      q.where('used_at', '<', tokenCutoff).orWhere('expires_at', '<', tokenCutoff);
    })));

  if (notificationLog + auditLogs + liveAlerts + resetTokens > 0) {
    logger.info({ notificationLog, auditLogs, liveAlerts, resetTokens }, 'Retention');
  }
}

let timer: NodeJS.Timeout | null = null;
let running = false;

async function tick(): Promise<void> {
  if (running) return; // no overlap: a slow pass simply skips the next slot
  running = true;
  try {
    await runDataRetention();
  } catch (err) {
    logger.warn({ err: (err as Error)?.message }, 'Retention pass failed');
  } finally {
    running = false;
  }
}

export function startDataRetention(): void {
  if (timer) return;
  timer = setTimeout(function loop() {
    void tick().finally(() => {
      if (timer) {
        timer = setTimeout(loop, INTERVAL_MS);
        timer.unref();
      }
    });
  }, FIRST_RUN_DELAY_MS);
  timer.unref();
}

export function stopDataRetention(): void {
  if (timer) clearTimeout(timer);
  timer = null;
}
