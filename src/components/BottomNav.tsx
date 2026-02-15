import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { BarChart3, Settings } from 'lucide-react'

// Preload ManagePage chunk on hover/focus for perceived speed (bundle-preload)
const preloadManagePage = () => {
  void import('@/pages/ManagePage')
}

const navItems = [
  { to: '/', label: 'Startseite', icon: BarChart3, onPreload: undefined as (() => void) | undefined },
  { to: '/verwalten', label: 'Verwalten', icon: Settings, onPreload: preloadManagePage },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-lg">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onMouseEnter={item.onPreload}
            onFocus={item.onPreload}
            className={({ isActive }) =>
              cn(
                'flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
