import { memo } from 'react'
import { cn } from '@/lib/utils'

interface PercentBarProps {
  percent: number
}

function getBarColor(percent: number): string {
  if (percent < 1) return 'bg-emerald-500'
  if (percent < 10) return 'bg-yellow-500'
  if (percent < 50) return 'bg-orange-500'
  return 'bg-red-500'
}

// Memoize — only re-renders when percent value changes (rerender-memo)
export const PercentBar = memo(function PercentBar({ percent }: PercentBarProps) {
  // Cap the visual width at 100%
  const width = Math.min(percent, 100)

  return (
    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
      <div
        className={cn('h-full rounded-full transition-all duration-500 ease-out', getBarColor(percent))}
        style={{ width: `${width}%` }}
      />
    </div>
  )
})
