import { memo } from 'react'
import { Item } from '@/types'
import { useStore, calcPercent, calcWorkHours } from '@/store/useStore'
import { formatEUR, formatPercent, formatWorkTime } from '@/lib/utils'
import { PercentBar } from './PercentBar'
import { categoryIconsMedium } from './categoryIcons'
import { Clock } from 'lucide-react'

interface ItemCardProps {
  item: Item
}

// Memoize to skip re-renders when item and salary haven't changed (rerender-memo)
export const ItemCard = memo(function ItemCard({ item }: ItemCardProps) {
  const salary = useStore((s) => s.salary)
  const salaryMode = useStore((s) => s.salaryMode)
  const hoursPerWeek = useStore((s) => s.hoursPerWeek)
  const percent = calcPercent(item.price, salary, salaryMode)
  const workHours = calcWorkHours(item.price, salary, salaryMode, hoursPerWeek)

  return (
    <div className="item-card flex items-start gap-3 rounded-xl bg-card border border-border/50 p-3.5 shadow-sm">
      {/* Category icon */}
      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
        {categoryIconsMedium[item.category]}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold leading-tight truncate">
              {item.name}
            </h3>
            <p className="text-xs text-muted-foreground truncate">
              {item.description}
            </p>
          </div>
          <span className="shrink-0 text-sm font-semibold">
            {formatEUR(item.price)} €
          </span>
        </div>

        {/* Percent bar */}
        <div className="mt-2">
          <PercentBar percent={percent} />
        </div>

        {/* Percentage + work time on one line */}
        <div className="mt-1.5 flex items-center gap-1.5 text-xs">
          <span className="font-bold tabular-nums">
            {formatPercent(percent)}
          </span>
          {hoursPerWeek > 0 && (
            <>
              <span className="text-muted-foreground">·</span>
              <span className="flex items-center gap-1 font-bold tabular-nums">
                <Clock className="h-3 w-3 text-muted-foreground" />
                {formatWorkTime(workHours)}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
})
