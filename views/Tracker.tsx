
import React, { useState } from 'react';
import { MoodEntry, User } from '../types';
import { analyzeMentalHealth, getHolisticConditionReport } from '../services/geminiService';

interface TrackerProps {
  moodLogs: MoodEntry[];
  onAddMood: (entry: MoodEntry) => void;
  setView: (view: any) => void;
  user: User;
  onRequireUpgrade: () => void;
}

const Tracker: React.FC<TrackerProps> = ({ moodLogs, onAddMood, setView, user, onRequireUpgrade }) => {
  const [mood, setMood] = useState<MoodEntry['mood']>('Neutral');
  const [note, setNote] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const moodOptions: { type: MoodEntry['mood']; emoji: string; color: string }[] = [
    { type: 'Very Happy', emoji: '🤩', color: 'bg-emerald-50 text-emerald-600' },
    { type: 'Happy', emoji: '😊', color: 'bg-green-50 text-green-600' },
    { type: 'Neutral', emoji: '😐', color: 'bg-slate-50 text-slate-600' },
    { type: 'Sad', emoji: '😔', color: 'bg-blue-50 text-blue-600' },
    { type: 'Very Sad', emoji: '😫', color: 'bg-red-50 text-red-600' },
  ];

  const handleLogMood = async () => {
    if (!note.trim()) return;
    setIsAnalyzing(true);
    
    try {
      const analysis = await analyzeMentalHealth(note);
      const entry: MoodEntry = {
        id: Date.now().toString(),
        date: Date.now(),
        mood,
        note,
        analysis: analysis.sentiment
      };
      onAddMood(entry);
      setNote('');
      setMood('Neutral');
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateConditionReport = async () => {
    // Monetization Gate
    if (!user.subscriptionTier || user.subscriptionTier === 'Free') {
      onRequireUpgrade();
      return;
    }

    if (moodLogs.length === 0) return;
    setIsGeneratingReport(true);
    try {
      const res = await getHolisticConditionReport(moodLogs);
      setReport(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-32 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <button 
            onClick={() => setView('dashboard')}
            className="flex items-center space-x-2 text-slate-400 hover:text-cyan-600 font-black text-xs uppercase tracking-widest transition-colors mb-4 group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Dashboard</span>
          </button>
          <div className="space-y-2">
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Mental Wellness Hub</h2>
            <p className="text-slate-500 font-medium text-lg">Detailed analysis of your emotional journey.</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
           <button 
            onClick={generateConditionReport}
            disabled={moodLogs.length === 0 || isGeneratingReport}
            className={`font-black px-8 py-4 rounded-2xl shadow-xl transition-all active:scale-95 disabled:bg-slate-200 disabled:shadow-none flex items-center space-x-2 ${
               (!user.subscriptionTier || user.subscriptionTier === 'Free') 
               ? 'bg-slate-900 text-white hover:bg-slate-800' 
               : 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-cyan-100'
            }`}
          >
            {(!user.subscriptionTier || user.subscriptionTier === 'Free') && (
               <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
            )}
            <span>{isGeneratingReport ? 'Analyzing Trend...' : 'Generate Full Condition Report'}</span>
          </button>
          {(!user.subscriptionTier || user.subscriptionTier === 'Free') && (
             <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Premium Feature</span>
          )}
        </div>
      </div>

      {report && (
        <div className="bg-gradient-to-br from-cyan-600 to-blue-700 p-10 rounded-[3rem] text-white shadow-2xl animate-in zoom-in duration-500">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-2xl font-black">AI Condition Analysis</h3>
            <button onClick={() => setReport(null)} className="text-white/50 hover:text-white transition-colors">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="prose prose-invert max-w-none">
            <p className="text-lg leading-relaxed whitespace-pre-wrap opacity-90">{report}</p>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100 flex flex-col space-y-8">
          <div>
            <h3 className="text-xl font-black text-slate-800 mb-6 tracking-tight">Daily Log</h3>
            <div className="grid grid-cols-5 gap-3">
              {moodOptions.map((opt) => (
                <button
                  key={opt.type}
                  onClick={() => setMood(opt.type)}
                  className={`flex flex-col items-center p-4 rounded-3xl transition-all ${
                    mood === opt.type 
                      ? `${opt.color} ring-4 ring-current/10 scale-110` 
                      : 'bg-slate-50 text-slate-400 grayscale'
                  }`}
                >
                  <span className="text-2xl mb-1">{opt.emoji}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Journal Entry</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="How was your day truly? AI will help analyze your pattern..."
              className="w-full h-40 p-6 bg-slate-50 rounded-[2rem] border-2 border-transparent focus:border-cyan-100 focus:bg-white transition-all resize-none outline-none font-medium text-slate-700"
            />
          </div>

          <button
            onClick={handleLogMood}
            disabled={isAnalyzing || !note.trim()}
            className={`w-full py-5 rounded-2xl font-black text-white shadow-xl transition-all ${
              isAnalyzing || !note.trim() ? 'bg-slate-200 shadow-none' : 'bg-slate-900 hover:bg-slate-800 shadow-slate-200 active:scale-95'
            }`}
          >
            {isAnalyzing ? 'Mindful Analysis...' : 'Save & Analyze'}
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-50 rounded-full -mr-16 -mt-16 blur-3xl opacity-50"></div>
            <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center space-x-3 relative z-10">
              <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              <span>Emotional Timeline</span>
            </h3>
            
            <div className="space-y-6 relative z-10">
              {moodLogs.length > 0 ? (
                moodLogs.slice(0, 10).map((log) => (
                  <div key={log.id} className="group p-6 rounded-3xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-xl transition-all flex items-start gap-6">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm group-hover:rotate-6 transition-transform flex-shrink-0">
                      {moodOptions.find(o => o.type === log.mood)?.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-black text-slate-800">{log.mood}</span>
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                          {new Date(log.date).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed italic">"{log.note}"</p>
                      {log.analysis && (
                        <div className="mt-4 flex items-center space-x-3">
                           <div className="w-1 h-4 bg-cyan-400 rounded-full"></div>
                           <p className="text-[10px] font-black text-cyan-600 uppercase tracking-[0.2em]">AI Insight: {log.analysis}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-24 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-100 flex flex-col items-center">
                   <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm text-slate-200">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                   </div>
                   <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Your journey begins here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tracker;
