/**
 * Tiny SVG trend line built from REAL supplied values only.
 * It never invents or interpolates data: when fewer than two valid numbers are
 * available the component renders nothing, so a chart can never mislead.
 */
interface SparklineProps {
  values: Array<number | undefined>
  label: string
  tone?: 'brand' | 'gold'
}

export default function Sparkline({ values, label, tone = 'brand' }: SparklineProps) {
  const numbers = values.filter((value): value is number =>
    typeof value === 'number' && Number.isFinite(value),
  )
  if (numbers.length < 2) return null

  const min = Math.min(...numbers)
  const max = Math.max(...numbers)
  const span = max - min || 1
  const points = numbers
    .map((value, index) => {
      const x = (index / (numbers.length - 1)) * 100
      const y = 27 - ((value - min) / span) * 22
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
  const stroke = tone === 'gold' ? '#D49C00' : '#5AA83A'

  return (
    <svg
      viewBox="0 0 100 30"
      preserveAspectRatio="none"
      role="img"
      aria-label={label}
      className="h-8 w-full"
    >
      <polyline
        points={points}
        fill="none"
        stroke={stroke}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
