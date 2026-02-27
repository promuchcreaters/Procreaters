import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Users, Zap, RefreshCw, BookOpen, ChevronRight, Quote } from 'lucide-react';
import { generateStoryPlot, StoryPlot } from './services/geminiService';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [plot, setPlot] = useState<StoryPlot | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const newPlot = await generateStoryPlot();
      setPlot(newPlot);
    } catch (err) {
      setError('Failed to conjure a story. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <header className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 text-white text-xs font-medium mb-6 tracking-wider uppercase"
        >
          <Sparkles className="w-3 h-3" />
          AI Story Architect
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl sm:text-7xl font-serif font-bold tracking-tight mb-6"
        >
          Plot<span className="italic text-zinc-400">Twist</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-zinc-500 text-lg max-w-md mx-auto leading-relaxed"
        >
          Generate compelling story foundations with complex characters and unexpected narrative shifts.
        </motion.p>
      </header>

      {/* Action Button */}
      <div className="mb-16">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className={cn(
            "group relative flex items-center gap-3 px-8 py-4 bg-zinc-900 text-white rounded-2xl font-medium transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100",
            loading && "cursor-wait"
          )}
        >
          {loading ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            <Zap className="w-5 h-5 group-hover:text-yellow-400 transition-colors" />
          )}
          {loading ? 'Weaving the threads...' : plot ? 'Generate Another' : 'Generate Story Plot'}
        </button>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 mb-8"
        >
          {error}
        </motion.div>
      )}

      {/* Story Display */}
      <AnimatePresence mode="wait">
        {plot && !loading && (
          <motion.div
            key={plot.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full space-y-12"
          >
            {/* Title Section */}
            <section className="text-center">
              <h2 className="text-4xl font-serif font-bold mb-4">{plot.title}</h2>
              <div className="h-1 w-24 bg-zinc-900 mx-auto rounded-full" />
            </section>

            {/* Characters Grid */}
            <section>
              <div className="flex items-center gap-2 mb-6 border-b border-zinc-200 pb-2">
                <Users className="w-5 h-5 text-zinc-400" />
                <h3 className="text-sm font-mono uppercase tracking-widest font-bold text-zinc-500">The Cast</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plot.characters.map((char, idx) => (
                  <motion.div
                    key={char.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-6 bg-white rounded-2xl border border-zinc-200/60 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="text-xs font-mono text-zinc-400 mb-1 uppercase tracking-tighter">{char.role}</div>
                    <h4 className="text-xl font-bold mb-2">{char.name}</h4>
                    <p className="text-zinc-500 text-sm leading-relaxed">{char.description}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Conflict & Plot */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <section>
                <div className="flex items-center gap-2 mb-6 border-b border-zinc-200 pb-2">
                  <Quote className="w-5 h-5 text-zinc-400" />
                  <h3 className="text-sm font-mono uppercase tracking-widest font-bold text-zinc-500">The Conflict</h3>
                </div>
                <p className="text-xl font-serif italic text-zinc-700 leading-relaxed">
                  "{plot.conflict}"
                </p>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-6 border-b border-zinc-200 pb-2">
                  <BookOpen className="w-5 h-5 text-zinc-400" />
                  <h3 className="text-sm font-mono uppercase tracking-widest font-bold text-zinc-500">Plot Progression</h3>
                </div>
                <ul className="space-y-4">
                  {plot.plotPoints.map((point, idx) => (
                    <li key={idx} className="flex gap-3 text-zinc-600">
                      <ChevronRight className="w-5 h-5 shrink-0 text-zinc-300" />
                      <span className="text-sm leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* The Twist */}
            <motion.section
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="p-8 bg-zinc-900 text-white rounded-3xl shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Zap className="w-24 h-24" />
              </div>
              <div className="relative z-10">
                <h3 className="text-xs font-mono uppercase tracking-[0.3em] font-bold text-zinc-400 mb-4">The Twist</h3>
                <p className="text-2xl font-serif leading-snug">
                  {plot.twist}
                </p>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!plot && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center text-center mt-12"
        >
          <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mb-6">
            <BookOpen className="w-8 h-8 text-zinc-300" />
          </div>
          <p className="text-zinc-400 font-mono text-xs uppercase tracking-widest">Awaiting your command</p>
        </motion.div>
      )}

      {/* Footer */}
      <footer className="mt-auto pt-24 pb-8 text-center">
        <p className="text-zinc-400 text-xs font-mono uppercase tracking-widest">
          Crafted with Gemini AI
        </p>
      </footer>
    </div>
  );
}
