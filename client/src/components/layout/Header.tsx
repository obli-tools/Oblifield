import { LogOut, Menu, MoreHorizontal, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/authStore';
import { useUiStore } from '@/store/uiStore';
import { useSocketStore } from '@/store/socketStore';
import { useInterventionStore } from '@/store/interventionStore';
import { appConfigApi } from '@/api/appConfig.api';
import { Button } from '@/components/common/Button';
import { NotificationCenter } from './NotificationCenter';
import { cn } from '@/utils/cn';
import { anonymizeUsername } from '@/utils/anonymize';

/** True when running inside the Oblifield native desktop app (gear overlay sets this). */
const isNativeApp = typeof window !== 'undefined' &&
  !!(window as Window & { __oblifield_is_native_app?: boolean }).__oblifield_is_native_app;

/** app_type this instance is registered under in Obligate. */
const CURRENT_APP = 'oblifield';

// Fallback colour for an app that has not announced one to Obligate yet.
const FALLBACK_APP_COLOR = '#8b949e';

interface ConnectedApp {
  appType: string;
  name: string;
  baseUrl: string;
  icon: string | null;
  color: string | null;
  /** Marks the entry that is this app itself (resolved by Obligate from the Bearer key). */
  self?: boolean;
  /** Not an Obli* app (filed under "More…" in Obligate): listed in the "More…" dropdown. */
  thirdParty?: boolean;
}

/** Used only until the dynamic list loads / if Obligate ever omits self — never for other apps. */
const CURRENT_APP_FALLBACK: ConnectedApp = { appType: CURRENT_APP, name: 'Oblifield', baseUrl: '', icon: null, color: '#AEEA00', self: true };

// Refreshed periodically so an app newly registered in Obligate appears without a reload.
const REFRESH_INTERVAL_MS = 5 * 60_000;

export function Header() {
  const { t } = useTranslation();
  const { user, logout } = useAuthStore();
  const { toggleSidebar, sidebarFloating } = useUiStore();
  const { status: socketStatus } = useSocketStore();
  const interventions = useInterventionStore((s) => s.interventions);
  const [connectedApps, setConnectedApps] = useState<ConnectedApp[]>([]);
  const [obligateUrl, setObligateUrl] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const switcherWrapRef = useRef<HTMLDivElement>(null); // flexible-width slot: its clientWidth is the space actually granted
  const measureRef = useRef<HTMLDivElement>(null); // hidden, always full-label: the width the switcher would need
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Connected apps from Obligate via the server proxy (order, names, colours all come from Obligate)
    const loadApps = () => {
      fetch('/api/auth/connected-apps', { credentials: 'include' })
        .then(r => r.json())
        .then((d: { success: boolean; data?: ConnectedApp[] }) => {
          if (d.success && d.data) setConnectedApps(d.data);
        })
        .catch(() => {});
    };
    loadApps();
    const interval = setInterval(loadApps, REFRESH_INTERVAL_MS);
    // Obligate URL: the switcher is only shown when SSO is configured
    appConfigApi.getConfig()
      .then(cfg => setObligateUrl(cfg.obligate_url ?? null))
      .catch(() => {});
    return () => clearInterval(interval);
  }, []);

  // The current app is the entry Obligate marked `self` (falls back to the
  // app type for older Obligate versions), synthesised if Obligate omits it —
  // Oblifield's own pill never disappears from its own switcher.
  const selfEntry = connectedApps.find(a => a.self) ?? connectedApps.find(a => a.appType === CURRENT_APP);
  const visibleApps: ConnectedApp[] = selfEntry ? connectedApps : [CURRENT_APP_FALLBACK, ...connectedApps];
  const showSwitcher = !!obligateUrl && !isNativeApp && visibleApps.length > 1;
  const isCurrentApp = (app: ConnectedApp) => (selfEntry ? app === selfEntry : app.appType === CURRENT_APP);

  // Obli* apps in the main row, third-party apps (Passly…) in "More…". The
  // current app always stays in the main row, even when it is third-party.
  const mainApps = visibleApps.filter(a => !a.thirdParty || isCurrentApp(a));
  const moreApps = visibleApps.filter(a => a.thirdParty && !isCurrentApp(a));

  const goApp = (app: ConnectedApp) => {
    if (isCurrentApp(app) || !app.baseUrl) return;
    window.location.href = `${app.baseUrl}/auth/sso-redirect`;
  };

  // "More…" dropdown: outside click and Escape close it.
  useEffect(() => {
    if (!moreOpen) return;
    const onDown = (e: PointerEvent) => { if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMoreOpen(false); };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('pointerdown', onDown); document.removeEventListener('keydown', onKey); };
  }, [moreOpen]);

  // Collapse to colour-dot-only pills when the labelled row would not fit
  // the space flexbox grants — re-measured on resize and on app-list change.
  useEffect(() => {
    const el = switcherWrapRef.current;
    const measure = measureRef.current;
    if (!el || !measure) return;
    const update = () => setCollapsed(measure.scrollWidth > el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [mainApps.length, moreApps.length, showSwitcher]);

  const moreButton = (labelled: boolean, interactive: boolean) => (
    <button
      type="button"
      onClick={interactive ? () => setMoreOpen(v => !v) : undefined}
      tabIndex={interactive ? undefined : -1}
      aria-haspopup={interactive ? 'true' : undefined}
      aria-expanded={interactive ? moreOpen : undefined}
      className={cn(
        'flex items-center gap-1.5 rounded-md py-1.5 text-[12.5px] font-medium text-text-secondary transition-colors hover:bg-bg-active hover:text-text-primary shrink-0',
        labelled ? 'px-3' : 'px-1.5',
      )}
      title={t('header.moreApps', 'More…')}
      aria-label={t('header.moreApps', 'More…')}
    >
      <MoreHorizontal size={14} className="shrink-0" />
      {labelled && <span>{t('header.moreApps', 'More…')}</span>}
      {labelled && <ChevronDown size={12} className={cn('shrink-0 text-text-muted transition-transform', moreOpen && 'rotate-180')} />}
    </button>
  );

  const pill = (app: ConnectedApp, labelled: boolean) => {
    const isCurrent = isCurrentApp(app);
    return (
      <button
        key={`${app.appType}|${app.baseUrl}`}
        type="button"
        onClick={() => goApp(app)}
        className={cn(
          'flex items-center gap-2 rounded-md px-3 py-1.5 text-[12.5px] transition-colors shrink-0',
          isCurrent
            ? 'bg-bg-secondary font-semibold text-text-primary shadow-[0_1px_3px_rgb(46_52_64_/_0.1)]'
            : 'font-medium text-text-secondary hover:bg-bg-active hover:text-text-primary',
          !labelled && 'px-1.5',
        )}
        title={app.name}
        aria-label={app.name}
      >
        <span className="h-2 w-2 rounded-full shrink-0" style={{ background: app.color || FALLBACK_APP_COLOR }} />
        {labelled && app.name}
      </button>
    );
  };

  // Intervention status counts for header chips
  const statusCounts = useMemo(() => {
    let active = 0, issues = 0, pending = 0;
    for (const i of interventions.values()) {
      if (i.status === 'in_progress') active++;
      else if (i.status === 'issue')  issues++;
      else if (i.status === 'pending' || i.status === 'assigned') pending++;
    }
    return { active, issues, pending };
  }, [interventions]);

  return (
    <header className="relative flex h-14 shrink-0 items-center gap-3 border-b border-border bg-bg-secondary px-4">
      <div className="flex items-center gap-3 shrink-0">
        {/* Logo — shown in the Header only when the sidebar is floating.
            In pinned mode the logo lives inside the sidebar itself.
            In floating mode (especially in the native desktop app where the native
            tenant tab bar can cover the very top of the floating sidebar) the logo
            is mirrored here so it remains always accessible. */}
        {sidebarFloating && (
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src="/logo.svg" alt="Oblifield" className="h-10 w-auto max-w-[200px] object-contain" />
          </Link>
        )}

        {/* Mobile menu button */}
        <button
          onClick={toggleSidebar}
          className="rounded-md p-1.5 text-text-secondary hover:bg-bg-hover hover:text-text-primary lg:hidden"
        >
          <Menu size={20} />
        </button>

      </div>

      {/* App switcher via Obligate — hidden inside the native Obli.tools desktop app.
          Flexible-width slot so its siblings can squeeze it: that is what makes the
          available-space measurement meaningful (labels when they fit, dots otherwise). */}
      {/* No overflow-hidden here: it would clip the "More…" dropdown. */}
      <div ref={switcherWrapRef} className="flex-1 min-w-0 flex items-center">
        {showSwitcher && (
          <nav className="flex items-center gap-1 rounded-lg bg-bg-hover p-1">
            {mainApps.map(app => pill(app, !collapsed))}
            {moreApps.length > 0 && (
              <div ref={moreRef} className="relative">
                {moreButton(!collapsed, true)}
                {moreOpen && (
                  <div className="absolute left-0 top-9 z-50 w-56 max-w-[calc(100vw-1.5rem)] rounded-xl bg-bg-secondary shadow-2xl overflow-hidden">
                    <div className="px-3 py-2">
                      <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">{t('header.moreAppsTitle', 'Other apps')}</p>
                    </div>
                    <div className="py-1 max-h-64 overflow-y-auto overscroll-contain">
                      {moreApps.map(app => (
                        <button
                          key={`${app.appType}|${app.baseUrl}`}
                          type="button"
                          onClick={() => { setMoreOpen(false); goApp(app); }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left text-text-primary transition-colors hover:bg-bg-hover"
                        >
                          <span className="h-2 w-2 rounded-full shrink-0" style={{ background: app.color || FALLBACK_APP_COLOR }} />
                          <span className="truncate">{app.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </nav>
        )}
      </div>

      {/* Hidden measurer: the full-label version, off-screen, never interactive. */}
      {showSwitcher && (
        <div
          ref={measureRef}
          aria-hidden
          className="absolute -z-10 opacity-0 pointer-events-none flex items-center gap-1 p-1"
          style={{ top: -9999, left: -9999 }}
        >
          {mainApps.map(app => pill(app, true))}
          {moreApps.length > 0 && moreButton(true, false)}
        </div>
      )}

      <div className="ml-auto flex items-center gap-3 shrink-0">
        {/* Intervention status chips */}
        {interventions.size > 0 && (
          <div className="hidden sm:flex items-center gap-1.5">
            <Link
              to="/"
              title="Active"
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold
                text-accent bg-accent/10 border border-accent/25
                hover:bg-accent/20 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              {statusCounts.active}
            </Link>
            {statusCounts.issues > 0 && (
              <Link
                to="/"
                title="Issues"
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold
                  text-red-400 bg-red-500/10 border border-red-500/25
                  hover:bg-red-500/20 transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {statusCounts.issues}
              </Link>
            )}
            {statusCounts.pending > 0 && (
              <Link
                to="/"
                title="Pending"
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold
                  text-yellow-400 bg-yellow-500/10 border border-yellow-500/25
                  hover:bg-yellow-500/20 transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                {statusCounts.pending}
              </Link>
            )}
          </div>
        )}

        {/* Socket connection status dot */}
        <button
          onClick={socketStatus !== 'connected' ? () => window.location.reload() : undefined}
          title={
            socketStatus === 'connected'    ? t('header.socketConnected')    :
            socketStatus === 'reconnecting' ? t('header.socketReconnecting') :
                                              t('header.socketDisconnected')
          }
          className={cn(
            'flex h-6 w-6 items-center justify-center rounded-full transition-opacity',
            socketStatus !== 'connected' && 'cursor-pointer hover:opacity-70',
            socketStatus === 'connected'  && 'cursor-default',
          )}
        >
          <span
            className={cn(
              'h-2 w-2 rounded-full transition-colors',
              socketStatus === 'connected'    && 'bg-green-500',
              socketStatus === 'reconnecting' && 'bg-amber-400 animate-pulse',
              socketStatus === 'disconnected' && 'bg-red-500 animate-pulse',
            )}
          />
        </button>

        {/* Notification Center */}
        <NotificationCenter />

        {user && (
          <>
            <div className="text-sm">
              <span className="text-text-secondary">{t('header.signedInAs')} </span>
              <span className="font-medium text-text-primary">{anonymizeUsername(user.username.startsWith('og_') ? user.username.slice(3) : user.username)}</span>
              <span className="ml-2 rounded-full bg-bg-tertiary px-2 py-0.5 text-xs text-text-muted">
                {user.role}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              title={t('nav.signOut')}
            >
              <LogOut size={16} />
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
