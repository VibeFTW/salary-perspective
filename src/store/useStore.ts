import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Item, SalaryMode, Category } from '@/types'
import { defaultItems } from '@/data/defaultItems'

interface AppState {
  salary: number
  salaryMode: SalaryMode
  items: Item[]
  activeCategory: Category | 'alle'

  setSalary: (salary: number) => void
  setSalaryMode: (mode: SalaryMode) => void
  setActiveCategory: (category: Category | 'alle') => void
  addItem: (item: Omit<Item, 'id' | 'sortOrder'>) => void
  updateItem: (id: string, updates: Partial<Omit<Item, 'id'>>) => void
  deleteItem: (id: string) => void
  resetItems: () => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      salary: 2400,
      salaryMode: 'monthly',
      items: defaultItems,
      activeCategory: 'alle',

      setSalary: (salary) => set({ salary }),
      setSalaryMode: (salaryMode) => set({ salaryMode }),
      setActiveCategory: (activeCategory) => set({ activeCategory }),

      addItem: (item) =>
        set((state) => {
          const maxSort = Math.max(...state.items.map((i) => i.sortOrder), 0)
          const newItem: Item = {
            ...item,
            id: `custom-${Date.now()}`,
            sortOrder: maxSort + 1,
            isCustom: true,
          }
          return { items: [...state.items, newItem] }
        }),

      updateItem: (id, updates) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        })),

      deleteItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      resetItems: () => set({ items: defaultItems }),
    }),
    {
      name: 'salary-perspective-storage',
      // Version localStorage data for safe schema evolution (client-localstorage-schema)
      version: 1,
    }
  )
)

/** Normalise salary to a monthly value regardless of the input mode */
export function toMonthlySalary(salary: number, mode: SalaryMode): number {
  return mode === 'yearly' ? salary / 12 : salary
}

/** Calculate the percentage of *monthly* salary that an item price represents */
export function calcPercent(price: number, salary: number, mode: SalaryMode): number {
  const monthly = toMonthlySalary(salary, mode)
  if (monthly <= 0) return 0
  return (price / monthly) * 100
}
