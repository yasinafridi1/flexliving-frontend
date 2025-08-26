import { useEffect } from 'react';
import { Check, Moon, Sun } from 'lucide-react';
import { useTheme } from '@hooks/themeProvider';
import { Button } from '@maincomponents/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@maincomponents/components/ui/dropdown-menu';
import { cn } from '@maincomponents/lib/utils';

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();

  /* Update theme-color meta tag
   * when theme is updated */
  useEffect(() => {
    const themeColor = theme === 'dark' ? '#020817' : '#fff';
    const metaThemeColor = document.querySelector("meta[name='theme-color']");
    if (metaThemeColor) metaThemeColor.setAttribute('content', themeColor);
  }, [theme]);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='bg-background scale-95 rounded-full'>
          <Sun className=' size-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90 ' />
          <Moon className='absolute size-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => setTheme('light')}>
          Light <Check size={14} className={cn('ml-auto', theme !== 'light' && 'hidden')} />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          Dark
          <Check size={14} className={cn('ml-auto', theme !== 'dark' && 'hidden')} />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          System
          <Check size={14} className={cn('ml-auto', theme !== 'system' && 'hidden')} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
