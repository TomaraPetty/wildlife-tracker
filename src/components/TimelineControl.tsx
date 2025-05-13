"use client"

import { Slider } from "@/components/ui/slider"

type TimelineControlProps = {
  value: number[]
  min: number
  max: number
  onChange: (value: number[]) => void
}

export default function TimelineControl({ value, min, max, onChange }: TimelineControlProps) {
  return (
    <div className="w-full">
      <Slider
        defaultValue={value}
        min={min}
        max={max}
        step={86400000} // One day in milliseconds
        onValueChange={onChange}
      />
    </div>
  )
}
