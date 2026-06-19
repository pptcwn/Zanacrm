'use client';

import { cn } from '@/lib/utils';

export interface TaskCardProps {
  title: string;
  assignee: string;
  dueDate: string;
  labels?: string[];
  linkedOrder?: string;
  onClick?: () => void;
  className?: string;
}

const labelColors: Record<string, string> = {
  urgent: 'bg-destructive/10 text-destructive ring-1 ring-inset ring-destructive/20',
  shipping: 'bg-primary/10 text-primary ring-1 ring-inset ring-primary/20',
  refund: 'bg-warning/10 text-warning ring-1 ring-inset ring-warning/25',
};

export function TaskCard({
  title,
  assignee,
  dueDate,
  labels = [],
  linkedOrder,
  onClick,
  className,
}: TaskCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={cn(
        'group cursor-pointer rounded-xl border border-border bg-card p-3.5 text-left shadow-sm transition-all hover:border-border-strong hover:bg-elevated focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
    >
      {labels.length > 0 && (
        <div className="mb-2.5 flex flex-wrap gap-1.5">
          {labels.map((label) => (
            <span
              key={label}
              className={cn(
                'rounded-full px-2 py-0.5 text-[10px] font-medium capitalize',
                labelColors[label] ?? 'bg-muted text-muted-foreground ring-1 ring-inset ring-border',
              )}
            >
              {label}
            </span>
          ))}
        </div>
      )}

      <p className="text-sm font-medium leading-snug text-foreground">{title}</p>

      {linkedOrder && (
        <p className="mt-2 font-mono text-xs text-primary">{linkedOrder}</p>
      )}

      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-[10px] font-semibold text-primary">
            {assignee.charAt(0)}
          </span>
          {assignee}
        </span>
        <span>{dueDate}</span>
      </div>
    </div>
  );
}
