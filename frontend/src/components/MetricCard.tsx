import React from 'react';
import { AnimatedNumber } from './AnimatedNumber';

export interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  badge?: string;
  sublabel?: string;
  statusColor?: 'green' | 'yellow' | 'red' | 'neutral' | 'blue';
  numericValue?: number;
  valueSuffix?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  label,
  value,
  badge,
  sublabel,
  statusColor = 'neutral',
  numericValue,
  valueSuffix = '',
}) => {
  const containerClasses = {
    green: 'bg-emerald-50/10 border-emerald-200/50 hover:bg-emerald-50/20 dark:bg-emerald-950/10 dark:border-emerald-900/30 dark:hover:bg-emerald-950/20',
    yellow: 'bg-amber-50/10 border-amber-200/50 hover:bg-amber-50/20 dark:bg-amber-950/10 dark:border-amber-800/30 dark:hover:bg-amber-950/20',
    red: 'bg-rose-50/10 border-rose-200/50 hover:bg-rose-50/20 dark:bg-rose-950/10 dark:border-rose-800/30 dark:hover:bg-rose-950/20',
    blue: 'bg-blue-50/10 border-blue-200/50 hover:bg-blue-50/20 dark:bg-blue-950/10 dark:border-blue-800/30 dark:hover:bg-blue-950/20',
    neutral: 'bg-white border-slate-200/50 hover:bg-slate-50/40 dark:bg-slate-900 dark:border-slate-800/80 dark:hover:bg-slate-900/60',
  };

  const iconClasses = {
    green: 'bg-emerald-100/70 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    yellow: 'bg-amber-100/70 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    red: 'bg-rose-100/70 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
    blue: 'bg-blue-100/70 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    neutral: 'bg-slate-100 text-slate-550 dark:bg-slate-950 dark:text-slate-400',
  };

  const valueClasses = {
    green: 'text-emerald-800 dark:text-emerald-400',
    yellow: 'text-amber-800 dark:text-amber-400',
    red: 'text-rose-850 dark:text-rose-455',
    blue: 'text-blue-800 dark:text-blue-400',
    neutral: 'text-slate-900 dark:text-white',
  };

  const badgeClasses = {
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50',
    yellow: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50',
    red: 'bg-rose-50 text-rose-750 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50',
    blue: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50',
    neutral: 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-950 dark:text-slate-400 dark:border-slate-800',
  };

  const isPlaceholder = typeof value === 'string' && (
    value.toLowerCase().includes('no title') ||
    value.toLowerCase().includes('missing') ||
    value.toLowerCase().includes('no description') ||
    value.toLowerCase().includes('no meta description')
  );

  return (
    <div
      className={`p-5 rounded-2xl border ${containerClasses[statusColor]} shadow-md dark:shadow-slate-950/10 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between min-h-[150px]`}
    >
      <div>
        <div className="flex items-center justify-between gap-2.5 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className={`p-1.5 rounded-lg shrink-0 ${iconClasses[statusColor]}`}>
              {icon}
            </div>
            <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest block truncate">
              {label}
            </span>
          </div>
          {badge && (
            <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold shrink-0 ${badgeClasses[statusColor]}`}>
              {badge}
            </span>
          )}
        </div>

        <div className="mt-2.5">
          <span
            className={`text-xl font-extrabold tracking-tight line-clamp-2 leading-snug ${
              isPlaceholder
                ? 'italic font-medium text-slate-400 dark:text-slate-500'
                : valueClasses[statusColor]
            }`}
            title={String(value)}
          >
            {numericValue !== undefined && !isPlaceholder ? (
              <>
                <AnimatedNumber value={numericValue} />
                {valueSuffix}
              </>
            ) : (
              value
            )}
          </span>
        </div>
      </div>

      {sublabel && (
        <span
          className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-4 pt-2.5 border-t border-slate-100 dark:border-slate-850 block truncate"
          title={sublabel}
        >
          {sublabel}
        </span>
      )}
    </div>
  );
};
export default MetricCard;
