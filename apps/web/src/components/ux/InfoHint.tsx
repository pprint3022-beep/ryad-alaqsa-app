import { useId, useState } from 'react'
import { Info } from 'lucide-react'

/**
 * Small accessible popover that explains WHAT a metric means and WHERE it
 * comes from. Uses a real button with aria-expanded, so it works by keyboard
 * and is announced by screen readers.
 */
interface InfoHintProps {
  label: string
  text: string
}

export default function InfoHint({ label, text }: InfoHintProps) {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  return (
    <span className="relative inline-flex align-middle">
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="grid h-5 w-5 place-items-center rounded-full text-muted transition hover:bg-brand-soft hover:text-brand-700 dark:hover:text-brand-300"
      >
        <Info className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      {open ? (
        <span
          id={panelId}
          role="note"
          className="absolute end-0 top-full z-30 mt-2 w-60 animate-pop rounded-card border-2 border-line bg-surface p-3 text-start text-[10px] font-semibold leading-relaxed text-content shadow-card"
        >
          {text}
        </span>
      ) : null}
    </span>
  )
}
