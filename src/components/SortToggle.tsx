import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useStore } from '@/store/useStore'
import { cn } from '@/lib/utils'
import { SortMode } from '@/types'
import { ArrowDownNarrowWide, ArrowUpNarrowWide, GripVertical, Star } from 'lucide-react'

export function SortToggle() {
  const sortMode = useStore((s) => s.sortMode)
  const setSortMode = useStore((s) => s.setSortMode)
  const showFavorites = useStore((s) => s.showFavorites)
  const setShowFavorites = useStore((s) => s.setShowFavorites)

  return (
    <div className="flex items-center gap-2">
      <ToggleGroup
        type="single"
        value={sortMode}
        onValueChange={(value) => {
          if (value) setSortMode(value as SortMode)
        }}
      >
        <ToggleGroupItem value="default" aria-label="Standard-Sortierung">
          <GripVertical className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="asc" aria-label="Aufsteigend sortieren">
          <ArrowUpNarrowWide className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="desc" aria-label="Absteigend sortieren">
          <ArrowDownNarrowWide className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>

      {/* Favorites filter */}
      <button
        onClick={() => setShowFavorites(!showFavorites)}
        className={cn(
          'flex items-center justify-center rounded-md p-2 transition-all',
          showFavorites
            ? 'bg-amber-500 text-white shadow-sm'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        )}
        title="Nur Favoriten anzeigen"
        aria-label="Nur Favoriten anzeigen"
      >
        <Star className={cn('h-4 w-4', showFavorites && 'fill-current')} />
      </button>
    </div>
  )
}
