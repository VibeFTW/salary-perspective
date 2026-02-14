import { Item } from '@/types'
import { useStore, calcPercent } from '@/store/useStore'
import { formatEUR, formatPercent } from '@/lib/utils'
import { PercentBar } from './PercentBar'
import {
  UtensilsCrossed,
  Home,
  Smartphone,
  PartyPopper,
} from 'lucide-react'

const categoryIcons: Record<string, React.ReactNode> = {
  essen: <UtensilsCrossed className="h-5 w-5 text-orange-500" />,
  wohnen: <Home className="h-5 w-5 text-blue-500" />,
  technik: <Smartphone className="h-5 w-5 text-purple-500" />,
  freizeit: <PartyPopper className="h-5 w-5 text-emerald-500" />,
}

interface ItemCardProps {
  item: Item
}

export function ItemCard({ item }: ItemCardProps) {
  const salary = useStore((s) => s.salary)
  const percent = calcPercent(item.price, salary)

  return (
    <div className="flex items-start gap-3 rounded-xl bg-card border border-border/50 p-3.5 shadow-sm">
      {/* Category icon */}
      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
        {categoryIcons[item.category]}
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

        {/* Percent bar + value */}
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1">
            <PercentBar percent={percent} />
          </div>
          <span className="shrink-0 text-xs font-bold tabular-nums min-w-[60px] text-right">
            {formatPercent(percent)}
          </span>
        </div>
      </div>
    </div>
  )
}
