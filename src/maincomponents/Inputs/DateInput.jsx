'use client';

import React from 'react';
import { CalendarIcon } from 'lucide-react';
import { Label } from '@maincomponents/components/ui/label';
import { Input } from '@maincomponents/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@maincomponents/components/ui/popover';
import { Button } from '@maincomponents/components/ui/button';
import { Calendar } from '@maincomponents/components/ui/calendar';

function isValidDate(date) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

// Helper: get only YYYY-MM-DD from Date
export const toISODateString = date => {
  if (!(date instanceof Date) || isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function DateInput({ label, placeholder, error, field }) {
  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = React.useState(
    field.value && isValidDate(new Date(field.value)) ? new Date(field.value) : undefined
  );

  const parsedDate = React.useMemo(() => {
    if (!field.value) return undefined;
    if (field.value instanceof Date) return field.value;

    const dateStr = field.value;
    const isoDateOnly = dateStr.split('T')[0]; // "2025-08-12"
    const [year, month, day] = isoDateOnly.split('-').map(Number);
    return new Date(year, month - 1, day); // local time
  }, [field.value]);

  const [inputValue, setInputValue] = React.useState(toISODateString(parsedDate));

  React.useEffect(() => {
    setInputValue(toISODateString(parsedDate));
    setMonth(parsedDate);
  }, [parsedDate]);

  const onSelectDate = date => {
    if (!date) return;
    setInputValue(toISODateString(date));
    setMonth(date);
    field.onChange(toISODateString(date));
    setOpen(false);
  };
  return (
    <div className='flex flex-col gap-1'>
      {label && (
        <Label htmlFor={field.name} className='px-1'>
          {label}
        </Label>
      )}

      <div className='relative flex gap-2'>
        <Input
          id={field.name}
          name={field.name}
          value={inputValue}
          placeholder={placeholder}
          className={`bg-background pr-10 ${error ? 'border-red-500' : ''}`}
          readOnly // prevent typing
          onClick={() => setOpen(true)} // open calendar on click
          onBlur={field.onBlur}
          onKeyDown={e => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setOpen(true);
            }
          }}
          autoComplete='off'
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id='date-picker'
              variant='ghost'
              className='absolute top-1/2 right-2 size-6 -translate-y-1/2'
              type='button'
              aria-label='Toggle date picker'
            >
              <CalendarIcon className='size-3.5' />
              <span className='sr-only'>Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto overflow-hidden p-0' align='end' alignOffset={-8} sideOffset={10}>
            <Calendar
              mode='single'
              selected={month}
              captionLayout='dropdown'
              month={month}
              onMonthChange={setMonth}
              onSelect={onSelectDate}
            />
          </PopoverContent>
        </Popover>
      </div>

      {error && typeof error === 'string' && (
        <p role='alert' className='text-red-600 text-sm mt-1 px-1'>
          {error}
        </p>
      )}
    </div>
  );
}

export default DateInput;
