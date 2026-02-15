import { useStore } from '@/store/useStore'
import { ItemCard } from './ItemCard'

export function ItemList() {
  const items = useStore((s) => s.items)
  const activeCategory = useStore((s) => s.activeCategory)
  const salary = useStore((s) => s.salary)
  const sortMode = useStore((s) => s.sortMode)

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
      {sorted.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  )
}
