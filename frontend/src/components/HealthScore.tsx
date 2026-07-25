import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

interface HealthScoreProps {
  score: number;
}

export const HealthScore: React.FC<HealthScoreProps> = ({ score }) => {
  const [displayScore, setDisplayScore] = useState(0);
  const scaledScore = score <= 10 ? score * 10 : score;

  useEffect(() => {
    let start = 0;
    const end = scaledScore;
    if (end === 0) {
      requestAnimationFrame(() => {
        setDisplayScore(0);
      });
      return;
    }
    const duration = 400; // in ms
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayScore(end);
        clearInterval(timer);
      } else {
        setDisplayScore(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [score, scaledScore]);

  // Score categories mapping based on 0-100 scale
  const getScoreDetails = (val: number) => {
    if (val >= 95) {
      return {
        label: 'Excellent',
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50',
        bar: 'bg-emerald-500',
      };
    } else if (val >= 80) {
      return {
        label: 'Good',
        badge: 'bg-blue-50 text-blue-705 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/50',
        bar: 'bg-blue-500',
      };
    } else if (val >= 60) {
      return {
        label: 'Needs Improvement',
        badge: 'bg-amber-50 text-amber-705 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50',
        bar: 'bg-amber-500',
      };
    } else {
      return {
        label: 'Poor',
        badge: 'bg-rose-50 text-rose-750 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/50',
        bar: 'bg-rose-500',
      };
    }
  };

  const details = getScoreDetails(scaledScore);
  const percentage = Math.max(0, Math.min(100, scaledScore));

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 shadow-md dark:shadow-slate-950/10 rounded-2xl p-5 flex flex-col justify-between h-full min-h-[140px] transition-all duration-300">
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
            Health Score
          </span>
          <div className="p-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/50 rounded-lg text-slate-500 dark:text-slate-400">
            <ShieldCheck className="h-4.5 w-4.5" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {displayScore.toFixed(0)}
          </span>
          <span className="text-slate-450 dark:text-slate-550 text-xs font-bold">/ 100</span>
          
          <span className={`ml-auto text-[9px] font-bold px-2.5 py-0.5 rounded-full border ${details.badge}`}>
            {details.label}
          </span>
        </div>
      </div>

      <div className="mt-4">
        {/* Horizontal Progress Bar */}
        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`h-full rounded-full ${details.bar}`}
          />
        </div>
        <div className="flex justify-between text-[9px] text-slate-450 dark:text-slate-550 font-bold">
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
      </div>
    </div>
  );
};
export default HealthScore;
