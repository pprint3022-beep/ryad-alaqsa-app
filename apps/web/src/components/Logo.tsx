import { useState } from 'react'
import { asset } from '../lib/asset'

interface LogoProps {
  size?: number
  className?: string
  /** Provide a label only when the logo stands alone; omit it when text follows. */
  label?: string
}

export default function Logo({ size = 40, className = '', label }: LogoProps) {
  const [failed, setFailed] = useState(false)
  const shared = {
    width: size,
    height: size,
    className: `shrink-0 ${className}`.trim(),
  }

  if (failed) {
    return (
      <svg
        {...shared}
        viewBox="0 0 64 64"
        role={label ? 'img' : undefined}
        aria-label={label}
        aria-hidden={label ? undefined : true}
      >
        <rect width="64" height="64" rx="18" fill="#5AA83A" />
        <rect x="10" y="27" width="5" height="15" rx="2" fill="#FFFFFF" opacity="0.95" />
        <circle cx="12.5" cy="25" r="3" fill="#FFFFFF" opacity="0.95" />
        <rect x="49" y="27" width="5" height="15" rx="2" fill="#FFFFFF" opacity="0.95" />
        <circle cx="51.5" cy="25" r="3" fill="#FFFFFF" opacity="0.95" />
        <path d="M32 10c-7.2 0-13 5.8-13 13v5h26v-5c0-7.2-5.8-13-13-13Z" fill="#FFFFFF" />
        <rect x="16" y="28" width="32" height="15" rx="2.5" fill="#FFFFFF" />
        <path d="M29 43v-7.5a3 3 0 0 1 6 0V43h-6Z" fill="#4C9130" />
        <path
          d="M14 45.5c6-2.5 12-2.5 18 0 6-2.5 12-2.5 18 0v5c-6-2.5-12-2.5-18 0-6-2.5-12-2.5-18 0v-5Z"
          fill="#FFFFFF"
        />
        <path d="M32 45.8v4.4" stroke="#4C9130" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="50" cy="14" r="5" fill="#F5B800" />
      </svg>
    )
  }

  return (
    <img
      {...shared}
      src={asset('/logo.svg')}
      alt={label ?? ''}
      onError={() => setFailed(true)}
      loading="eager"
      decoding="async"
    />
  )
}
