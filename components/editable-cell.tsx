"use client"

import { useState, useEffect, useRef } from "react"

interface EditableCellProps {
  value: number
  onChange: (value: number) => void
  format: 'number' | 'currency' | 'percentage'
  min?: number
  max?: number
  className?: string
  suffix?: string
}

export function EditableCell({ 
  value, 
  onChange, 
  format, 
  min = 0,
  max = Infinity,
  className = "",
  suffix = ""
}: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [tempValue, setTempValue] = useState(value.toString())
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  useEffect(() => {
    if (!isEditing) {
      setTempValue(value.toString())
    }
  }, [value, isEditing])

  const handleBlur = () => {
    const num = parseFloat(tempValue.replace(/,/g, ''))
    if (!isNaN(num) && num >= min && num <= max) {
      onChange(num)
    } else {
      setTempValue(value.toString())
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur()
    } else if (e.key === 'Escape') {
      setTempValue(value.toString())
      setIsEditing(false)
    }
  }

  const formatDisplay = (val: number): string => {
    switch(format) {
      case 'currency': 
        return `$${(val / 1000000).toFixed(2)}M`
      case 'percentage': 
        return `${val.toFixed(1)}%`
      default: 
        return val.toLocaleString()
    }
  }

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="number"
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`w-full bg-zinc-800 border-2 border-blue-500 rounded px-2 py-1 text-blue-400 font-bold tabular-nums outline-none ${className}`}
        min={min}
        max={max}
        step={format === 'currency' ? 100000 : 1}
      />
    )
  }

  return (
    <div 
      onClick={() => setIsEditing(true)}
      className={`cursor-pointer hover:bg-zinc-800/70 px-2 py-1 rounded transition-all group relative ${className}`}
      title="Click para editar"
    >
      <span className="font-bold tabular-nums">{formatDisplay(value)}</span>
      {suffix && <span className="text-xs ml-1">{suffix}</span>}
      <span className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      </span>
    </div>
  )
}

interface ReadOnlyCellProps {
  value: number | string
  format?: 'number' | 'currency' | 'percentage' | 'text'
  className?: string
  color?: string
}

export function ReadOnlyCell({ 
  value, 
  format = 'number',
  className = "",
  color = "text-zinc-300"
}: ReadOnlyCellProps) {
  const formatDisplay = (val: number | string): string => {
    if (typeof val === 'string') return val
    
    switch(format) {
      case 'currency': 
        return `$${(val / 1000).toFixed(0)}K`
      case 'percentage': 
        return `${val.toFixed(1)}%`
      default: 
        return val.toLocaleString()
    }
  }

  return (
    <div className={`px-2 py-1 ${className}`}>
      <span className={`font-semibold tabular-nums ${color} flex items-center gap-1`}>
        {formatDisplay(value)}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-30">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      </span>
    </div>
  )
}
