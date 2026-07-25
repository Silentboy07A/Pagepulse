import React from 'react';
import { AlertCircle, WifiOff, XOctagon, Clock, RotateCcw, ArrowLeft } from 'lucide-react';
import { AnalysisError } from '../services/api';

interface ErrorCardProps {
  error: AnalysisError;
  onRetry: () => void;
  onReturn: () => void;
}

export const ErrorCard: React.FC<ErrorCardProps> = ({ error, onRetry, onReturn }) => {
  const getIcon = () => {
    switch (error.type) {
      case 'client':
        return <AlertCircle className="h-7 w-7 text-amber-500 animate-pulse" />;
      case 'network':
        return <WifiOff className="h-7 w-7 text-rose-500 animate-pulse" />;
      case 'timeout':
        return <Clock className="h-7 w-7 text-orange-500 animate-pulse" />;
      default:
        return <XOctagon className="h-7 w-7 text-rose-500 animate-pulse" />;
    }
  };

  const getTitle = () => {
    switch (error.type) {
      case 'client':
        return 'Invalid URL requested';
      case 'network':
        return 'Connection failed';
      case 'timeout':
        return 'Timeout occurred';
      default:
        return 'Unexpected error';
    }
  };

  const getSubtext = () => {
    if (error.message) {
      return error.message;
    }
    switch (error.type) {
      case 'client':
        return 'Please enter a valid URL starting with http:// or https://';
      case 'network':
        return 'Network connection lost or backend is unreachable.';
      case 'timeout':
        return 'Request timed out.';
      default:
        return 'An unexpected error occurred.';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-8">
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800 shadow-xl rounded-2xl p-6 md:p-8 text-center flex flex-col items-center">
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 mb-5">
          {getIcon()}
        </div>
        
        <h3 className="font-display text-base font-bold text-slate-800 dark:text-white mb-2">
          {getTitle()}
        </h3>
        
        <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed mb-6 max-w-[280px]">
          {getSubtext()}
        </p>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onRetry}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-md shadow-blue-500/10 shrink-0"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Retry
          </button>
          
          <button
            onClick={onReturn}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 font-semibold text-xs transition-all shadow-sm"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Return
          </button>
        </div>
      </div>
    </div>
  );
};
export default ErrorCard;
