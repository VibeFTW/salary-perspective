import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as German EUR currency string.
 * E.g. 1200 -> "1.200,00", 7.5 -> "7,50"
 */
export function formatEUR(value: number): string {
  return value.toLocaleString('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/**
 * Format percentage for display in German locale.
 * E.g. 0.05 -> "0,05%", 50 -> "50,00%"
 */
export function formatPercent(value: number): string {
  if (value < 0.01 && value > 0) {
    return '< 0,01%'
  }
  return value.toLocaleString('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + '%'
}

/**
 * Parse a German-formatted number string to a number.
 * "2.400,50" -> 2400.50
 */
export function parseGermanNumber(value: string): number {
  const cleaned = value.replace(/\./g, '').replace(',', '.')
  const num = parseFloat(cleaned)
  return isNaN(num) ? 0 : num
}
