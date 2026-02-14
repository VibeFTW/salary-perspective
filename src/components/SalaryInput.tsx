import { useState, useEffect, useCallback } from 'react'
import { useStore } from '@/store/useStore'
import { SalaryModeToggle } from './SalaryModeToggle'
import { formatEUR, parseGermanNumber } from '@/lib/utils'

export function SalaryInput() {
  const salary = useStore((s) => s.salary)
  const setSalary = useStore((s) => s.setSalary)
  const salaryMode = useStore((s) => s.salaryMode)

  const [inputValue, setInputValue] = useState(formatEUR(salary))
  const [isFocused, setIsFocused] = useState(false)

  // Sync display when salary changes externally (e.g. from storage)
  useEffect(() => {
    if (!isFocused) {
      setInputValue(formatEUR(salary))
    }
  }, [salary, isFocused])

  const handleFocus = useCallback(() => {
    setIsFocused(true)
    // Show raw number for easier editing
    setInputValue(salary === 0 ? '' : salary.toString().replace('.', ','))
  }, [salary])

  const handleBlur = useCallback(() => {
    setIsFocused(false)
    const parsed = parseGermanNumber(inputValue)
    setSalary(parsed)
    setInputValue(formatEUR(parsed))
  }, [inputValue, setSalary])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value
      setInputValue(raw)

      // Live update: parse and set salary reactively
      const parsed = parseGermanNumber(raw)
      if (parsed >= 0) {
        setSalary(parsed)
      }
    },
    [setSalary]
  )

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-muted-foreground">
        Dein Netto-Gehalt
      </label>
      <div className="relative">
        <input
          type="text"
          inputMode="decimal"
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="2.400,00"
          className="flex h-14 w-full rounded-lg border border-input bg-background px-4 pr-14 text-2xl font-bold ring-offset-background placeholder:text-muted-foreground/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-muted-foreground">
          EUR
        </span>
      </div>
      <SalaryModeToggle />
      <p className="text-xs text-muted-foreground text-center">
        {salaryMode === 'monthly' ? 'Pro Monat (netto)' : 'Pro Jahr (netto)'}
      </p>
    </div>
  )
}
