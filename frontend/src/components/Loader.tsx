import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, CircleDot } from 'lucide-react';

const STEPS = [
  'Connecting to website',
  'Downloading HTML',
  'Parsing DOM',
  'Extracting metadata',
  'Analyzing headings',
  'Checking accessibility',
  'Calculating health score',
  'Preparing report',
];

export const Loader: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [showWakingUpMessage, setShowWakingUpMessage] = useState(false);

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 300); // 300ms transition time per diagnostic step

    const wakeupTimer = setTimeout(() => {
      setShowWakingUpMessage(true);
    }, 5000);

    return () => {
      clearInterval(stepTimer);
      clearTimeout(wakeupTimer);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut' as const,
      },
    },
  } as const;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0 }}
      className="w-full max-w-md mx-auto px-4 py-8"
    >
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/80 shadow-xl rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <Loader2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400 animate-spin" />
          <h3 className="font-display text-base font-bold text-slate-800 dark:text-white">
            Website Analysis
          </h3>
        </div>

        <div className="space-y-4">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < activeStep;
            const isLoading = idx === activeStep;
            const isPending = idx > activeStep;

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 transition-opacity duration-200 ${
                  isPending ? 'opacity-30' : 'opacity-100'
                }`}
              >
                <div className="shrink-0">
                  {isCompleted && (
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" />
                  )}
                  {isLoading && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                      className="flex h-4.5 w-4.5 items-center justify-center text-indigo-500 dark:text-indigo-400"
                    >
                      <CircleDot className="h-4.5 w-4.5" />
                    </motion.div>
                  )}
                  {isPending && (
                    <div className="h-4.5 w-4.5 rounded-full border border-slate-200 dark:border-slate-800" />
                  )}
                </div>
                
                <span
                  className={`text-xs font-semibold tracking-wide ${
                    isLoading
                      ? 'text-slate-900 dark:text-white font-bold'
                      : isCompleted
                      ? 'text-slate-500 dark:text-slate-400 font-medium'
                      : 'text-slate-400 dark:text-slate-600 font-medium'
                  }`}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>

        {showWakingUpMessage && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-3 bg-amber-50/50 dark:bg-amber-950/10 border border-amber-200/30 dark:border-amber-900/30 rounded-xl text-center"
          >
            <p className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold leading-normal">
              The server is starting. This may take a few seconds.
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
export default Loader;
