// ═══════════════════════════════════════════════════════════
// ICONS — Collab-Hub SVG İkon Seti
// ═══════════════════════════════════════════════════════════
//
// Tüm ikonlar `currentColor` kullanır → parent'tan renk alır.
// Kullanım: <Icon.Star className="w-4 h-4 text-accent" />
//
// Varsayılan: fill="none" stroke="currentColor" (outline stil)
// Bazıları: fill="currentColor" (dolu stil, ör. yıldız)
// ═══════════════════════════════════════════════════════════

// ─── GENEL BASE (tüm outline ikonlar bunu kullanır) ───
const Svg = ({ children, className = '', strokeWidth = 2, viewBox = '0 0 24 24', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox={viewBox}
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    {children}
  </svg>
);

// ─── BASE (dolu/fill ikonlar için) ───
const SvgFill = ({ children, className = '', viewBox = '0 0 24 24', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox={viewBox}
    fill="currentColor"
    className={className}
    aria-hidden="true"
    {...props}
  >
    {children}
  </svg>
);

// ═══════════════════════════════════════════════════════════
// NAVIGASYON
// ═══════════════════════════════════════════════════════════

export const Menu = ({ className, ...p }) => (
  <Svg className={className} {...p}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </Svg>
);

export const Close = ({ className, ...p }) => (
  <Svg className={className} {...p}>
    <path d="M6 18L18 6M6 6l12 12" />
  </Svg>
);

export const Search = ({ className, ...p }) => (
  <Svg className={className} {...p}>
    <path d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
  </Svg>
);

export const ArrowLeft = ({ className, ...p }) => (
  <Svg className={className} {...p}>
    <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </Svg>
);

export const ArrowRight = ({ className, ...p }) => (
  <Svg className={className} {...p}>
    <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </Svg>
);

export const ChevronDown = ({ className, ...p }) => (
  <Svg className={className} {...p}>
    <path d="M19 9l-7 7-7-7" />
  </Svg>
);

export const ChevronUp = ({ className, ...p }) => (
  <Svg className={className} {...p}>
    <path d="M5 15l7-7 7 7" />
  </Svg>
);

export const ExternalLink = ({ className, ...p }) => (
  <Svg className={className} {...p}>
    <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </Svg>
);

// ═══════════════════════════════════════════════════════════
// DURUM / AKSİYON
// ═══════════════════════════════════════════════════════════

export const Plus = ({ className, ...p }) => (
  <Svg className={className} strokeWidth={2.5} {...p}>
    <path d="M12 4v16m8-8H4" />
  </Svg>
);

export const Check = ({ className, ...p }) => (
  <Svg className={className} {...p}>
    <path d="M5 13l4 4L19 7" />
  </Svg>
);

export const Trash = ({ className, ...p }) => (
  <Svg className={className} {...p}>
    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </Svg>
);

export const Edit = ({ className, ...p }) => (
  <Svg className={className} {...p}>
    <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </Svg>
);

export const Copy = ({ className, ...p }) => (
  <Svg className={className} {...p}>
    <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </Svg>
);

export const Logout = ({ className, ...p }) => (
  <Svg className={className} {...p}>
    <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </Svg>
);

export const Login = ({ className, ...p }) => (
  <Svg className={className} {...p}>
    <path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
  </Svg>
);

export const Settings = ({ className, ...p }) => (
  <Svg className={className} {...p}>
    <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </Svg>
);

export const Warning = ({ className, ...p }) => (
  <Svg className={className} {...p}>
    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </Svg>
);

export const Info = ({ className, ...p }) => (
  <Svg className={className} {...p}>
    <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </Svg>
);

// ═══════════════════════════════════════════════════════════
// İÇERİK / VERİ
// ═══════════════════════════════════════════════════════════

export const Folder = ({ className, ...p }) => (
  <Svg className={className} strokeWidth={1.75} {...p}>
    <path d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
  </Svg>
);

export const Star = ({ className, ...p }) => (
  <Svg className={className} strokeWidth={1.75} {...p}>
    <path d="M11.48 3.5a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
  </Svg>
);

export const StarFilled = ({ className, ...p }) => (
  <SvgFill className={className} {...p}>
    <path d="M12 2.5l3.09 6.26L22 9.77l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.64l-5-4.87 6.91-1.01L12 2.5z" />
  </SvgFill>
);

export const Users = ({ className, ...p }) => (
  <Svg className={className} strokeWidth={1.75} {...p}>
    <path d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </Svg>
);

export const User = ({ className, ...p }) => (
  <Svg className={className} {...p}>
    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </Svg>
);

export const Mail = ({ className, ...p }) => (
  <Svg className={className} strokeWidth={1.75} {...p}>
    <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </Svg>
);

export const Inbox = ({ className, ...p }) => (
  <Svg className={className} {...p}>
    <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
  </Svg>
);

export const Package = ({ className, ...p }) => (
  <Svg className={className} {...p}>
    <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </Svg>
);

export const Handshake = ({ className, ...p }) => (
  <Svg className={className} {...p}>
    <path d="M7 11l5-5m0 0l5 5m-5-5v12" />
  </Svg>
);

// ═══════════════════════════════════════════════════════════
// GÖRÜNÜM
// ═══════════════════════════════════════════════════════════

export const LayoutGrid = ({ className, ...p }) => (
  <Svg className={className} {...p}>
    <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </Svg>
);

export const List = ({ className, ...p }) => (
  <Svg className={className} {...p}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </Svg>
);

export const Image = ({ className, ...p }) => (
  <Svg className={className} strokeWidth={1.5} {...p}>
    <path d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </Svg>
);

export const Clock = ({ className, ...p }) => (
  <Svg className={className} {...p}>
    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </Svg>
);

export const Calendar = ({ className, ...p }) => (
  <Svg className={className} {...p}>
    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </Svg>
);

// ═══════════════════════════════════════════════════════════
// SOSYAL
// ═══════════════════════════════════════════════════════════

export const Github = ({ className, ...p }) => (
  <SvgFill className={className} {...p}>
    <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 015.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.41.35.78 1.05.78 2.12 0 1.53-.01 2.76-.01 3.13 0 .31.21.67.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.73 18.27.5 12 .5z" />
  </SvgFill>
);

export const Twitter = ({ className, ...p }) => (
  <SvgFill className={className} {...p}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </SvgFill>
);

export const Link = ({ className, ...p }) => (
  <Svg className={className} {...p}>
    <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </Svg>
);

// ═══════════════════════════════════════════════════════════
// ÖZEL
// ═══════════════════════════════════════════════════════════

export const Command = ({ className, ...p }) => (
  <Svg className={className} {...p}>
    <path d="M15 6v12a3 3 0 11-3-3m0-6V6a3 3 0 10-3 3m6 0H6a3 3 0 100 6h12a3 3 0 100-6h-3z" />
  </Svg>
);

export const Sparkles = ({ className, ...p }) => (
  <Svg className={className} {...p}>
    <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </Svg>
);