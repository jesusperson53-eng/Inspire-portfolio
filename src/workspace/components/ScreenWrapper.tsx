import { ReactNode } from 'react';
import { cn } from '../lib/utils';

interface ScreenWrapperProps {
  children: ReactNode;
  className?: string;
}

export function ScreenWrapper({ children, className }: ScreenWrapperProps) {
  return (
    <div
      className={cn(
        'flex-1 min-h-0 w-full overflow-y-auto overflow-x-hidden flex flex-col pb-24 [&>*]:shrink-0',
        className
      )}
    >
      {children}
    </div>
  );
}
