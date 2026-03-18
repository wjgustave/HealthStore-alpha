interface IconProps {
  className?: string
}

export function LungsIcon({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.081 20C2.5 20 2 17.5 2 15.5c0-2 .5-4 2.5-6s3-4 3.5-6" />
      <path d="M17.919 20C21.5 20 22 17.5 22 15.5c0-2-.5-4-2.5-6s-3-4-3.5-6" />
      <path d="M12 4v16" />
    </svg>
  )
}

export function BrainIcon({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a5 5 0 0 0-4.78 3.5A4 4 0 0 0 4 9.5a4 4 0 0 0 1.5 3.12A3.5 3.5 0 0 0 5 15a3.5 3.5 0 0 0 3 3.46V22h4v-3.54A3.5 3.5 0 0 0 15 15a3.5 3.5 0 0 0-.5-2.38A4 4 0 0 0 16 9.5a4 4 0 0 0-3.22-3.93A5 5 0 0 0 12 2z" />
      <path d="M12 2v20" />
    </svg>
  )
}

export function ScaleIcon({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 3H8l-2 6h12l-2-6z" />
      <path d="M12 3v18" />
      <path d="M8 21h8" />
      <circle cx="12" cy="9" r="1" />
    </svg>
  )
}

export function JointIcon({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v4" />
      <path d="M12 18v4" />
      <circle cx="12" cy="9" r="3" />
      <circle cx="12" cy="15" r="3" />
    </svg>
  )
}

export function HeartCareIcon({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0L12 5.36l-.77-.78a5.4 5.4 0 0 0-7.65 7.65l1.06 1.06L12 20.71l7.36-7.36 1.06-1.06a5.4 5.4 0 0 0 0-7.65z" />
      <path d="M3.5 12h6l1-2 2 4 1-2h6.5" />
    </svg>
  )
}

export function SearchIcon({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}

export function ClipboardCheckIcon({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path d="M9 12l2 2 4-4" />
      <path d="M9 2v2h6V2" />
    </svg>
  )
}

export function BriefcaseIcon({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  )
}

const conditionIcons: Record<string, (props: IconProps) => React.ReactNode> = {
  copd: LungsIcon,
  insomnia: BrainIcon,
  weight_management: ScaleIcon,
  msk: JointIcon,
  eating_disorders: HeartCareIcon,
}

export function ConditionIcon({ condition, className }: { condition: string; className?: string }) {
  const Icon = conditionIcons[condition] ?? LungsIcon
  return <Icon className={className} />
}
