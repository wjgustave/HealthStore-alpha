export default function HeroPathwayVisual() {
  return (
    <svg className="hs-hero-svg" viewBox="0 0 420 280" role="img" aria-label="Digital therapeutic pathway: patient need, app intervention, improved outcomes">
      <defs>
        <linearGradient id="hs-hero-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#005eb8" />
          <stop offset="100%" stopColor="#007f3b" />
        </linearGradient>
      </defs>
      {/* Patient need */}
      <rect x="20" y="100" width="100" height="64" rx="8" fill="#f0f4f5" stroke="#d8dde0" />
      <text x="70" y="128" textAnchor="middle" fill="#212b32" fontSize="12" fontWeight="600">Local need</text>
      <text x="70" y="148" textAnchor="middle" fill="#4c6272" fontSize="11">Pathway gap</text>

      {/* Arrow 1 */}
      <path d="M130 132 L165 132" stroke="#005eb8" strokeWidth="2" markerEnd="url(#arrow)" />
      <polygon points="165,132 158,128 158,136" fill="#005eb8" />

      {/* DTx intervention - pulsing */}
      <g className="hs-hero-pulse">
        <rect x="175" y="88" width="110" height="88" rx="10" fill="#e6f0fb" stroke="#005eb8" strokeWidth="2" />
        <text x="230" y="118" textAnchor="middle" fill="#005eb8" fontSize="13" fontWeight="700">Digital</text>
        <text x="230" y="136" textAnchor="middle" fill="#005eb8" fontSize="13" fontWeight="700">therapeutic</text>
        <text x="230" y="158" textAnchor="middle" fill="#4c6272" fontSize="10">Monitoring · Self-mgmt</text>
      </g>

      {/* Arrow 2 */}
      <path d="M295 132 L330 132" stroke="#007f3b" strokeWidth="2" />
      <polygon points="330,132 323,128 323,136" fill="#007f3b" />

      {/* Outcomes */}
      <rect x="340" y="72" width="70" height="44" rx="6" fill="#e6f5ec" stroke="#007f3b" />
      <text x="375" y="92" textAnchor="middle" fill="#004b22" fontSize="10" fontWeight="600">Fewer</text>
      <text x="375" y="106" textAnchor="middle" fill="#004b22" fontSize="10" fontWeight="600">admissions</text>

      <rect x="340" y="124" width="70" height="44" rx="6" fill="#e6f5ec" stroke="#007f3b" />
      <text x="375" y="144" textAnchor="middle" fill="#004b22" fontSize="10" fontWeight="600">Released</text>
      <text x="375" y="158" textAnchor="middle" fill="#004b22" fontSize="10" fontWeight="600">capacity</text>

      <rect x="340" y="176" width="70" height="44" rx="6" fill="#e6f5ec" stroke="#007f3b" />
      <text x="375" y="196" textAnchor="middle" fill="#004b22" fontSize="10" fontWeight="600">Better</text>
      <text x="375" y="210" textAnchor="middle" fill="#004b22" fontSize="10" fontWeight="600">outcomes</text>

      {/* Bottom flow line */}
      <path d="M70 200 Q210 250 350 200" fill="none" stroke="url(#hs-hero-grad)" strokeWidth="3" strokeDasharray="6 4" opacity="0.6" />
      <text x="210" y="268" textAnchor="middle" fill="#4c6272" fontSize="11">Need-first · Impact-led · Locally relevant</text>
    </svg>
  )
}
