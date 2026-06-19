import * as React from 'react';
import { cn } from '@/lib/utils';

type Variant = 'info' | 'success' | 'warning' | 'danger' | 'neutral' | 'primary';
type Size = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  info: 'bg-primary/10 text-primary ring-1 ring-inset ring-primary/20',
  primary: 'bg-primary/10 text-primary ring-1 ring-inset ring-primary/20',
  success: 'bg-success/10 text-success ring-1 ring-inset ring-success/20',
  warning: 'bg-warning/10 text-warning ring-1 ring-inset ring-warning/25',
  danger: 'bg-destructive/10 text-destructive ring-1 ring-inset ring-destructive/20',
  neutral: 'bg-muted text-muted-foreground ring-1 ring-inset ring-border',
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
        'inline-flex items-center justify-center gap-1 rounded-full font-medium',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
}
