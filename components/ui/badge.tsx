import * as React from 'react';
import { cn } from '@/lib/utils';

type Variant = 'info' | 'success' | 'warning' | 'danger' | 'neutral';
type Size = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  info: 'bg-blue-500/10 text-blue-400',
  success: 'bg-emerald-500/10 text-emerald-400',
  warning: 'bg-amber-500/10 text-amber-400',
  danger: 'bg-red-500/10 text-red-400',
  neutral: 'bg-zinc-700/40 text-zinc-300',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-2 py-0.5 text-[11px]',
  md: 'px-2.5 py-1 text-xs',
};

export function Badge({
  className,
  variant = 'neutral',
  size = 'md',
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full font-medium',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
}
