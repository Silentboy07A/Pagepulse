import { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Server,
  Clock,
  Type,
  AlignLeft,
  Heading1,
  ImageOff,
  FileDigit,
  Sparkles,
} from 'lucide-react';

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { UrlForm } from './components/UrlForm';
import { Loader } from './components/Loader';
import { ErrorCard } from './components/ErrorCard';
import { MetricCard } from './components/MetricCard';
import { HealthScore } from './components/HealthScore';
import { Footer } from './components/Footer';

import { analyzeUrl, AnalysisError } from './services/api';
import type { AnalysisResult } from './types/AnalysisResult';

// Lazy load heavier components to optimize initial load bundle performance
const FeatureCards = lazy(() => import('./components/FeatureCards'));
const FixesCard = lazy(() => import('./components/FixesCard'));
const NotesCard = lazy(() => import('./components/NotesCard'));

type AppState = 'idle' | 'loading' | 'error' | 'success';

function App() {
  const [state, setState] = useState<AppState>('idle');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<AnalysisError | null>(null);
  const [urlInput, setUrlInput] = useState('');

  const handleTryAgain = () => {
    setState('idle');
    setError(null);
  };

  // Light/Dark Theme Setup
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Global keyboard navigation: Escape key closes/clears the error card
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (state === 'error') {
          handleTryAgain();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state]);

  const handleToggleTheme = () => {
    setIsDark(!isDark);
  };

  const handleAnalyze = async (url: string) => {
    // Clear previous results & errors when a new search starts
    setResult(null);
    setError(null);
    setUrlInput(url);

    setState('loading');
    try {
      const data = await analyzeUrl(url);
      setResult(data);
      setState('success');
    } catch (err: unknown) {
      const formattedError =
        err instanceof AnalysisError
          ? err
          : new AnalysisError('network', (err as Error).message || 'An unexpected error occurred.');
      setError(formattedError);
      setState('error');
    }
  };

  const handleValidationError = (message: string) => {
    setResult(null);
    setError(null);
    setError(new AnalysisError('client', message));
    setState('error');
  };

  // Helper styles mappings for metrics cards
  const getHttpStatusColor = (code: number): 'green' | 'yellow' | 'red' | 'neutral' | 'blue' => {
    if (code === 200) return 'green';
    if (code === 301 || code === 302) return 'blue';
    if (code === 403 || code === 404 || code === 500) return 'red';
    if (code === 429) return 'yellow';

    if (code >= 200 && code < 300) return 'green';
    if (code >= 300 && code < 400) return 'blue';
    if (code >= 400 && code < 500) return 'yellow';
    if (code >= 500) return 'red';
    return 'neutral';
  };

  const getHttpStatusBadge = (code: number): string => {
    if (code === 200) return 'Healthy';
    if (code === 301 || code === 302) return 'Website redirected';
    if (code === 403) return 'Website blocks automated requests';
    if (code === 404) return 'Page not found';
    if (code === 429) return 'Too many requests';
    if (code === 500) return 'Internal server error';

    if (code >= 200 && code < 300) return 'Healthy';
    if (code >= 300 && code < 400) return 'Website redirected';
    if (code >= 400 && code < 505) return 'Client Error';
    if (code >= 500) return 'Server Error';
    return `Status ${code}`;
  };

  const getResponseTimeColor = (ms: number): 'green' | 'yellow' | 'red' | 'neutral' | 'blue' => {
    if (ms < 300) return 'green';
    if (ms <= 800) return 'blue';
    if (ms <= 1500) return 'yellow';
    return 'red';
  };

  const getResponseTimeBadge = (ms: number): string => {
    if (ms < 300) return 'Excellent';
    if (ms <= 800) return 'Good';
    if (ms <= 1500) return 'Average';
    return 'Slow';
  };

  const getWordCountColor = (count: number): 'green' | 'yellow' | 'red' | 'neutral' => {
    if (count >= 600) return 'green';
    if (count >= 300) return 'yellow';
    return 'red';
  };

  const getWordCountBadge = (count: number): string => {
    if (count >= 600) return 'Good Content';
    if (count >= 300) return 'Average Content';
    return 'Thin Content';
  };

  const getH1Badge = (count: number): string => {
    if (count === 1) return 'Good';
    if (count > 1) return 'Multiple';
    return 'Missing';
  };

  const getH1Color = (count: number): 'green' | 'yellow' | 'red' | 'neutral' => {
    if (count === 1) return 'green';
    if (count > 1) return 'yellow';
    return 'red';
  };

  const getAltImagesColor = (missingCount: number): 'green' | 'yellow' | 'red' | 'neutral' => {
    if (missingCount === 0) return 'green';
    if (missingCount <= 5) return 'yellow';
    return 'red';
  };

  const getTitleColor = (title: string): 'green' | 'yellow' | 'red' | 'neutral' => {
    const len = title ? title.trim().length : 0;
    if (len === 0 || title.toLowerCase() === 'no title' || title.toLowerCase() === 'no title found') return 'red';
    if (len < 30 || len > 65) return 'yellow';
    return 'green';
  };

  const getDescriptionColor = (desc: string): 'green' | 'yellow' | 'red' | 'neutral' => {
    const len = desc ? desc.trim().length : 0;
    if (len === 0 || desc.toLowerCase() === 'no meta description' || desc.toLowerCase() === 'no description') return 'red';
    if (len < 80 || len > 165) return 'yellow';
    return 'green';
  };

  // Stagger configurations for motion elements
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.25,
        ease: 'easeOut' as const,
      },
    },
  } as const;


  return (
    <div className="relative flex flex-col min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-transparent blur-3xl pointer-events-none rounded-full dark:from-indigo-500/10 dark:via-purple-500/5" />

      <Navbar isDark={isDark} onToggleTheme={handleToggleTheme} />

      <main className="relative flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col justify-start z-10">
        {/* Render Hero in Idle state only */}
        <AnimatePresence mode="wait">
          {state === 'idle' && (
            <Hero />
          )}
        </AnimatePresence>

        {/* Input Card Form (active except during loading) */}
        <div className="mb-12">
          <UrlForm
            onSubmit={handleAnalyze}
            onValidationError={handleValidationError}
            isLoading={state === 'loading'}
            initialValue={urlInput}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {state === 'idle' && (
              <motion.div
                key="idle-panel"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                {/* Feature Cards and Product Overview in Idle State */}
                <Suspense fallback={<div className="h-40 animate-pulse bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl max-w-4xl mx-auto mt-12 md:mt-16 w-full" />}>
                  <FeatureCards />
                </Suspense>

                {/* Workflow overview */}
                <div className="mt-20 border-t border-slate-200/50 dark:border-slate-800/80 pt-16 max-w-4xl mx-auto w-full text-center">
                  <h2 className="font-display text-xl font-bold text-slate-800 dark:text-white mb-2">
                    Engineered for audit clarity
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-10 leading-relaxed">
                    PagePulse performs real-time diagnostics assessing core performance parameters and metadata compliance.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
                    <div className="bg-white/40 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200/30 dark:border-slate-800/40">
                      <span className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest block mb-2">
                        Phase 01
                      </span>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1">Crawl Endpoint</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">Retrieves server statuses, headers, and measures response latency.</p>
                    </div>
                    <div className="bg-white/40 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200/30 dark:border-slate-800/40">
                      <span className="text-[10px] font-bold text-purple-500 dark:text-purple-400 uppercase tracking-widest block mb-2">
                        Phase 02
                      </span>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1">Parse Content</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">Crawls header structures, page description attributes, and image alt tags.</p>
                    </div>
                    <div className="bg-white/40 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200/30 dark:border-slate-800/40">
                      <span className="text-[10px] font-bold text-pink-500 dark:text-pink-400 uppercase tracking-widest block mb-2">
                        Phase 03
                      </span>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1">Diagnostics</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">Renders overall score checks and priority actions for improvements.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {state === 'loading' && (
              <motion.div
                key="loading-panel"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center min-h-[350px]"
              >
                <Loader />
              </motion.div>
            )}

            {state === 'error' && error && (
              <motion.div
                key="error-panel"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ErrorCard
                  error={error}
                  onRetry={() => handleAnalyze(urlInput)}
                  onReturn={handleTryAgain}
                />
              </motion.div>
            )}

            {state === 'success' && result && (
              <motion.div
                key="success-panel"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-6"
              >
                {/* Search Target Info Banner */}
                <motion.div
                  variants={itemVariants}
                  className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-5 shadow-md dark:shadow-slate-950/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                      Target Audit URL
                    </span>
                    <h2 className="text-base font-bold text-slate-800 dark:text-white tracking-tight mt-0.5 truncate">
                      {result.url}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50/70 dark:bg-indigo-950/20 border border-indigo-100/30 dark:border-indigo-900/30 rounded-xl text-indigo-750 dark:text-indigo-400 text-xs font-bold shrink-0">
                    <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                    <span>Report Generated</span>
                  </div>
                </motion.div>

                {/* Grid Row 1: SEO Health Score, Response Time, HTTP Status, Word Count */}
                <motion.div
                  variants={itemVariants}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
                >
                  <HealthScore score={result.health_score} />

                  <MetricCard
                    icon={<Clock className="h-5 w-5" />}
                    label="Response Time"
                    value={`${result.response_time_ms.toFixed(0)} ms`}
                    badge={getResponseTimeBadge(result.response_time_ms)}
                    sublabel="Optimal response latency"
                    statusColor={getResponseTimeColor(result.response_time_ms)}
                    numericValue={result.response_time_ms}
                    valueSuffix=" ms"
                  />

                  <MetricCard
                    icon={<Server className="h-5 w-5" />}
                    label="HTTP Status"
                    value={result.status_code}
                    badge={getHttpStatusBadge(result.status_code)}
                    sublabel="Server response status code"
                    statusColor={getHttpStatusColor(result.status_code)}
                  />

                  <MetricCard
                    icon={<FileDigit className="h-5 w-5" />}
                    label="Word Count"
                    value={result.word_count}
                    badge={getWordCountBadge(result.word_count)}
                    sublabel="Total content volume"
                    statusColor={getWordCountColor(result.word_count)}
                    numericValue={result.word_count}
                  />
                </motion.div>

                {/* Grid Row 2: Page Title, Meta Description, H1 Count, Missing ALT Images */}
                <motion.div
                  variants={itemVariants}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
                >
                  <MetricCard
                    icon={<Type className="h-5 w-5" />}
                    label="Page Title"
                    value={result.title || 'No title found'}
                    badge={result.title ? (result.title.trim().length < 30 || result.title.trim().length > 65 ? 'Info' : 'Good') : 'Missing'}
                    sublabel={`Length: ${result.title?.length || 0} characters`}
                    statusColor={getTitleColor(result.title)}
                  />

                  <MetricCard
                    icon={<AlignLeft className="h-5 w-5" />}
                    label="Meta Description"
                    value={result.meta_description || 'No description found'}
                    badge={result.meta_description ? (result.meta_description.trim().length < 80 || result.meta_description.trim().length > 165 ? 'Info' : 'Good') : 'Missing'}
                    sublabel={`Length: ${result.meta_description?.length || 0} characters`}
                    statusColor={getDescriptionColor(result.meta_description)}
                  />

                  <MetricCard
                    icon={<Heading1 className="h-5 w-5" />}
                    label="H1 Count"
                    value={result.h1_count}
                    badge={getH1Badge(result.h1_count)}
                    sublabel="H1 heading tag presence"
                    statusColor={getH1Color(result.h1_count)}
                    numericValue={result.h1_count}
                  />

                  <MetricCard
                    icon={<ImageOff className="h-5 w-5" />}
                    label="Missing ALT Images"
                    value={result.missing_alt_images === 0 ? '0 Missing' : `${result.missing_alt_images} Missing`}
                    badge={result.missing_alt_images === 0 ? 'Healthy' : (result.missing_alt_images <= 5 ? 'Warning' : 'Critical')}
                    sublabel={
                      result.missing_alt_images === 0
                        ? 'All images have alt tags'
                        : `${result.missing_alt_images} missing tag(s)`
                    }
                    statusColor={getAltImagesColor(result.missing_alt_images)}
                    numericValue={result.missing_alt_images}
                    valueSuffix=" Missing"
                  />
                </motion.div>
                
                {/* Grid Row 3: Priority Fixes, Engineering Notes */}
                <motion.div
                  variants={itemVariants}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <Suspense fallback={<div className="h-60 animate-pulse bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-5" />}>
                    <FixesCard fixes={result.priority_fixes} />
                  </Suspense>
                  <Suspense fallback={<div className="h-60 animate-pulse bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-5" />}>
                    <NotesCard notes={result.engineering_notes} />
                  </Suspense>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
