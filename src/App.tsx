import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from '@/pages/HomePage'
import { ManagePage } from '@/pages/ManagePage'
import { BottomNav } from '@/components/BottomNav'

export default function App() {
  return (
    <BrowserRouter>
      <div className="relative flex min-h-[100dvh] flex-col bg-background">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/verwalten" element={<ManagePage />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}
