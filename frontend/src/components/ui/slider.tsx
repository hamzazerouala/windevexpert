import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: number[]
  onValueChange?: (value: number[]) => void
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(({ className, value, onValueChange, max = 100, step = 1, ...props }, ref) => {
  const current = Array.isArray(value) ? value[0] ?? 0 : 0
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value)
    onValueChange?.([v])
  }
  return (
    <input
      ref={ref}
      type="range"
      className={cn("w-full h-2 rounded-lg appearance-none bg-secondary", className)}
      value={current}
      onChange={handleChange}
      max={max as number}
      step={step as number}
      {...props}
    />
  )
})
Slider.displayName = "Slider"

export { Slider }
