import { motion } from "motion/react";
import { ShieldAlert, AlertTriangle, CheckCircle2, Siren, Info } from "lucide-react";
import { ScamAnalysis } from "../lib/gemini";

interface Props {
  result: ScamAnalysis;
  onReset: () => void;
}

export default function AnalysisReport({ result, onReset }: Props) {
  const getVerdictStyles = () => {
    switch (result.verdict) {
      case 'SAFE':
        return {
          textColor: 'text-emerald-400',
          borderColor: 'border-emerald-500/30',
          glowColor: 'bg-emerald-500/10',
          indicatorColor: 'stroke-emerald-500',
          label: 'SAFE'
        };
      case 'SUSPICIOUS':
        return {
          textColor: 'text-amber-400',
          borderColor: 'border-amber-500/30',
          glowColor: 'bg-amber-500/10',
          indicatorColor: 'stroke-amber-500',
          label: 'SUSPICIOUS'
        };
      case 'SCAM LIKELY':
        return {
          textColor: 'text-rose-500',
          borderColor: 'border-rose-500/30',
          glowColor: 'bg-rose-500/10',
          indicatorColor: 'stroke-rose-500',
          label: 'SCAM LIKELY'
        };
    }
  };

  const styles = getVerdictStyles();
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (result.scamProbability / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col gap-6"
    >
      {/* Score & Verdict Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-auto md:h-32">
        <div className={`${styles.glowColor} border ${styles.borderColor} rounded-xl p-5 flex items-center gap-5`}>
          <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
            <svg className="absolute w-full h-full rotate-[-90deg]">
              <circle cx="40" cy="40" r={radius} stroke="#334155" strokeWidth="6" fill="transparent" />
              <motion.circle 
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1, ease: "easeOut" }}
                cx="40" cy="40" r={radius} 
                className={`${styles.indicatorColor}`} 
                strokeWidth="6" fill="transparent" 
                strokeDasharray={circumference} 
              />
            </svg>
            <span className={`text-2xl font-bold ${styles.textColor}`}>{result.scamProbability}%</span>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Scam Probability</p>
            <h3 className={`text-2xl font-black ${styles.textColor}`}>{styles.label}</h3>
          </div>
        </div>
        
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 flex flex-col justify-center">
          <p className="text-xs text-slate-400 uppercase font-semibold">Threat Classification</p>
          <h3 className="text-xl font-bold text-white leading-tight">{result.threatType}</h3>
          <p className="text-sm text-slate-400">Tactics: {result.psychologicalTactics.join(", ")}</p>
        </div>
      </div>

      {/* Analysis Details Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        {/* Red Flags Panel */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <h4 className="text-sm font-semibold text-rose-400 uppercase mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Identified Red Flags
          </h4>
          <ul className="space-y-3">
            {result.redFlags.map((flag, idx) => (
              <li key={idx} className="flex gap-3 text-sm text-slate-300">
                <span className="text-rose-500 text-lg leading-none">•</span>
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Psychological Tactics Panel */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <h4 className="text-sm font-semibold text-indigo-400 uppercase mb-4 flex items-center gap-2">
            <Info className="w-4 h-4" />
            Analysis Summary
          </h4>
          <p className="text-sm text-slate-400 leading-relaxed italic mb-4">
            {result.explanation}
          </p>
          <div className="flex flex-wrap gap-2">
            {result.psychologicalTactics.map((tactic, idx) => (
              <span key={idx} className="bg-slate-900 border border-slate-700 text-indigo-300 text-[10px] uppercase font-bold px-2 py-1 rounded">
                {tactic}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Actions Bar */}
      <div className="bg-indigo-600 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold uppercase tracking-tight mb-1 text-white">Safety Protocol Recommended</h4>
          <p className="text-indigo-100 text-sm">{result.recommendedActions.slice(0, 3).join(". ")}.</p>
        </div>
        <button 
          onClick={onReset}
          className="bg-white text-indigo-600 font-bold px-6 py-2 rounded-lg shadow-lg hover:bg-indigo-50 transition-colors whitespace-nowrap active:scale-95"
        >
          Check Another
        </button>
      </div>
    </motion.div>
  );
}
