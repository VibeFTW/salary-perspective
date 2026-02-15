import { useState, useCallback, useRef, useEffect } from 'react'
import { useStore } from '@/store/useStore'
import { Button } from '@/components/ui/button'
import { ItemForm } from '@/components/ItemForm'
import { Item, Category } from '@/types'
import { formatEUR } from '@/lib/utils'
import { categoryIconsManage } from '@/components/categoryIcons'
import {
  Plus,
  Pencil,
  Trash2,
  RotateCcw,
  Clock,
  Star,
} from 'lucide-react'

export function ManagePage() {
  const items = useStore((s) => s.items)
  const addItem = useStore((s) => s.addItem)
  const updateItem = useStore((s) => s.updateItem)
  const deleteItem = useStore((s) => s.deleteItem)
  const resetItems = useStore((s) => s.resetItems)
  const hoursPerWeek = useStore((s) => s.hoursPerWeek)
  const setHoursPerWeek = useStore((s) => s.setHoursPerWeek)
  const favoriteIds = useStore((s) => s.favoriteIds)
  const toggleFavorite = useStore((s) => s.toggleFavorite)

  const [formOpen, setFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  // Key forces ItemForm to re-mount with fresh state (rerender-derived-state-no-effect)
  const [formKey, setFormKey] = useState(0)

  // --- Hours-per-week input state (same pattern as SalaryInput) ---
  const [hoursInput, setHoursInput] = useState(() =>
    hoursPerWeek.toString().replace('.', ',')
  )
  const hoursIsFocusedRef = useRef(false)

  useEffect(() => {
    if (!hoursIsFocusedRef.current) {
      setHoursInput(hoursPerWeek.toString().replace('.', ','))
    }
  }, [hoursPerWeek])

  const handleHoursFocus = useCallback(() => {
    hoursIsFocusedRef.current = true
    const current = useStore.getState().hoursPerWeek
    setHoursInput(current === 0 ? '' : current.toString().replace('.', ','))
  }, [])

  const handleHoursBlur = useCallback(() => {
    hoursIsFocusedRef.current = false
    setHoursInput((current) => {
      const parsed = parseFloat(current.replace(',', '.')) || 0
      const clamped = Math.max(0, Math.min(168, parsed))
      setHoursPerWeek(clamped)
      return clamped.toString().replace('.', ',')
    })
  }, [setHoursPerWeek])

  const handleHoursChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value
      setHoursInput(raw)
      const parsed = parseFloat(raw.replace(',', '.'))
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 168) {
        setHoursPerWeek(parsed)
      }
    },
    [setHoursPerWeek]
  )

  const handleAdd = () => {
    setEditingItem(null)
    setFormKey((k) => k + 1)
    setFormOpen(true)
  }

  const handleEdit = (item: Item) => {
    setEditingItem(item)
    setFormKey((k) => k + 1)
    setFormOpen(true)
  }

  const handleSave = (data: {
    name: string
    description: string
    price: number
    category: Category
  }) => {
    if (editingItem) {
      updateItem(editingItem.id, data)
    } else {
      addItem(data)
    }
  }

  const handleDelete = (id: string) => {
    deleteItem(id)
  }

  // Use toSorted() for immutability — avoids mutating original array (js-tosorted-immutable)
  const sorted = items.toSorted((a, b) => a.sortOrder - b.sortOrder)

  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <header className="border-b bg-background sticky top-0 z-30">
        <div className="mx-auto max-w-lg px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold">Sachen verwalten</h1>
            <Button variant="ghost" size="sm" onClick={resetItems} title="Auf Standard zurücksetzen">
              <RotateCcw className="h-4 w-4 mr-1.5" />
              Reset
            </Button>
          </div>
        </div>
      </header>

      {/* Settings section */}
      <div className="mx-auto w-full max-w-lg px-4 pt-4 pb-2">
        <div className="rounded-xl border border-border/50 bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Einstellungen</h2>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="hours-per-week" className="text-xs font-medium text-muted-foreground">
              Arbeitsstunden pro Woche
            </label>
            <div className="relative">
              <input
                id="hours-per-week"
                type="text"
                inputMode="decimal"
                value={hoursInput}
                onChange={handleHoursChange}
                onFocus={handleHoursFocus}
                onBlur={handleHoursBlur}
                placeholder="40"
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 pr-16 text-base font-semibold ring-offset-background placeholder:text-muted-foreground/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                Std / Woche
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Wird zur Berechnung der Arbeitszeit pro Artikel genutzt (× 52 Wochen)
            </p>
          </div>
        </div>
      </div>

      {/* Add button */}
      <div className="mx-auto w-full max-w-lg px-4 py-3">
        <Button onClick={handleAdd} className="w-full" size="lg">
          <Plus className="h-4 w-4 mr-2" />
          Was darf's noch kosten?
        </Button>
      </div>

      {/* Item list */}
      <main className="flex-1 mx-auto w-full max-w-lg px-4 pb-20">
        <div className="space-y-2">
          {sorted.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-xl border border-border/50 bg-card p-3 shadow-sm"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                {categoryIconsManage[item.category]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {item.description} · {formatEUR(item.price)} €
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 ${favoriteIds.includes(item.id) ? 'text-amber-500 hover:text-amber-600' : ''}`}
                  onClick={() => toggleFavorite(item.id)}
                  title={favoriteIds.includes(item.id) ? 'Favorit entfernen' : 'Als Favorit markieren'}
                >
                  <Star className={`h-3.5 w-3.5 ${favoriteIds.includes(item.id) ? 'fill-current' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleEdit(item)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Form dialog — key forces re-mount to reset form state */}
      <ItemForm
        key={formKey}
        open={formOpen}
        onOpenChange={setFormOpen}
        item={editingItem}
        onSave={handleSave}
      />
    </div>
  )
}
