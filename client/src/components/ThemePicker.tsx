import { Check } from 'lucide-react';
import type { AppTheme } from '@/utils/theme';
import { cn } from '@/utils/cn';

interface ThemePickerProps {
  value: AppTheme;
  onChange: (theme: AppTheme) => void;
}

/* ─── SVG mini-dashboard previews ─────────────────────────────────────────── */

function ModernPreviewSvg() {
  return (
    <svg viewBox="0 0 280 170" xmlns="http://www.w3.org/2000/svg" className="w-full rounded-md">
      {/* Page background */}
      <rect width="280" height="170" fill="#0d1117" rx="6" />

      {/* Sidebar */}
      <rect x="0" y="0" width="60" height="170" fill="#161b22" rx="6" />
      <rect x="60" y="0" width="1" height="170" fill="#30363d" />
      {/* Sidebar logo area */}
      <rect x="10" y="12" width="16" height="16" rx="3" fill="#58a6ff" opacity="0.9" />
      <rect x="31" y="15" width="22" height="5" rx="2" fill="#8b949e" />
      {/* Sidebar nav items */}
      {[40, 62, 84, 106].map((y, i) => (
        <g key={y}>
          <rect x="7" y={y} width="46" height="16" rx="3"
            fill={i === 0 ? '#1c2333' : 'transparent'} />
          <rect x="13" y={y + 4} width="8" height="8" rx="2"
            fill={i === 0 ? '#58a6ff' : '#6e7681'} />
          <rect x="25" y={y + 6} width={i === 0 ? 22 : 18} height="4" rx="2"
            fill={i === 0 ? '#e6edf3' : '#6e7681'} />
        </g>
      ))}

      {/* Top header */}
      <rect x="61" y="0" width="219" height="28" fill="#161b22" />
      <rect x="61" y="28" width="219" height="1" fill="#30363d" />
      <rect x="70" y="8" width="50" height="12" rx="3" fill="#0d1117" />
      <rect x="230" y="9" width="44" height="10" rx="4" fill="#1c2333" stroke="#30363d" strokeWidth="0.5" />

      {/* Stats row */}
      {[0, 1, 2, 3].map((i) => {
        const colors = ['#3b82f6', '#f85149', '#d29922', '#58a6ff'];
        const labels = [68, 4, 2, 8];
        const x = 70 + i * 52;
        return (
          <g key={i}>
            <rect x={x} y="36" width="44" height="24" rx="4" fill="#161b22" stroke="#30363d" strokeWidth="0.5" />
            <rect x={x + 4} y="41" width="6" height="6" rx="3" fill={colors[i]} />
            <rect x={x + 12} y="41" width={labels[i]} height="4" rx="2" fill={colors[i]} opacity="0.7" />
            <rect x={x + 12} y="48" width="20" height="3" rx="2" fill="#6e7681" />
          </g>
        );
      })}

      {/* Monitor cards */}
      {[0, 1, 2].map((i) => {
        const statusColors = ['#3b82f6', '#f85149', '#3b82f6'];
        const x = 70 + i * 69;
        return (
          <g key={i}>
            <rect x={x} y="68" width="62" height="50" rx="4" fill="#161b22" stroke="#30363d" strokeWidth="0.5" />
            {/* status left border */}
            <rect x={x} y="68" width="2.5" height="50" rx="2" fill={statusColors[i]} />
            {/* status dot */}
            <rect x={x + 7} y="76" width="6" height="6" rx="3" fill={statusColors[i]} />
            {/* name */}
            <rect x={x + 17} y="77" width={i === 1 ? 30 : 35} height="4" rx="2" fill="#e6edf3" />
            {/* host */}
            <rect x={x + 17} y="84" width="25" height="3" rx="2" fill="#6e7681" />
            {/* sparkline */}
            {i === 1 ? (
              <polyline
                points={`${x+7},102 ${x+12},106 ${x+17},100 ${x+22},108 ${x+27},103 ${x+32},109 ${x+37},104 ${x+42},107 ${x+47},103 ${x+52},108 ${x+57},105`}
                fill="none" stroke="#f85149" strokeWidth="1.2" opacity="0.8"
              />
            ) : (
              <polyline
                points={`${x+7},104 ${x+12},101 ${x+17},103 ${x+22},99 ${x+27},101 ${x+32},98 ${x+37},100 ${x+42},97 ${x+47},99 ${x+52},96 ${x+57},98`}
                fill="none" stroke="#3b82f6" strokeWidth="1.2" opacity="0.8"
              />
            )}
            {/* response time */}
            <rect x={x + 7} y="110" width="18" height="3" rx="2" fill="#8b949e" />
            {/* uptime */}
            <rect x={x + 40} y="110" width="15" height="3" rx="2" fill={statusColors[i]} opacity="0.8" />
          </g>
        );
      })}

      {/* Agent card */}
      <rect x="70" y="126" width="200" height="36" rx="4" fill="#161b22" stroke="#30363d" strokeWidth="0.5" />
      <rect x="78" y="132" width="5" height="5" rx="2.5" fill="#3b82f6" />
      <rect x="87" y="133" width="35" height="4" rx="2" fill="#e6edf3" />
      {/* CPU bar */}
      <rect x="78" y="143" width="90" height="3" rx="2" fill="#1c2333" />
      <rect x="78" y="143" width="55" height="3" rx="2" fill="#58a6ff" opacity="0.85" />
      {/* RAM bar */}
      <rect x="175" y="143" width="88" height="3" rx="2" fill="#1c2333" />
      <rect x="175" y="143" width="40" height="3" rx="2" fill="#a371f7" opacity="0.85" />
    </svg>
  );
}

function NeonPreviewSvg() {
  return (
    <svg viewBox="0 0 280 170" xmlns="http://www.w3.org/2000/svg" className="w-full rounded-md">
      <defs>
        {/* Neon glow filters */}
        <filter id="glow-cyan" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="glow-blue" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="glow-red" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Page background — near-black with blue tint */}
      <rect width="280" height="170" fill="#070a0f" rx="6" />

      {/* Sidebar */}
      <rect x="0" y="0" width="60" height="170" fill="#0d1117" rx="6" />
      <rect x="60" y="0" width="1" height="170" fill="#1c2a3f" />
      {/* Sidebar logo — neon cyan */}
      <rect x="10" y="12" width="16" height="16" rx="3" fill="#00c8ff" opacity="0.85" filter="url(#glow-cyan)" />
      <rect x="31" y="15" width="22" height="5" rx="2" fill="#7899b8" />
      {/* Sidebar nav items */}
      {[40, 62, 84, 106].map((y, i) => (
        <g key={y}>
          <rect x="7" y={y} width="46" height="16" rx="3"
            fill={i === 0 ? '#1a1f2e' : 'transparent'} />
          <rect x="13" y={y + 4} width="8" height="8" rx="2"
            fill={i === 0 ? '#00c8ff' : '#4a6a88'}
            filter={i === 0 ? 'url(#glow-cyan)' : undefined} />
          <rect x="25" y={y + 6} width={i === 0 ? 22 : 18} height="4" rx="2"
            fill={i === 0 ? '#e0f0ff' : '#4a6a88'} />
        </g>
      ))}

      {/* Top header */}
      <rect x="61" y="0" width="219" height="28" fill="#0d1117" />
      <rect x="61" y="28" width="219" height="1" fill="#1c2a3f" />
      <rect x="70" y="8" width="50" height="12" rx="3" fill="#070a0f" />
      <rect x="230" y="9" width="44" height="10" rx="4" fill="#111827" stroke="#1c2a3f" strokeWidth="0.5" />

      {/* Stats row */}
      {[0, 1, 2, 3].map((i) => {
        const colors = ['#00a0ff', '#ff3860', '#ffaa00', '#00c8ff'];
        const filters = ['url(#glow-blue)', 'url(#glow-red)', undefined, 'url(#glow-cyan)'];
        const labels = [68, 4, 2, 8];
        const x = 70 + i * 52;
        return (
          <g key={i}>
            <rect x={x} y="36" width="44" height="24" rx="4" fill="#0d1117" stroke="#1c2a3f" strokeWidth="0.5" />
            <rect x={x + 4} y="41" width="6" height="6" rx="3" fill={colors[i]} filter={filters[i]} />
            <rect x={x + 12} y="41" width={labels[i]} height="4" rx="2" fill={colors[i]} opacity="0.75" />
            <rect x={x + 12} y="48" width="20" height="3" rx="2" fill="#4a6a88" />
          </g>
        );
      })}

      {/* Monitor cards */}
      {[0, 1, 2].map((i) => {
        const statusColors = ['#00a0ff', '#ff3860', '#00a0ff'];
        const statusFilters = ['url(#glow-blue)', 'url(#glow-red)', 'url(#glow-blue)'];
        const x = 70 + i * 69;
        return (
          <g key={i}>
            <rect x={x} y="68" width="62" height="50" rx="4" fill="#0d1117" stroke="#1c2a3f" strokeWidth="0.5" />
            {/* status left border with glow */}
            <rect x={x} y="68" width="2.5" height="50" rx="2" fill={statusColors[i]} filter={statusFilters[i]} />
            {/* status dot */}
            <rect x={x + 7} y="76" width="6" height="6" rx="3" fill={statusColors[i]} filter={statusFilters[i]} />
            {/* name */}
            <rect x={x + 17} y="77" width={i === 1 ? 30 : 35} height="4" rx="2" fill="#e0f0ff" />
            {/* host */}
            <rect x={x + 17} y="84" width="25" height="3" rx="2" fill="#4a6a88" />
            {/* sparkline */}
            {i === 1 ? (
              <polyline
                points={`${x+7},102 ${x+12},106 ${x+17},100 ${x+22},108 ${x+27},103 ${x+32},109 ${x+37},104 ${x+42},107 ${x+47},103 ${x+52},108 ${x+57},105`}
                fill="none" stroke="#ff3860" strokeWidth="1.3" opacity="0.9"
                filter="url(#glow-red)"
              />
            ) : (
              <polyline
                points={`${x+7},104 ${x+12},101 ${x+17},103 ${x+22},99 ${x+27},101 ${x+32},98 ${x+37},100 ${x+42},97 ${x+47},99 ${x+52},96 ${x+57},98`}
                fill="none" stroke="#00a0ff" strokeWidth="1.3" opacity="0.9"
                filter="url(#glow-blue)"
              />
            )}
            {/* response time */}
            <rect x={x + 7} y="110" width="18" height="3" rx="2" fill="#7899b8" />
            {/* uptime */}
            <rect x={x + 40} y="110" width="15" height="3" rx="2" fill={statusColors[i]} opacity="0.8" />
          </g>
        );
      })}

      {/* Agent card */}
      <rect x="70" y="126" width="200" height="36" rx="4" fill="#0d1117" stroke="#1c2a3f" strokeWidth="0.5" />
      <rect x="78" y="132" width="5" height="5" rx="2.5" fill="#00a0ff" filter="url(#glow-blue)" />
      <rect x="87" y="133" width="35" height="4" rx="2" fill="#e0f0ff" />
      {/* CPU bar */}
      <rect x="78" y="143" width="90" height="3" rx="2" fill="#111827" />
      <rect x="78" y="143" width="55" height="3" rx="2" fill="#00c8ff" opacity="0.9" filter="url(#glow-cyan)" />
      {/* RAM bar */}
      <rect x="175" y="143" width="88" height="3" rx="2" fill="#111827" />
      <rect x="175" y="143" width="40" height="3" rx="2" fill="#b06aff" opacity="0.9" />
    </svg>
  );
}

/* ─── Obli Operator preview (default theme — Obli design system v1) ──────── */

function ObliOperatorPreviewSvg() {
  return (
    <svg viewBox="0 0 280 170" xmlns="http://www.w3.org/2000/svg" className="w-full rounded-md">
      {/* Page bg = #0b0d1a */}
      <rect width="280" height="170" fill="#0b0d1a" rx="6" />

      {/* Topbar full-width — fond s1 */}
      <rect x="0" y="0" width="280" height="20" fill="#0f1220" />
      {/* Logo dot lime */}
      <rect x="8" y="6" width="8" height="8" rx="2" fill="#aeea00" />
      <rect x="20" y="8" width="22" height="4" rx="1.5" fill="#e8ecf5" />
      {/* Tenant pill */}
      <rect x="50" y="6" width="42" height="8" rx="2" fill="#1d2238" />
      {/* App pills */}
      {[100, 124, 148, 172, 196].map((x, i) => (
        <rect key={x} x={x} y="6" width="20" height="8" rx="2"
          fill={i === 3 ? 'rgba(174,234,0,0.12)' : '#1d2238'} />
      ))}
      {/* User badge right */}
      <rect x="248" y="5" width="10" height="10" rx="5" fill="#aeea00" opacity="0.9" />
      <rect x="262" y="8" width="14" height="4" rx="1.5" fill="#8c93b6" />

      {/* Sidebar 60px */}
      <rect x="0" y="20" width="60" height="150" fill="#0f1220" />
      {/* Add button (accent) */}
      <rect x="6" y="28" width="48" height="12" rx="3" fill="rgba(174,234,0,0.14)" />
      <rect x="14" y="32" width="32" height="4" rx="1.5" fill="#aeea00" />
      {/* Search */}
      <rect x="6" y="44" width="48" height="10" rx="3" fill="#181c30" />
      {/* Nav links — first active */}
      {[60, 76, 92, 108].map((y, i) => (
        <g key={y}>
          <rect x="6" y={y} width="48" height="12" rx="3"
            fill={i === 0 ? 'rgba(174,234,0,0.10)' : 'transparent'} />
          <rect x="11" y={y + 4} width="4" height="4" rx="1" fill={i === 0 ? '#aeea00' : '#4b5273'} />
          <rect x="20" y={y + 4} width={i === 0 ? 26 : 22} height="4" rx="1.5"
            fill={i === 0 ? '#e8ecf5' : '#8c93b6'} />
        </g>
      ))}

      {/* Hero KPI row */}
      {/* featured (1.6x) */}
      <rect x="68" y="28" width="80" height="46" rx="5" fill="#131728" />
      <rect x="68" y="28" width="80" height="46" rx="5" fill="rgba(174,234,0,0.08)" />
      <rect x="74" y="33" width="20" height="3" rx="1" fill="#8c93b6" />
      <rect x="74" y="42" width="40" height="10" rx="2" fill="#aeea00" />
      <polyline points="74,68 80,64 86,66 92,60 98,63 104,57 110,60 116,55 122,58 128,52 134,55 140,49"
                fill="none" stroke="#aeea00" strokeWidth="1.2" opacity="0.85" />
      {/* 4 standard KPI */}
      {[0, 1, 2, 3].map((i) => {
        const colors = ['#1edd8a', '#e03a3a', '#4f7bff', '#f5a623'];
        const x = 152 + i * 32;
        return (
          <g key={i}>
            <rect x={x} y="28" width="28" height="46" rx="4" fill="#131728" />
            <rect x={x + 3} y="33" width="14" height="3" rx="1" fill="#4b5273" />
            <rect x={x + 3} y="42" width="18" height="8" rx="2" fill={colors[i]} />
            <rect x={x + 3} y="58" width="22" height="2" rx="1" fill="rgba(255,255,255,0.04)" />
            <rect x={x + 3} y="58" width="14" height="2" rx="1" fill={colors[i]} opacity="0.8" />
          </g>
        );
      })}

      {/* Chart + donut row */}
      <rect x="68" y="80" width="130" height="50" rx="4" fill="#131728" />
      <polyline points="74,118 86,108 98,112 110,98 122,103 134,92 146,98 158,86 170,92 182,80 194,84"
                fill="none" stroke="#1edd8a" strokeWidth="1.2" />
      <rect x="202" y="80" width="74" height="50" rx="4" fill="#131728" />
      <circle cx="220" cy="105" r="14" fill="none" stroke="#aeea00" strokeWidth="3" strokeDasharray="50 100" />
      <circle cx="220" cy="105" r="14" fill="none" stroke="#4f7bff" strokeWidth="3" strokeDasharray="20 100" strokeDashoffset="-50" />

      {/* Bottom 4 status cards */}
      {[0, 1, 2, 3].map((i) => {
        const x = 68 + i * 53;
        return (
          <g key={i}>
            <rect x={x} y="136" width="49" height="26" rx="4" fill="#131728" />
            <rect x={x + 4} y="141" width="6" height="6" rx="2" fill="#aeea00" opacity="0.85" />
            <rect x={x + 14} y="142" width="22" height="3" rx="1" fill="#e8ecf5" />
            <rect x={x + 14} y="149" width="18" height="2" rx="1" fill="#4b5273" />
          </g>
        );
      })}
    </svg>
  );
}

/* ─── Obli Dim preview ─────────────────────────────────────────────────────── */

function DimPreviewSvg() {
  // Same geometry as the Operator preview; only the neutrals change (Nord
  // "Polar Night"). The accent is Oblifield's own lime, identical to Operator.
  const bg     = '#2e3440';   // page
  const chrome = '#282d37';   // topbar + sidebar (one step darker than page)
  const card   = '#3b4252';   // cards / surfaces
  const raised = '#434c5e';   // inputs / pills
  const faint  = '#5e6a82';   // inactive icons, secondary bars
  const text   = '#eceff4';
  const muted  = '#a3abbc';
  const up     = '#6ccb8f';
  const down   = '#ff6b6b';
  const info   = '#88a6e0';
  const warn   = '#ebcb8b';
  const accent = '#aeea00';   // Operator --c-accent (lime), verbatim
  return (
    <svg viewBox="0 0 280 170" xmlns="http://www.w3.org/2000/svg" className="w-full rounded-md">
      {/* Page bg = #2e3440 */}
      <rect width="280" height="170" fill={bg} rx="6" />

      {/* Topbar full-width */}
      <rect x="0" y="0" width="280" height="20" fill={chrome} />
      {/* Logo dot lime */}
      <rect x="8" y="6" width="8" height="8" rx="2" fill={accent} />
      <rect x="20" y="8" width="22" height="4" rx="1.5" fill={text} />
      {/* Tenant pill */}
      <rect x="50" y="6" width="42" height="8" rx="2" fill={raised} />
      {/* App pills */}
      {[100, 124, 148, 172, 196].map((x, i) => (
        <rect key={x} x={x} y="6" width="20" height="8" rx="2"
          fill={i === 3 ? 'rgba(174,234,0,0.16)' : raised} />
      ))}
      {/* User badge right */}
      <rect x="248" y="5" width="10" height="10" rx="5" fill={accent} opacity="0.9" />
      <rect x="262" y="8" width="14" height="4" rx="1.5" fill={muted} />

      {/* Sidebar 60px */}
      <rect x="0" y="20" width="60" height="150" fill={chrome} />
      {/* Add button (accent) */}
      <rect x="6" y="28" width="48" height="12" rx="3" fill="rgba(174,234,0,0.16)" />
      <rect x="14" y="32" width="32" height="4" rx="1.5" fill={accent} />
      {/* Search */}
      <rect x="6" y="44" width="48" height="10" rx="3" fill={raised} />
      {/* Nav links — first active */}
      {[60, 76, 92, 108].map((y, i) => (
        <g key={y}>
          <rect x="6" y={y} width="48" height="12" rx="3"
            fill={i === 0 ? 'rgba(174,234,0,0.12)' : 'transparent'} />
          <rect x="11" y={y + 4} width="4" height="4" rx="1" fill={i === 0 ? accent : faint} />
          <rect x="20" y={y + 4} width={i === 0 ? 26 : 22} height="4" rx="1.5"
            fill={i === 0 ? text : muted} />
        </g>
      ))}

      {/* Hero KPI row */}
      {/* featured (1.6x) */}
      <rect x="68" y="28" width="80" height="46" rx="5" fill={card} />
      <rect x="68" y="28" width="80" height="46" rx="5" fill="rgba(174,234,0,0.08)" />
      <rect x="74" y="33" width="20" height="3" rx="1" fill={muted} />
      <rect x="74" y="42" width="40" height="10" rx="2" fill={accent} />
      <polyline points="74,68 80,64 86,66 92,60 98,63 104,57 110,60 116,55 122,58 128,52 134,55 140,49"
                fill="none" stroke={accent} strokeWidth="1.2" opacity="0.85" />
      {/* 4 standard KPI */}
      {[0, 1, 2, 3].map((i) => {
        const colors = [up, down, info, warn];
        const x = 152 + i * 32;
        return (
          <g key={i}>
            <rect x={x} y="28" width="28" height="46" rx="4" fill={card} />
            <rect x={x + 3} y="33" width="14" height="3" rx="1" fill={faint} />
            <rect x={x + 3} y="42" width="18" height="8" rx="2" fill={colors[i]} />
            <rect x={x + 3} y="58" width="22" height="2" rx="1" fill={raised} />
            <rect x={x + 3} y="58" width="14" height="2" rx="1" fill={colors[i]} opacity="0.8" />
          </g>
        );
      })}

      {/* Chart + donut row */}
      <rect x="68" y="80" width="130" height="50" rx="4" fill={card} />
      <polyline points="74,118 86,108 98,112 110,98 122,103 134,92 146,98 158,86 170,92 182,80 194,84"
                fill="none" stroke={up} strokeWidth="1.2" />
      <rect x="202" y="80" width="74" height="50" rx="4" fill={card} />
      <circle cx="220" cy="105" r="14" fill="none" stroke={accent} strokeWidth="3" strokeDasharray="50 100" />
      <circle cx="220" cy="105" r="14" fill="none" stroke={info} strokeWidth="3" strokeDasharray="20 100" strokeDashoffset="-50" />

      {/* Bottom 4 status cards */}
      {[0, 1, 2, 3].map((i) => {
        const x = 68 + i * 53;
        return (
          <g key={i}>
            <rect x={x} y="136" width="49" height="26" rx="4" fill={card} />
            <rect x={x + 4} y="141" width="6" height="6" rx="2" fill={accent} opacity="0.85" />
            <rect x={x + 14} y="142" width="22" height="3" rx="1" fill={text} />
            <rect x={x + 14} y="149" width="18" height="2" rx="1" fill={faint} />
          </g>
        );
      })}
    </svg>
  );
}

/* ─── ThemePicker ──────────────────────────────────────────────────────────── */

const THEMES: { id: AppTheme; label: string; Preview: () => JSX.Element }[] = [
  { id: 'obli-operator', label: 'Obli Operator', Preview: ObliOperatorPreviewSvg },
  { id: 'obli-dim', label: 'Obli Dim', Preview: DimPreviewSvg },
  { id: 'modern', label: 'Modern UI', Preview: ModernPreviewSvg },
  { id: 'neon',   label: 'Neon UI',   Preview: NeonPreviewSvg },
];

export function ThemePicker({ value, onChange }: ThemePickerProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {THEMES.map(({ id, label, Preview }) => {
        const selected = value === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={cn(
              'group relative rounded-xl border-2 p-2 text-left transition-all',
              selected
                ? 'border-primary shadow-[0_0_0_1px_rgb(var(--c-primary)/0.3)]'
                : 'border-border hover:border-primary/40 hover:bg-bg-hover',
            )}
          >
            {/* Preview SVG */}
            <div className={cn(
              'overflow-hidden rounded-lg ring-0 transition-all',
              selected ? 'ring-2 ring-primary/30' : 'group-hover:ring-1 group-hover:ring-primary/20',
            )}>
              <Preview />
            </div>

            {/* Label + checkmark */}
            <div className="mt-2.5 flex items-center justify-between px-1 pb-0.5">
              <span className={cn(
                'text-sm font-semibold',
                selected ? 'text-primary' : 'text-text-secondary',
              )}>
                {label}
              </span>
              {selected && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                  <Check size={11} className="text-bg-primary" strokeWidth={3} />
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
