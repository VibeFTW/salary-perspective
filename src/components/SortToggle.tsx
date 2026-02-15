import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useStore } from '@/store/useStore'
import { SortMode } from '@/types'
import { ArrowDownNarrowWide, ArrowUpNarrowWide, GripVertical } from 'lucide-react'

export function SortToggle() {
  const sortMode = useStore((s) => s.sortMode)
  const setSortMode = useStore((s) => s.setSortMode)

  return (
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
  )
}
