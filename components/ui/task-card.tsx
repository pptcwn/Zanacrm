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
  urgent: 'bg-red-500/10 text-red-400',
  shipping: 'bg-blue-500/10 text-blue-400',
  refund: 'bg-amber-500/10 text-amber-400',
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
        'cursor-pointer rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-left transition-colors hover:border-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
        className,
      )}
    >
      {labels.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {labels.map((label) => (
            <span
              key={label}
              className={cn(
                'rounded-full px-2 py-0.5 text-[10px] font-medium capitalize',
                labelColors[label] ?? 'bg-zinc-700/40 text-zinc-300',
              )}
            >
              {label}
            </span>
          ))}
        </div>
      )}

      <p className="text-sm font-medium leading-snug text-zinc-100">{title}</p>

      {linkedOrder && (
        <p className="mt-2 font-mono text-xs text-blue-400">{linkedOrder}</p>
      )}

      <div className="mt-3 flex items-center justify-between text-xs text-zinc-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-700 text-[10px] font-medium text-zinc-200">
            {assignee.charAt(0)}
          </span>
          {assignee}
        </span>
        <span>{dueDate}</span>
      </div>
    </div>
  );
}
