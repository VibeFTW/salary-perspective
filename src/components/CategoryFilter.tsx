import { useStore } from '@/store/useStore'
import { CATEGORIES, Category } from '@/types'
import { cn } from '@/lib/utils'
import {
  UtensilsCrossed,
  Home,
  Smartphone,
  PartyPopper,
  LayoutGrid,
} from 'lucide-react'

const categoryIcons: Record<string, React.ReactNode> = {
  alle: <LayoutGrid className="h-3.5 w-3.5" />,
  essen: <UtensilsCrossed className="h-3.5 w-3.5" />,
  wohnen: <Home className="h-3.5 w-3.5" />,
  technik: <Smartphone className="h-3.5 w-3.5" />,
  freizeit: <PartyPopper className="h-3.5 w-3.5" />,
}

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
          {categoryIcons[cat.id]}
          {cat.label}
        </button>
      ))}
    </div>
  )
}
