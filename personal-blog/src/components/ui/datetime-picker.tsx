import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { ChevronDownIcon } from 'lucide-react'
import React from 'react'

interface DateTimePickerProps {
  id?: string
  label?: string
  value: string // ISO 格式的日期时间字符串
  onChange: (value: string) => void
  disabled?: boolean
  minDate?: string // ISO 格式的最小日期
  className?: string
}

export function DateTimePicker({
  id,
  label,
  value,
  onChange,
  disabled = false,
  minDate,
  className,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false)

  // 从 ISO 字符串解析出日期和时间
  const parseDateTime = (isoString: string) => {
    if (!isoString) return { date: undefined, time: '' }
    const date = new Date(isoString)
    if (isNaN(date.getTime())) return { date: undefined, time: '' }

    // 格式化时间为 HH:mm 格式
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const time = `${hours}:${minutes}`

    return { date, time }
  }

  const { date: selectedDate, time: selectedTime } = parseDateTime(value)

  // 设置最小可选日期
  const minDateObj = minDate ? new Date(minDate) : new Date()
  // 将最小日期设置为今天 00:00:00
  minDateObj.setHours(0, 0, 0, 0)

  // 处理日期变化
  const handleDateChange = (newDate: Date | undefined) => {
    if (!newDate) {
      onChange('')
      return
    }

    // 保留之前的时间，如果没有则使用当前时间
    let hours = new Date().getHours()
    let minutes = new Date().getMinutes()

    if (selectedTime) {
      const [h, m] = selectedTime.split(':').map(Number)
      hours = h
      minutes = m
    }

    // 创建新的日期对象
    const result = new Date(newDate)
    result.setHours(hours, minutes, 0, 0)

    onChange(result.toISOString())
  }

  // 处理时间变化
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeValue = e.target.value
    if (!timeValue) {
      // 如果时间被清空，只保留日期部分
      if (selectedDate) {
        const result = new Date(selectedDate)
        result.setHours(0, 0, 0, 0)
        onChange(result.toISOString())
      }
      return
    }

    const [hours, minutes] = timeValue.split(':').map(Number)
    const baseDate = selectedDate || new Date()
    const result = new Date(baseDate)
    result.setHours(hours, minutes, 0, 0)

    onChange(result.toISOString())
  }

  // 格式化日期显示为 yyyy-mm-dd
  const formatDisplayDate = (date: Date | undefined) => {
    if (!date) return '选择日期'
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && (
        <Label htmlFor={id} className="px-1">
          {label}
        </Label>
      )}
      <div className="flex gap-2">
        {/* 日期选择 - 使用 Calendar 组件 */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id={id}
              disabled={disabled}
              className="flex-1 justify-between font-normal"
            >
              {formatDisplayDate(selectedDate)}
              <ChevronDownIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              captionLayout="dropdown"
              onSelect={handleDateChange}
              disabled={disabled ? true : { before: minDateObj }}
            />
          </PopoverContent>
        </Popover>

        {/* 时间选择 - 使用 Popover + 轮盘选择器 */}
        <TimePickerPopover value={selectedTime} onChange={handleTimeChange} disabled={disabled} />
      </div>
    </div>
  )
}

// 时间选择器组件
interface TimePickerPopoverProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled: boolean
}

function TimePickerPopover({ value, onChange, disabled }: TimePickerPopoverProps) {
  const [open, setOpen] = React.useState(false)

  // 解析时间
  const parseTime = (timeStr: string) => {
    if (!timeStr) return { hours: 12, minutes: 0 }
    const [h, m] = timeStr.split(':').map(Number)
    return { hours: h || 0, minutes: m || 0 }
  }

  const { hours, minutes } = parseTime(value)

  // 处理小时变化
  const handleHoursChange = (newHours: number) => {
    const timeStr = `${newHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
    onChange({ target: { value: timeStr } } as React.ChangeEvent<HTMLInputElement>)
  }

  // 处理分钟变化
  const handleMinutesChange = (newMinutes: number) => {
    const timeStr = `${hours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`
    onChange({ target: { value: timeStr } } as React.ChangeEvent<HTMLInputElement>)
  }

  // 格式化显示时间
  const formatDisplayTime = () => {
    if (!value) return '选择时间'
    return value
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" disabled={disabled} className="w-32 justify-between font-normal">
          {formatDisplayTime()}
          <ChevronDownIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="end">
        <div className="flex gap-4">
          {/* 小时选择 */}
          <div className="flex flex-col items-center gap-2">
            <Label className="text-xs text-muted-foreground">时</Label>
            <div className="flex flex-col items-center gap-1 max-h-40 overflow-y-auto">
              {Array.from({ length: 24 }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    handleHoursChange(i)
                    if (value) setOpen(false)
                  }}
                  className={cn(
                    'w-12 py-1 text-sm rounded hover:bg-accent hover:text-accent-foreground',
                    hours === i &&
                      'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground'
                  )}
                >
                  {i.toString().padStart(2, '0')}
                </button>
              ))}
            </div>
          </div>

          {/* 分钟选择 */}
          <div className="flex flex-col items-center gap-2">
            <Label className="text-xs text-muted-foreground">分</Label>
            <div className="flex flex-col items-center gap-1 max-h-40 overflow-y-auto">
              {Array.from({ length: 60 }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    handleMinutesChange(i)
                    if (value) setOpen(false)
                  }}
                  className={cn(
                    'w-12 py-1 text-sm rounded hover:bg-accent hover:text-accent-foreground',
                    minutes === i &&
                      'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground'
                  )}
                >
                  {i.toString().padStart(2, '0')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
