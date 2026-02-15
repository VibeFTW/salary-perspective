import { useStore } from '@/store/useStore'
import { CATEGORIES, Category } from '@/types'
import { cn } from '@/lib/utils'
import { categoryIconsSmall } from './categoryIcons'

export function CategoryFilter() {
  const activeCategory = useStore((s) => s.activeCategory)
  const setActiveCategory = useStore((s) => s.setActiveCategory)

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => setActiveCategory(cat.id as Category | 'alle')}
          className={cn(
            'flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium transition-all',
            activeCategory === cat.id
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          )}
        >
          {categoryIconsSmall[cat.id]}
          {cat.label}
        </button>
      ))}
    </div>
  )
}
