import { useStore } from '@/store/useStore'
import { CATEGORIES, Category } from '@/types'
import { cn } from '@/lib/utils'
import { categoryIconsSmall } from './categoryIcons'
import { Star } from 'lucide-react'

/** Active-state colors matching each category's icon color */
const categoryActiveColors: Record<string, string> = {
  alle: 'bg-zinc-700 text-white',
  essen: 'bg-orange-500 text-white',
  wohnen: 'bg-blue-500 text-white',
  technik: 'bg-purple-500 text-white',
  freizeit: 'bg-emerald-500 text-white',
}

export function CategoryFilter() {
  const activeCategory = useStore((s) => s.activeCategory)
  const setActiveCategory = useStore((s) => s.setActiveCategory)
  const showFavorites = useStore((s) => s.showFavorites)
  const setShowFavorites = useStore((s) => s.setShowFavorites)

  const handleFavoritesClick = () => {
    setShowFavorites(!showFavorites)
  }

  return (
    <div className="flex flex-wrap gap-2 pb-1">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => setActiveCategory(cat.id as Category | 'alle')}
          className={cn(
            'flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium transition-all',
            activeCategory === cat.id
              ? `${categoryActiveColors[cat.id]} shadow-sm`
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          )}
        >
          {categoryIconsSmall[cat.id]}
          {cat.label}
        </button>
      ))}

      {/* Favorites filter */}
      <button
        onClick={handleFavoritesClick}
        className={cn(
          'flex items-center justify-center shrink-0 rounded-full p-2 transition-all',
          showFavorites
            ? 'bg-amber-500 text-white shadow-sm'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        )}
        title="Favoriten"
      >
        <Star className={cn('h-4 w-4', showFavorites && 'fill-current')} />
      </button>
    </div>
  )
}
