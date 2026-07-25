import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface FixesCardProps {
  fixes: string[];
}

interface ParsedFix {
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
}

export const FixesCard: React.FC<FixesCardProps> = ({ fixes }) => {
  const hasIssues = fixes.length > 0;

  const parseRecommendation = (fix: string): ParsedFix => {
    const text = fix.toLowerCase();
    
    if (text.includes('meta description')) {
      return {
        title: 'Add a Meta Description',
        description: 'Provide a meta description in your HTML head to supply search engine crawlers with an indexed summary of your webpage content.',
        priority: 'High',
      };
    }
    
    if (text.includes('h1') || text.includes('heading')) {
      return {
        title: 'Consolidate H1 Heading Tags',
        description: 'Ensure only a single H1 header tag exists on the page to preserve proper hierarchy indexing for DOM screen readers.',
        priority: 'Medium',
      };
    }
    
    if (text.includes('alt') || text.includes('image')) {
      return {
        title: 'Specify Image Alt Attributes',
        description: 'Several image assets are missing standard alt attributes. Add descriptive alt strings to support image SEO and accessibility checks.',
        priority: 'Medium',
      };
    }
    
    if (text.includes('word') || text.includes('content') || text.includes('volume')) {
      return {
        title: 'Expand Text Content Volume',
        description: 'The content length is thin. Add more relevant paragraphs to support keyword indexing and domain authority scores.',
        priority: 'Low',
      };
    }

    return {
      title: fix,
      description: 'Audit and optimize this page element in your DOM structure to resolve the crawlers recommendation checklist.',
      priority: 'Medium',
    };
  };

  const getPriorityBadgeClass = (priority: 'High' | 'Medium' | 'Low') => {
    switch (priority) {
      case 'High':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/50';
      case 'Low':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/50';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 shadow-md dark:shadow-slate-950/10 rounded-2xl p-5 h-full flex flex-col justify-start min-h-[250px]">
      <div className="flex items-center gap-2.5 mb-5 border-b border-slate-100 dark:border-slate-850 pb-4">
        <div
          className={`p-2 rounded-xl shrink-0 ${
            hasIssues
              ? 'bg-amber-100/70 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
              : 'bg-emerald-100/70 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
          }`}
        >
          {hasIssues ? (
            <AlertTriangle className="h-4.5 w-4.5" />
          ) : (
            <CheckCircle2 className="h-4.5 w-4.5" />
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
            Audit Checklist
          </span>
          <h3 className="text-sm font-bold text-slate-850 dark:text-white tracking-tight mt-0.5">
            Priority Fixes
          </h3>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-start">
        {!hasIssues ? (
          <div className="flex items-center gap-3 bg-emerald-50/20 dark:bg-emerald-950/10 rounded-xl p-4 border border-emerald-100/30 dark:border-emerald-900/25 h-full min-h-[100px]">
            <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 leading-relaxed">
              No critical issues detected. Your page looks healthy.
            </p>
          </div>
        ) : (
          <div className="space-y-4 w-full">
            {fixes.map((fix, idx) => {
              const parsed = parseRecommendation(fix);
              return (
                <div
                  key={idx}
                  className="flex items-start gap-3.5 bg-amber-50/10 dark:bg-amber-950/5 p-4 rounded-xl border border-amber-100/30 dark:border-amber-900/25 shadow-sm hover:border-amber-300 dark:hover:border-amber-800/80 transition-all duration-200 w-full"
                >
                  <AlertTriangle className="h-4.5 w-4.5 text-amber-650 dark:text-amber-500 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                        {parsed.title}
                      </h4>
                      <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold tracking-wide shrink-0 ${getPriorityBadgeClass(parsed.priority)}`}>
                        {parsed.priority} Priority
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed font-semibold">
                      {parsed.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
export default FixesCard;
