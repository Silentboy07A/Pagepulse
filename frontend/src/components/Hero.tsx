import React from 'react';
import { motion } from 'framer-motion';

export const Hero: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="text-center py-12 md:py-16 max-w-3xl mx-auto px-4"
    >
      <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6">
        Instant Website SEO &{' '}
        <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent">
          Performance Auditor
        </span>
      </h1>
      <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 font-normal leading-relaxed max-w-2xl mx-auto">
        Analyze your website metadata, crawlabity, status codes, loading performance, and accessibility requirements in one click.
      </p>
    </motion.div>
  );
};
export default Hero;
