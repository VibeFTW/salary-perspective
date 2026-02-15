import { useState } from 'react'
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
} from 'lucide-react'

export function ManagePage() {
  const items = useStore((s) => s.items)
  const addItem = useStore((s) => s.addItem)
  const updateItem = useStore((s) => s.updateItem)
  const deleteItem = useStore((s) => s.deleteItem)
  const resetItems = useStore((s) => s.resetItems)

  const [formOpen, setFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  // Key forces ItemForm to re-mount with fresh state (rerender-derived-state-no-effect)
  const [formKey, setFormKey] = useState(0)

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

      {/* Add button */}
      <div className="mx-auto w-full max-w-lg px-4 py-3">
        <Button onClick={handleAdd} className="w-full" size="lg">
          <Plus className="h-4 w-4 mr-2" />
          Neue Sache hinzufügen
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
