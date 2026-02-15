import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from '@/pages/HomePage'
import { BottomNav } from '@/components/BottomNav'

// Lazy-load ManagePage — not needed on initial render (bundle-dynamic-imports)
const ManagePage = lazy(() =>
  import('@/pages/ManagePage').then((m) => ({ default: m.ManagePage }))
)

export default function App() {
  return (
    <BrowserRouter>
      <div className="relative flex min-h-[100dvh] flex-col bg-background">
        <Suspense fallback={<div className="flex-1" />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/verwalten" element={<ManagePage />} />
          </Routes>
        </Suspense>
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}
