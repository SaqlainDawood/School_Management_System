import React from 'react';

/**
 * 3D Academic Mortarboard & Books Graphic for Hero Banner
 */
export const HeroAcademicGraphic = ({ className = "w-44 h-32" }) => (
  <svg
    viewBox="0 0 200 150"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="heroBookBlue" x1="20" y1="90" x2="160" y2="140" gradientUnits="userSpaceOnUse">
        <stop stopColor="#2563EB" />
        <stop offset="1" stopColor="#1D4ED8" />
      </linearGradient>
      <linearGradient id="heroBookPages" x1="30" y1="100" x2="150" y2="120" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F8FAFC" />
        <stop offset="1" stopColor="#E2E8F0" />
      </linearGradient>
      <linearGradient id="heroCapTop" x1="50" y1="20" x2="160" y2="70" gradientUnits="userSpaceOnUse">
        <stop stopColor="#3B82F6" />
        <stop offset="0.5" stopColor="#1D4ED8" />
        <stop offset="1" stopColor="#1E3A8A" />
      </linearGradient>
      <linearGradient id="heroCapBand" x1="75" y1="60" x2="135" y2="85" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1E40AF" />
        <stop offset="1" stopColor="#0F172A" />
      </linearGradient>
      <linearGradient id="heroTassel" x1="105" y1="45" x2="165" y2="85" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FBBF24" />
        <stop offset="1" stopColor="#D97706" />
      </linearGradient>
      <filter id="heroGlow" x="0" y="0" width="200" height="150" filterUnits="userSpaceOnUse">
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    {/* Ambient backlight */}
    <ellipse cx="110" cy="80" rx="60" ry="40" fill="#3B82F6" fillOpacity="0.25" filter="url(#heroGlow)" />

    {/* Bottom Book */}
    <g transform="translate(10, 15)">
      {/* Book Cover Base */}
      <path
        d="M30 102 L140 85 L165 98 L50 115 Z"
        fill="url(#heroBookBlue)"
      />
      {/* Book Pages */}
      <path
        d="M33 98 L138 82 L138 88 L33 104 Z"
        fill="url(#heroBookPages)"
      />
      {/* Book Spine */}
      <path
        d="M30 96 C26 97 24 105 28 109 L48 116 C46 110 46 102 48 99 Z"
        fill="#1E3A8A"
      />
    </g>

    {/* Top Book */}
    <g transform="translate(5, 5)">
      <path
        d="M40 86 L145 70 L168 82 L58 98 Z"
        fill="#2563EB"
      />
      <path
        d="M43 82 L143 67 L143 72 L43 87 Z"
        fill="#FFFFFF"
      />
      <path
        d="M40 80 C36 81 35 88 38 93 L56 99 C54 94 54 87 56 83 Z"
        fill="#1D4ED8"
      />
    </g>

    {/* Graduation Cap Skull Cap (Head band) */}
    <path
      d="M80 62 C80 62 82 78 108 82 C134 82 138 67 138 67 L132 58 C120 63 95 63 85 58 Z"
      fill="url(#heroCapBand)"
    />

    {/* Mortarboard Diamond Top */}
    <path
      d="M108 26 L168 46 L108 66 L48 46 Z"
      fill="url(#heroCapTop)"
      stroke="#60A5FA"
      strokeWidth="1.5"
    />

    {/* Mortarboard Edge highlight */}
    <path
      d="M48 46 L108 66 L168 46 L168 50 L108 70 L48 50 Z"
      fill="#1E3A8A"
      opacity="0.8"
    />

    {/* Cap Center Button */}
    <ellipse cx="108" cy="46" rx="4" ry="2.5" fill="#93C5FD" />

    {/* Hanging Tassel */}
    <path
      d="M108 46 C125 48 148 52 152 64 C154 70 152 78 152 88"
      stroke="url(#heroTassel)"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />
    {/* Tassel Fringe */}
    <path
      d="M149 84 L155 84 L157 96 L147 96 Z"
      fill="#F59E0B"
    />
    <circle cx="152" cy="84" r="2" fill="#FCD34D" />
  </svg>
);

/**
 * 3D Cap & Scroll Icon for Personal Information Card
 */
export const CapScroll3DIcon = ({ className = "w-20 h-20" }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="capGlow" cx="50%" cy="50%" r="50%">
        <stop stopColor="#818CF8" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="capDiamond" x1="20" y1="30" x2="80" y2="55" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6366F1" />
        <stop offset="0.5" stopColor="#4F46E5" />
        <stop offset="1" stopColor="#3730A3" />
      </linearGradient>
      <linearGradient id="scrollBody" x1="20" y1="65" x2="85" y2="85" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFFFFF" />
        <stop offset="1" stopColor="#CBD5E1" />
      </linearGradient>
      <linearGradient id="ribbonGrad" x1="45" y1="65" x2="55" y2="85" gradientUnits="userSpaceOnUse">
        <stop stopColor="#4F46E5" />
        <stop offset="1" stopColor="#312E81" />
      </linearGradient>
    </defs>

    {/* Ambient Back Glow */}
    <circle cx="50" cy="50" r="44" fill="url(#capGlow)" />

    {/* Diploma Scroll */}
    <g transform="rotate(-6 50 72)">
      {/* Scroll Cylinder */}
      <rect x="22" y="66" width="56" height="14" rx="4" fill="url(#scrollBody)" />
      {/* Left rolled end */}
      <ellipse cx="22" cy="73" rx="3" ry="7" fill="#E2E8F0" />
      <ellipse cx="22" cy="73" rx="1.5" ry="4" fill="#94A3B8" />
      {/* Ribbon Wrap */}
      <rect x="46" y="65.5" width="8" height="15" rx="1.5" fill="url(#ribbonGrad)" />
      {/* Ribbon Tails */}
      <path d="M47 80 L44 91 L50 88 L55 92 L53 80 Z" fill="#4338CA" />
    </g>

    {/* Mortarboard Skullcap */}
    <path
      d="M36 43 C36 43 38 56 50 58 C62 58 64 45 64 45 L60 38 C54 41 42 41 38 38 Z"
      fill="#312E81"
    />

    {/* Mortarboard Diamond Top */}
    <path
      d="M50 20 L84 34 L50 48 L16 34 Z"
      fill="url(#capDiamond)"
      stroke="#A5B4FC"
      strokeWidth="1.2"
    />
    {/* Diamond Edge Depth */}
    <path
      d="M16 34 L50 48 L84 34 L84 37 L50 51 L16 37 Z"
      fill="#312E81"
    />

    {/* Cap Button */}
    <ellipse cx="50" cy="34" rx="3" ry="2" fill="#E0E7FF" />

    {/* Cap Tassel */}
    <path
      d="M50 34 C60 36 72 38 74 46 C75 50 74 56 74 62"
      stroke="#FBBF24"
      strokeWidth="1.8"
      strokeLinecap="round"
      fill="none"
    />
    <rect x="72" y="58" width="4" height="7" rx="1" fill="#F59E0B" />
  </svg>
);

/**
 * 3D Glossy Green Mail Envelope Icon for Contact Details Card
 */
export const Mail3DIcon = ({ className = "w-20 h-20" }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="mailGlow" cx="50%" cy="50%" r="50%">
        <stop stopColor="#34D399" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#059669" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="envelopeBody" x1="18" y1="36" x2="82" y2="82" gradientUnits="userSpaceOnUse">
        <stop stopColor="#10B981" />
        <stop offset="0.6" stopColor="#059669" />
        <stop offset="1" stopColor="#047857" />
      </linearGradient>
      <linearGradient id="envelopeFlap" x1="20" y1="34" x2="80" y2="60" gradientUnits="userSpaceOnUse">
        <stop stopColor="#34D399" />
        <stop offset="1" stopColor="#10B981" />
      </linearGradient>
      <linearGradient id="paperGrad" x1="26" y1="22" x2="74" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFFFFF" />
        <stop offset="1" stopColor="#ECFDF5" />
      </linearGradient>
    </defs>

    {/* Glow Backdrop */}
    <circle cx="50" cy="50" r="44" fill="url(#mailGlow)" />

    {/* Envelope Shadow */}
    <ellipse cx="50" cy="80" rx="34" ry="7" fill="#047857" fillOpacity="0.25" />

    {/* Letter Paper peeking out */}
    <path
      d="M26 30 C26 27 28 25 31 25 L69 25 C72 25 74 27 74 30 L74 54 L26 54 Z"
      fill="url(#paperGrad)"
      stroke="#D1FAE5"
      strokeWidth="1"
    />
    {/* Lines on Letter */}
    <line x1="33" y1="32" x2="55" y2="32" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
    <line x1="33" y1="38" x2="65" y2="38" stroke="#A7F3D0" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="33" y1="44" x2="60" y2="44" stroke="#A7F3D0" strokeWidth="1.8" strokeLinecap="round" />

    {/* Envelope Main Pocket Body */}
    <rect x="18" y="38" width="64" height="40" rx="8" fill="url(#envelopeBody)" />

    {/* Envelope Pocket Front Folds */}
    <path
      d="M18 41 L50 63 L82 41 L82 70 C82 74.4 78.4 78 74 78 L26 78 C21.6 78 18 74.4 18 70 Z"
      fill="#059669"
      opacity="0.95"
    />

    {/* Fold highlight line */}
    <path
      d="M18 41 L47 62 C48.8 63.3 51.2 63.3 53 62 L82 41"
      stroke="#34D399"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Center Seal Stamp */}
    <circle cx="50" cy="62" r="5" fill="#34D399" />
    <path d="M47.5 62 L49.5 64 L53 59.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * 3D Neoclassical School Campus Building Icon for Institutional Details Card
 */
export const Campus3DIcon = ({ className = "w-20 h-20" }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="campusGlow" cx="50%" cy="50%" r="50%">
        <stop stopColor="#60A5FA" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="roofGrad" x1="20" y1="30" x2="80" y2="45" gradientUnits="userSpaceOnUse">
        <stop stopColor="#3B82F6" />
        <stop offset="1" stopColor="#1D4ED8" />
      </linearGradient>
      <linearGradient id="wallGrad" x1="25" y1="45" x2="75" y2="80" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFFFFF" />
        <stop offset="1" stopColor="#E2E8F0" />
      </linearGradient>
      <linearGradient id="treeGrad" x1="10" y1="60" x2="25" y2="80" gradientUnits="userSpaceOnUse">
        <stop stopColor="#34D399" />
        <stop offset="1" stopColor="#059669" />
      </linearGradient>
    </defs>

    {/* Glow Backdrop */}
    <circle cx="50" cy="50" r="44" fill="url(#campusGlow)" />

    {/* Base Lawn / Ground Platform */}
    <ellipse cx="50" cy="82" rx="38" ry="7" fill="#E0F2FE" />
    <path d="M15 82 C15 80 85 80 85 82 C85 86 15 86 15 82 Z" fill="#BAE6FD" />

    {/* Left Tree */}
    <g transform="translate(10, 52)">
      <rect x="7" y="18" width="3" height="8" rx="1.5" fill="#78350F" />
      <circle cx="8.5" cy="14" r="8" fill="url(#treeGrad)" />
      <circle cx="6" cy="11" r="5" fill="#6EE7B7" opacity="0.6" />
    </g>

    {/* Right Tree */}
    <g transform="translate(73, 52)">
      <rect x="7" y="18" width="3" height="8" rx="1.5" fill="#78350F" />
      <circle cx="8.5" cy="14" r="8" fill="url(#treeGrad)" />
      <circle cx="11" cy="11" r="5" fill="#6EE7B7" opacity="0.6" />
    </g>

    {/* Main Building Body */}
    <rect x="25" y="44" width="50" height="34" rx="2" fill="url(#wallGrad)" />

    {/* Triangular Pediment / Roof */}
    <path d="M50 24 L22 42 L78 42 Z" fill="url(#roofGrad)" />
    {/* Roof cornice trim */}
    <rect x="20" y="41" width="60" height="3.5" rx="1" fill="#1E40AF" />

    {/* Clock/Emblem in pediment */}
    <circle cx="50" cy="35" r="3.5" fill="#FFFFFF" />
    <circle cx="50" cy="35" r="2.5" fill="#60A5FA" />

    {/* Neoclassical Pillars (4 columns) */}
    <rect x="29" y="44.5" width="4" height="28" rx="1" fill="#CBD5E1" />
    <rect x="41" y="44.5" width="4" height="28" rx="1" fill="#CBD5E1" />
    <rect x="55" y="44.5" width="4" height="28" rx="1" fill="#CBD5E1" />
    <rect x="67" y="44.5" width="4" height="28" rx="1" fill="#CBD5E1" />

    {/* Central Grand Entrance Arch Doorway */}
    <path d="M46 76 L46 62 C46 59.8 47.8 58 50 58 C52.2 58 54 59.8 54 62 L54 76 Z" fill="#1E3A8A" />

    {/* Side Windows */}
    <rect x="34" y="52" width="5" height="7" rx="1" fill="#93C5FD" />
    <rect x="61" y="52" width="5" height="7" rx="1" fill="#93C5FD" />

    {/* Entrance Steps */}
    <rect x="42" y="74" width="16" height="2.5" rx="0.5" fill="#94A3B8" />
    <rect x="40" y="76.5" width="20" height="2.5" rx="0.5" fill="#64748B" />
  </svg>
);

/**
 * 3D Golden Amber Security Shield Icon for Account Security Card
 */
export const Shield3DIcon = ({ className = "w-20 h-20" }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="shieldGlow" cx="50%" cy="50%" r="50%">
        <stop stopColor="#FBBF24" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="shieldOuter" x1="22" y1="20" x2="78" y2="82" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FDE68A" />
        <stop offset="0.3" stopColor="#F59E0B" />
        <stop offset="1" stopColor="#B45309" />
      </linearGradient>
      <linearGradient id="shieldInner" x1="28" y1="26" x2="72" y2="76" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FBBF24" />
        <stop offset="0.5" stopColor="#F59E0B" />
        <stop offset="1" stopColor="#D97706" />
      </linearGradient>
      <linearGradient id="lockMetal" x1="42" y1="46" x2="58" y2="66" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFFFFF" />
        <stop offset="1" stopColor="#FEF3C7" />
      </linearGradient>
    </defs>

    {/* Glow Backdrop */}
    <circle cx="50" cy="50" r="44" fill="url(#shieldGlow)" />

    {/* Outer Shield Shell */}
    <path
      d="M50 18 C64 18 78 23 78 23 C78 48 72 71 50 84 C28 71 22 48 22 23 C22 23 36 18 50 18 Z"
      fill="url(#shieldOuter)"
      stroke="#FDE68A"
      strokeWidth="1.5"
    />

    {/* Inner Shield Bevel */}
    <path
      d="M50 24 C61 24 72 28 72 28 C72 48 66 67 50 78 C34 67 28 48 28 28 C28 28 39 24 50 24 Z"
      fill="url(#shieldInner)"
    />

    {/* Glossy Diagonal Reflection */}
    <path
      d="M50 24 C57 24 64 26 67 27 C63 46 54 62 42 71 C47 62 50 51 50 38 C50 33 49 28 48 24 Z"
      fill="#FFFFFF"
      fillOpacity="0.25"
    />

    {/* Central 3D Padlock */}
    {/* Padlock Shackle */}
    <path
      d="M44 48 L44 43 C44 39.7 46.7 37 50 37 C53.3 37 56 39.7 56 43 L56 48"
      stroke="#FFFFFF"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    {/* Padlock Body */}
    <rect x="40" y="47" width="20" height="17" rx="3.5" fill="url(#lockMetal)" stroke="#FDE68A" strokeWidth="1" />
    {/* Keyhole */}
    <circle cx="50" cy="54" r="2.5" fill="#92400E" />
    <path d="M49 54 L51 54 L51.5 60 L48.5 60 Z" fill="#92400E" />
  </svg>
);

