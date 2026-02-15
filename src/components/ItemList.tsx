import { useStore, toMonthlySalary } from '@/store/useStore'
import { formatEUR } from '@/lib/utils'
import { ItemCard } from './ItemCard'
import { Info } from 'lucide-react'

export function ItemList() {
  const items = useStore((s) => s.items)
  const activeCategory = useStore((s) => s.activeCategory)
  const salary = useStore((s) => s.salary)
  const salaryMode = useStore((s) => s.salaryMode)
  const sortMode = useStore((s) => s.sortMode)
  const monthlySalary = toMonthlySalary(salary, salaryMode)

  const filtered =
    activeCategory === 'alle'
      ? items
      : items.filter((item) => item.category === activeCategory)

  // Use toSorted() for immutability — avoids mutating original array (js-tosorted-immutable)
  // Sorting by price is equivalent to sorting by percentage/work-time (same salary divisor)
  const sorted = filtered.toSorted((a, b) => {
    if (sortMode === 'asc') return a.price - b.price
    if (sortMode === 'desc') return b.price - a.price
    return a.sortOrder - b.sortOrder
  })

  if (salary <= 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg font-medium text-muted-foreground">
          Gib oben dein Gehalt ein
        </p>
        <p className="text-sm text-muted-foreground/70 mt-1">
          um die Prozente zu sehen
        </p>
      </div>
    )
  }

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg font-medium text-muted-foreground">
          Keine Artikel in dieser Kategorie
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {/* Monthly salary basis banner */}
      <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
        <Info className="h-3.5 w-3.5 shrink-0" />
        <span>
          Werte basieren auf{' '}
          <span className="font-semibold text-foreground">
            {formatEUR(monthlySalary)} €
          </span>{' '}
          / Monat
          {salaryMode === 'yearly' && (
            <span className="ml-1">
              ({formatEUR(salary)} € / Jahr ÷ 12)
            </span>
          )}
        </span>
      </div>

      {sorted.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  )
}
