export type Category = 'essen' | 'wohnen' | 'technik' | 'freizeit'

export const CATEGORIES: { id: Category | 'alle'; label: string }[] = [
  { id: 'alle', label: 'Alle' },
  { id: 'essen', label: 'Essen' },
  { id: 'wohnen', label: 'Wohnen' },
  { id: 'technik', label: 'Technik' },
  { id: 'freizeit', label: 'Freizeit' },
]

export type SalaryMode = 'monthly' | 'yearly'

export type SortMode = 'default' | 'asc' | 'desc'

export interface Item {
  id: string
  name: string
  description: string
  price: number
  category: Category
  sortOrder: number
  isCustom?: boolean
}
