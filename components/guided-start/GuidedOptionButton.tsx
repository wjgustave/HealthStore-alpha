'use client'

export default function GuidedOptionButton({
  label,
  onSelect,
}: {
  label: string
  onSelect: () => void
}) {
  return (
    <button type="button" className="hs-question-option" onClick={onSelect}>
      {label}
    </button>
  )
}
