import React, { useState, useEffect } from 'react';
import { Globe, ArrowRight, Loader2 } from 'lucide-react';

interface UrlFormProps {
  onSubmit: (url: string) => void;
  onValidationError?: (message: string) => void;
  isLoading: boolean;
  initialValue?: string;
}

export const UrlForm: React.FC<UrlFormProps> = ({
  onSubmit,
  onValidationError,
  isLoading,
  initialValue = '',
}) => {
  const [url, setUrl] = useState(initialValue);

  useEffect(() => {
    if (initialValue) {
      setUrl(initialValue);
    }
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) {
      if (onValidationError) {
        onValidationError('URL input is empty. Please specify a target URL.');
      }
      return;
    }
    onSubmit(trimmed);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/80 shadow-lg rounded-2xl p-5 md:p-6 transition-all duration-300">
        <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3.5">
          Auditor Engine
        </h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 dark:text-slate-500 pointer-events-none">
              <Globe className="h-5 w-5" />
            </div>
            
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter website URL (e.g., https://example.com)"
              disabled={isLoading}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/85 rounded-xl py-3.5 pl-12 pr-4 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 outline-none text-sm transition-all focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:ring-indigo-400/10 disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:active:bg-indigo-700 text-white font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-600/10 shrink-0"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Running Audit</span>
              </>
            ) : (
              <>
                <span>Analyze Page</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
export default UrlForm;
