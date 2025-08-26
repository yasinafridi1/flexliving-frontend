import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@maincomponents/components/ui/popover';
import { Button } from '@maincomponents/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@maincomponents/components/ui/command';
import { Label } from '@maincomponents/components/ui/label';
import { cn } from '@maincomponents/lib/utils';
import { Badge } from '@maincomponents/components/ui/badge';

function SelectWithSearchInput({ label, options = [], value, onChange, placeholder = 'Select...', id, error }) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const selectedOption = options.find(opt => opt.value === value);

  // Filter options by inputValue
  const filteredOptions = React.useMemo(() => {
    if (!inputValue) return options;
    return options.filter(opt => opt.label.toLowerCase().includes(inputValue.toLowerCase()));
  }, [inputValue, options]);

  return (
    <div className='flex flex-col gap-1 w-full'>
      {label && (
        <Label htmlFor={id} className='px-1'>
          {label}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant='outline'
            role='combobox'
            aria-expanded={open}
            aria-controls='select-options'
            className='w-full justify-between'
            type='button'
          >
            {selectedOption ? selectedOption.label : placeholder}
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent align='start'>
          <Command>
            <CommandInput
              autoFocus
              placeholder='Search...'
              value={inputValue}
              onValueChange={setInputValue}
              className='w-full max-w-[500px] min-w-[200px]'
            />
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup id='select-options'>
              {filteredOptions.map(option => (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    onChange(option.value);
                    setOpen(false);
                    setInputValue('');
                  }}
                  className={cn(
                    'cursor-pointer select-none rounded-sm px-2 py-1 flex justify-between',
                    option.value === value ? 'bg-primary text-primary-foreground' : ''
                  )}
                >
                  {option.label}
                  {option.value === value && <Check className='ml-auto h-4 w-4' />}
                  {option?.badge && (
                    <Badge variant='outline' className='rounded-full px-1 py-0 text-xs'>
                      {option?.badge || 0}
                    </Badge>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className='text-red-600 text-sm mt-1 px-1'>{error}</p>}
    </div>
  );
}

export default SelectWithSearchInput;
