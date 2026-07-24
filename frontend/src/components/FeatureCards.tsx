import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Eye, Check } from 'lucide-react';

export const FeatureCards: React.FC = () => {
  const features = [
    {
      icon: <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      title: 'SEO Analysis',
      details: [
        'Title tag crawling',
        'Meta description extraction',
        'Heading tag structures',
        'Content depth auditing',
      ],
      color: 'blue',
    },
    {
      icon: <Zap className="h-5 w-5 text-blue-500 dark:text-blue-400" />,
      title: 'Performance',
      details: [
        'HTTP responses and status',
        'Response latency calculations',
        'Server speed diagnostics',
        'Optimized code reports',
      ],
      color: 'blue',
    },
    {
      icon: <Eye className="h-5 w-5 text-blue-400 dark:text-blue-300" />,
      title: 'Accessibility',
      details: [
        'Missing image ALT auditing',
        'Media tags accessibility',
        'SEO semantic structures',
        'Compliance check lists',
      ],
      color: 'blue',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  } as const;

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.35,
        ease: 'easeOut' as const,
      },
    },
  } as const;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-40px' }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto px-4 mt-12 md:mt-16 w-full"
    >
      {features.map((feat, idx) => (
        <motion.div
          key={idx}
          variants={cardVariants}
          className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 shadow-md dark:shadow-slate-950/10 rounded-2xl p-6 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 group"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/50 rounded-xl group-hover:scale-110 transition-transform duration-200">
                {feat.icon}
              </div>
              <h3 className="font-display text-base font-bold text-slate-850 dark:text-white leading-tight">
                {feat.title}
              </h3>
            </div>
            
            <ul className="space-y-2">
              {feat.details.map((detail, dIdx) => (
                <li
                  key={dIdx}
                  className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400"
                >
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/50 text-blue-500 dark:text-blue-400">
                    <Check className="h-2.5 w-2.5" />
                  </span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};
export default FeatureCards;
