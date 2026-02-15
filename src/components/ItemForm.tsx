import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Item, Category } from '@/types'
import { parseGermanNumber } from '@/lib/utils'

interface ItemFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item?: Item | null
  onSave: (data: { name: string; description: string; price: number; category: Category }) => void
}

// State is initialized from props on mount. Parent uses a key to force
// re-mount when editing a different item (rerender-derived-state-no-effect).
export function ItemForm({ open, onOpenChange, item, onSave }: ItemFormProps) {
  const [name, setName] = useState(item?.name ?? '')
  const [description, setDescription] = useState(item?.description ?? '')
  const [priceStr, setPriceStr] = useState(
    item ? item.price.toString().replace('.', ',') : ''
  )
  const [category, setCategory] = useState<Category>(item?.category ?? 'essen')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const price = parseGermanNumber(priceStr)
    if (!name.trim() || price <= 0) return

    onSave({
      name: name.trim(),
      description: description.trim(),
      price,
      category,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-md rounded-xl">
        <DialogHeader>
          <DialogTitle>
            {item ? 'Artikel bearbeiten' : 'Neuen Artikel hinzufügen'}
          </DialogTitle>
          <DialogDescription>
            {item
              ? 'Passe die Details dieses Artikels an.'
              : 'Füge einen neuen Artikel mit Name, Beschreibung und Preis hinzu.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="z.B. Döner"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Beschreibung</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="z.B. Klassiker vom Imbiss"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Preis (EUR)</Label>
            <Input
              id="price"
              inputMode="decimal"
              value={priceStr}
              onChange={(e) => setPriceStr(e.target.value)}
              placeholder="7,50"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Kategorie</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="essen">Essen</SelectItem>
                <SelectItem value="wohnen">Wohnen</SelectItem>
                <SelectItem value="technik">Technik</SelectItem>
                <SelectItem value="freizeit">Freizeit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Abbrechen
            </Button>
            <Button type="submit">
              {item ? 'Speichern' : 'Hinzufügen'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
