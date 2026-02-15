import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Item, SalaryMode, SortMode, Category } from '@/types'
import { defaultItems } from '@/data/defaultItems'

interface AppState {
  salary: number
  salaryMode: SalaryMode
  hoursPerWeek: number
  items: Item[]
  activeCategory: Category | 'alle'
  sortMode: SortMode

  setSalary: (salary: number) => void
  setSalaryMode: (mode: SalaryMode) => void
  setHoursPerWeek: (hours: number) => void
  setActiveCategory: (category: Category | 'alle') => void
  setSortMode: (sortMode: SortMode) => void
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
      hoursPerWeek: 40,
      items: defaultItems,
      activeCategory: 'alle',
      sortMode: 'default',

      setSalary: (salary) => set({ salary }),
      setSalaryMode: (salaryMode) => set({ salaryMode }),
      setHoursPerWeek: (hoursPerWeek) => set({ hoursPerWeek }),
      setActiveCategory: (activeCategory) => set({ activeCategory }),
      setSortMode: (sortMode) => set({ sortMode }),

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
      version: 4,
      migrate: (persisted, version) => {
        const state = persisted as Record<string, unknown>
        if (version < 2) {
          state.hoursPerWeek = 40
        }
        if (version < 3) {
          state.sortMode = 'default'
        }
        if (version < 4) {
          // Re-apply default items with new featured sort order
          state.items = defaultItems
        }
        return state as AppState
      },
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

const WEEKS_PER_YEAR = 52

/**
 * Calculate how many working hours it takes to earn the price of an item.
 * Formula: hoursPerYear = hoursPerWeek × 52, hourlyRate = yearlySalary / hoursPerYear
 * Returns the number of hours, or 0 if inputs are invalid.
 */
export function calcWorkHours(
  price: number,
  salary: number,
  mode: SalaryMode,
  hoursPerWeek: number,
): number {
  const yearlySalary = mode === 'yearly' ? salary : salary * 12
  const hoursPerYear = hoursPerWeek * WEEKS_PER_YEAR
  if (yearlySalary <= 0 || hoursPerYear <= 0) return 0
  const hourlyRate = yearlySalary / hoursPerYear
  return price / hourlyRate
}
