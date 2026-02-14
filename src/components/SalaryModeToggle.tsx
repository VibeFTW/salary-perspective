import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useStore } from '@/store/useStore'
import { SalaryMode } from '@/types'

export function SalaryModeToggle() {
  const salaryMode = useStore((s) => s.salaryMode)
  const setSalaryMode = useStore((s) => s.setSalaryMode)

  return (
    <ToggleGroup
      type="single"
      value={salaryMode}
      onValueChange={(value) => {
        if (value) setSalaryMode(value as SalaryMode)
      }}
      className="w-full"
    >
      <ToggleGroupItem value="monthly" className="flex-1">
        Monat
      </ToggleGroupItem>
      <ToggleGroupItem value="yearly" className="flex-1">
        Jahr
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
