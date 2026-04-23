/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Search, 
  MessageSquare, 
  Mic, 
  AlertTriangle, 
  Zap, 
  ArrowRight, 
  Loader2,
  Lock,
  RefreshCcw,
  Info,
  ExternalLink
} from 'lucide-react';
import { analyzeMessage, ScamAnalysis } from './lib/gemini';
import AnalysisReport from './components/AnalysisReport';

const EXAMPLES = [
  {
    title: "Family Emergency",
    text: "Mummy/Daddy, please I was arrested by the police on my way to campus. They need 500 GHS for settlement or they will take me to court. Send it to 0244123456 now!",
    isAudio: false
  },
  {
    title: "Fake Job Offer",
    text: "[TRANSCRIPT] Hello, am calling from Unilever HR. We saw your CV and want to offer you a remote role paying $2000 weekly. You just need to pay for your laptop insurance first via mobile money.",
    isAudio: true
  },
  {
    title: "Bank Security",
    text: "Your GTBank account has been locked due to suspicious activity. To restore access, click here: http://gtbank-security-validate.com and enter your PIN.",
    isAudio: false
  }
];

export default function App() {
  const [content, setContent] = useState('');
  const [isAudioMode, setIsAudioMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ScamAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingMessages = [
    "Analyzing linguistic patterns...",
    "Checking for common fraud tactics...",
    "Evaluating psychological triggers...",
    "Scanning for suspicious commands...",
    "Generating safety protocols..."
  ];

  useEffect(() => {
    let interval: any;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStep(s => (s + 1) % loadingMessages.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleAnalyze = async () => {
    if (!content.trim()) return;
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const analysis = await analyzeMessage(content, isAudioMode);
      setResult(analysis);
    } catch (err: any) {
      console.error(err);
      setError("Analysis unit failure. Check connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setContent('');
    setError(null);
  };

  return (
    <div className="w-full min-h-screen bg-slate-900 text-slate-100 font-sans p-4 md:p-8 flex flex-col gap-6">
      {/* Header Section */}
      <header className="flex justify-between items-center border-b border-slate-700 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded flex items-center justify-center font-bold text-xl text-white">S</div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white leading-none">ScamShield AI</h1>
            <p className="text-slate-400 text-[10px] uppercase tracking-widest mt-1">Digital Fraud Protection Unit</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">System Status</p>
            <p className="text-emerald-400 text-sm font-medium flex items-center justify-end gap-1.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Active Protection
            </p>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Input Analysis Pane */}
        <section className="col-span-1 md:col-span-5 flex flex-col gap-4">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 flex-1 flex flex-col">
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Capture Analysis Source
            </h2>
            
            <div className="flex gap-1 bg-slate-900/50 p-1 rounded-lg border border-slate-700 mb-4 self-start">
              <button 
                onClick={() => setIsAudioMode(false)}
                className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${!isAudioMode ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Text
              </button>
              <button 
                onClick={() => setIsAudioMode(true)}
                className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${isAudioMode ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Audio
              </button>
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={isAudioMode ? "Paste the transcript of the voice message here for unit analysis..." : "URGENT: Paste the message content here for unit analysis (SMS, WhatsApp, Phishing)..."}
              className="bg-slate-900 p-4 rounded-lg border border-slate-700 text-slate-300 italic text-lg leading-relaxed flex-1 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none mb-4"
            />
            
            <button 
              onClick={handleAnalyze}
              disabled={!content.trim() || isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 uppercase tracking-widest text-xs"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {isLoading ? "Analyzing..." : "Initiate Unit Scan"}
            </button>

            <div className="mt-4 p-3 bg-slate-900 rounded border-l-4 border-indigo-500">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Sender Info:</p>
              <p className="text-sm font-mono text-slate-200 uppercase tracking-tight truncate mt-0.5">Private Number / External Gateway</p>
            </div>

            <div className="mt-auto pt-4">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">Unit Guidelines:</p>
              <p className="text-[11px] text-slate-400 italic leading-relaxed">Scan captures for extreme urgency, impersonation, and suspicious command triggers using regional fraud heuristics.</p>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded text-rose-400 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> {error}
              </div>
            )}
          </div>
        </section>

        {/* Results Pane */}
        <section className="col-span-1 md:col-span-7 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {!result && !isLoading ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="bg-slate-800/30 border border-dashed border-slate-700 rounded-xl flex-1 flex flex-col items-center justify-center p-8 text-center"
              >
                <Shield className="w-16 h-16 text-slate-700 mb-4" />
                <h4 className="text-slate-400 font-bold uppercase tracking-widest text-sm">System Idle</h4>
                <p className="text-slate-500 text-xs mt-2 max-w-xs uppercase leading-relaxed">Awaiting input source for digital fraud analysis and threat classification.</p>
                
                <div className="mt-8 flex flex-wrap justify-center gap-2">
                  {EXAMPLES.map((ex, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setContent(ex.text); setIsAudioMode(ex.isAudio); }}
                      className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded text-[10px] uppercase font-bold text-slate-400 hover:text-white hover:border-indigo-500 transition-all"
                    >
                      Test: {ex.title}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : isLoading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="bg-slate-800/50 border border-slate-700 rounded-xl flex-1 flex flex-col items-center justify-center p-12 text-center"
              >
                <div className="relative w-24 h-24 mb-6">
                  <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full" />
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Zap className="w-8 h-8 text-indigo-500 animate-pulse" />
                  </div>
                </div>
                <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-2">Analyzing Capture</h3>
                <p className="text-slate-400 text-xs font-mono uppercase italic">{loadingMessages[loadingStep]}</p>
              </motion.div>
            ) : (
              <AnalysisReport result={result} onReset={handleReset} />
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* Footer Bar */}
      <footer className="border-t border-slate-700 pt-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-slate-500 uppercase tracking-widest pb-4 md:pb-0">
        <p>© 2024 ScamShield AI • Africa Regional Fraud Lab</p>
        <p>Always verify financial requests in person at official branches</p>
      </footer>
    </div>
  );
}
