import {
  UtensilsCrossed,
  Home,
  Smartphone,
  PartyPopper,
  LayoutGrid,
} from 'lucide-react'

/**
 * Shared category icon mappings used across CategoryFilter, ItemCard, and ManagePage.
 * Consolidated to a single module to avoid duplicated imports and definitions.
 */

/** Small icons for filters and compact lists (h-3.5 w-3.5) */
export const categoryIconsSmall: Record<string, React.ReactNode> = {
  alle: <LayoutGrid className="h-3.5 w-3.5" />,
  essen: <UtensilsCrossed className="h-3.5 w-3.5" />,
  wohnen: <Home className="h-3.5 w-3.5" />,
  technik: <Smartphone className="h-3.5 w-3.5" />,
  freizeit: <PartyPopper className="h-3.5 w-3.5" />,
}

/** Medium icons for item cards (h-5 w-5 with category colors) */
export const categoryIconsMedium: Record<string, React.ReactNode> = {
  essen: <UtensilsCrossed className="h-5 w-5 text-orange-500" />,
  wohnen: <Home className="h-5 w-5 text-blue-500" />,
  technik: <Smartphone className="h-5 w-5 text-purple-500" />,
  freizeit: <PartyPopper className="h-5 w-5 text-emerald-500" />,
}

/** Small colored icons for manage page list (h-4 w-4 with category colors) */
export const categoryIconsManage: Record<string, React.ReactNode> = {
  essen: <UtensilsCrossed className="h-4 w-4 text-orange-500" />,
  wohnen: <Home className="h-4 w-4 text-blue-500" />,
  technik: <Smartphone className="h-4 w-4 text-purple-500" />,
  freizeit: <PartyPopper className="h-4 w-4 text-emerald-500" />,
}
