import { SalaryInput } from '@/components/SalaryInput'
import { CategoryFilter } from '@/components/CategoryFilter'
import { SortToggle } from '@/components/SortToggle'
import { ItemList } from '@/components/ItemList'
import { Coins } from 'lucide-react'

export function HomePage() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="mx-auto max-w-lg px-4 py-3">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600">
              <Coins className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-lg font-bold">Gehaltsperspektive</h1>
          </div>
          <SalaryInput />
        </div>
      </header>

      {/* Category filter + sort */}
      <div className="border-b bg-background">
        <div className="mx-auto max-w-lg px-4 py-3 space-y-2">
          <CategoryFilter />
          <SortToggle />
        </div>
      </div>

      {/* Item list */}
      <main className="flex-1 mx-auto w-full max-w-lg px-4 py-4 pb-20">
        <ItemList />
      </main>
    </div>
  )
}
