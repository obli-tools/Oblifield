import type { Knex } from 'knex';

// Indexes backing the data retention job (services/dataRetention.service.ts):
// its deletes filter on created_at alone (all tenants), which the existing
// (tenant_id, created_at) indexes cannot serve. notification_log.created_at
// is already indexed (007).
export async function up(knex: Knex): Promise<void> {
  await knex.raw('CREATE INDEX IF NOT EXISTS audit_logs_created_at_idx ON audit_logs (created_at)');
  await knex.raw('CREATE INDEX IF NOT EXISTS live_alerts_created_at_idx ON live_alerts (created_at)');
  await knex.raw('CREATE INDEX IF NOT EXISTS password_reset_tokens_expires_at_idx ON password_reset_tokens (expires_at)');
  await knex.raw('CREATE INDEX IF NOT EXISTS password_reset_tokens_used_at_idx ON password_reset_tokens (used_at) WHERE used_at IS NOT NULL');
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw('DROP INDEX IF EXISTS password_reset_tokens_used_at_idx');
  await knex.raw('DROP INDEX IF EXISTS password_reset_tokens_expires_at_idx');
  await knex.raw('DROP INDEX IF EXISTS live_alerts_created_at_idx');
  await knex.raw('DROP INDEX IF EXISTS audit_logs_created_at_idx');
}
