import React from 'react';
import { Info, HelpCircle } from 'lucide-react';

interface NotesCardProps {
  notes: string[];
}

export const NotesCard: React.FC<NotesCardProps> = ({ notes }) => {
  const hasNotes = notes.length > 0;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 shadow-md dark:shadow-slate-950/10 rounded-2xl p-5 h-full flex flex-col justify-start min-h-[250px]">
      <div className="flex items-center gap-2.5 mb-5 border-b border-slate-100 dark:border-slate-850 pb-4">
        <div
          className={`p-2 rounded-xl shrink-0 ${
            hasNotes
              ? 'bg-blue-100/70 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
              : 'bg-slate-100 text-slate-500 dark:bg-slate-950 dark:text-slate-400'
          }`}
        >
          {hasNotes ? (
            <Info className="h-4.5 w-4.5" />
          ) : (
            <HelpCircle className="h-4.5 w-4.5" />
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
            Diagnostics
          </span>
          <h3 className="text-sm font-bold text-slate-850 dark:text-white tracking-tight mt-0.5">
            Engineering Notes
          </h3>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-start">
        {!hasNotes ? (
          <div className="flex items-center gap-3 bg-slate-50/30 dark:bg-slate-950/10 rounded-xl p-4 border border-slate-100/50 dark:border-slate-800/40 h-full min-h-[100px]">
            <p className="text-xs font-semibold text-slate-550 dark:text-slate-400 leading-relaxed">
              No additional engineering observations.
            </p>
          </div>
        ) : (
          <div className="space-y-3 w-full">
            {notes.map((note, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 bg-blue-50/20 dark:bg-blue-950/10 p-3.5 rounded-xl border border-blue-100/30 dark:border-blue-900/25 shadow-sm transition-all hover:border-blue-300 dark:hover:border-blue-800/80 w-full"
              >
                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <span className="text-xs font-semibold text-blue-900 dark:text-blue-300 leading-normal">
                  {note}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default NotesCard;
