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

/**
 * Format a number of working hours into a human-friendly German string.
 * Uses 8-hour work days for readability.
 *
 * Examples:
 *   0.001 -> "4 Sek"
 *   0.012 -> "43 Sek"
 *   0.1   -> "6 Min"
 *   0.5   -> "30 Min"
 *   2.75  -> "2 Std 45 Min"
 *   12    -> "1 Tag 4 Std"
 *   96    -> "12 Tage"
 */
export function formatWorkTime(totalHours: number): string {
  if (totalHours <= 0) return '–'

  const HOURS_PER_DAY = 8
  const totalSeconds = Math.round(totalHours * 3600)

  if (totalSeconds < 60) {
    return `${totalSeconds} Sek`
  }

  const totalMinutes = Math.floor(totalSeconds / 60)
  const remainingSeconds = totalSeconds % 60

  if (totalMinutes < 60) {
    if (remainingSeconds === 0) return `${totalMinutes} Min`
    return `${totalMinutes} Min ${remainingSeconds} Sek`
  }

  const days = Math.floor(totalHours / HOURS_PER_DAY)
  const remainingHours = Math.floor(totalHours % HOURS_PER_DAY)
  const remainingMinutes = totalMinutes % 60

  if (days === 0) {
    // Less than one work day: show hours + minutes
    if (remainingMinutes === 0) return `${remainingHours} Std`
    return `${remainingHours} Std ${remainingMinutes} Min`
  }

  // One or more work days
  const dayLabel = days === 1 ? 'Tag' : 'Tage'
  if (remainingHours === 0 && remainingMinutes === 0) {
    return `${days} ${dayLabel}`
  }
  if (remainingHours === 0) {
    return `${days} ${dayLabel} ${remainingMinutes} Min`
  }
  return `${days} ${dayLabel} ${remainingHours} Std`
}
