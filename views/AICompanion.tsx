
import React, { useState, useRef, useEffect } from 'react';
import { getChatStream, analyzeMentalHealth } from '../services/geminiService';
import { MentalHealthAnalysis } from '../types';

interface AICompanionProps {
  setView: (view: any) => void;
}

const AICompanion: React.FC<AICompanionProps> = ({ setView }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: "Welcome back. I'm Mindy, your safe space to reflect. I'm here to listen, analyze, and help you navigate whatever's on your mind. How are you feeling right now?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<MentalHealthAnalysis | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "I'm feeling overwhelmed by school",
    "How do I deal with social anxiety?",
    "I need help relaxing",
    "I'm having a really good day!"
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (textOverride?: string) => {
    const userMsg = textOverride || input;
    if (!userMsg.trim() || loading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      if (userMsg.length > 20) {
        analyzeMentalHealth(userMsg).then(setAnalysis).catch(console.error);
      }

      const stream = await getChatStream(userMsg, messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      })));

      let fullText = '';
      setMessages(prev => [...prev, { role: 'model', text: '' }]);
      
      for await (const chunk of stream) {
        fullText += chunk.text || '';
        setMessages(prev => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1].text = fullText;
          return newMsgs;
        });
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm having a brief connection issue, but I'm still listening. Can you try saying that again?" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100dvh-8rem)] md:h-[calc(100vh-12rem)] flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-500 overflow-hidden pb-4 md:pb-0">
      <button 
        onClick={() => setView('dashboard')}
        className="flex items-center space-x-2 text-slate-400 hover:text-cyan-600 font-black text-xs uppercase tracking-widest transition-colors group w-fit"
      >
        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span>Back to Dashboard</span>
      </button>
      
      <div className="flex-1 flex gap-8 overflow-hidden">
        <div className="flex-1 flex flex-col bg-white rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-[0_40px_100px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="p-4 md:p-8 bg-slate-900 text-white flex justify-between items-center relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="flex items-center space-x-3 md:space-x-4 relative z-10">
              <div className="w-10 h-10 md:w-14 md:h-14 bg-cyan-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-900/40 shrink-0">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <h3 className="text-base md:text-xl font-black">Chat with Mindy</h3>
                <div className="flex items-center space-x-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                   <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-cyan-100">Active Awareness Mode</p>
                </div>
              </div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-10 space-y-6 md:space-y-8 bg-slate-50/30">
            {messages.length === 1 && (
               <div className="flex flex-wrap gap-2 md:gap-3 mb-10">
                 {suggestions.map(s => (
                   <button 
                    key={s} 
                    onClick={() => handleSend(s)}
                    className="px-4 py-2 md:px-6 md:py-3 bg-white rounded-2xl border border-slate-100 text-xs md:text-sm font-bold text-slate-600 hover:border-cyan-500 hover:text-cyan-600 transition-all shadow-sm"
                   >
                     {s}
                   </button>
                 ))}
               </div>
            )}
            
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] md:max-w-[75%] p-4 md:p-6 rounded-[2rem] shadow-sm text-sm md:text-lg leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-slate-900 text-white rounded-tr-none shadow-xl shadow-slate-200' 
                    : 'bg-white text-slate-800 rounded-tl-none border border-slate-100 font-medium'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex space-x-2 items-center">
                  <div className="w-2.5 h-2.5 bg-cyan-600 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                  <div className="w-2.5 h-2.5 bg-cyan-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2.5 h-2.5 bg-cyan-600 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 md:p-8 bg-white border-t border-slate-100">
            <div className="relative group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Unburden your mind..."
                className="w-full px-6 md:px-8 py-4 md:py-6 pr-24 md:pr-32 bg-slate-50 border-2 border-transparent rounded-[2.5rem] focus:border-cyan-100 focus:bg-white focus:ring-4 focus:ring-cyan-50 transition-all font-bold text-slate-700 text-sm md:text-lg placeholder:text-slate-300 outline-none"
              />
              <button 
                onClick={() => handleSend()}
                className="absolute right-2 top-2 bottom-2 md:right-3 md:top-3 md:bottom-3 bg-cyan-600 text-white font-black px-6 md:px-10 rounded-[2rem] hover:bg-cyan-700 hover:shadow-2xl hover:shadow-cyan-100 transition-all active:scale-95 text-sm md:text-lg"
              >
                Send
              </button>
            </div>
          </div>
        </div>

        <div className="w-96 space-y-8 hidden xl:flex flex-col">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.03)] flex-shrink-0">
            <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-8 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
              <span>AI Real-time Insights</span>
            </h4>
            {analysis ? (
              <div className="space-y-8 animate-in fade-in duration-700">
                <div className="flex flex-col">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Detected State</span>
                  <span className="text-2xl font-black text-cyan-600">{analysis.mood}</span>
                </div>
                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 italic text-sm text-slate-600 leading-relaxed">
                   "{analysis.sentiment}"
                </div>
                <div className={`p-6 rounded-[2rem] border text-center ${
                  analysis.alertLevel === 'High' ? 'bg-red-50 border-red-100 text-red-700' : 
                  'bg-emerald-50 border-emerald-100 text-emerald-700'
                }`}>
                  <p className="text-[10px] font-black uppercase tracking-widest mb-1">System Stability</p>
                  <p className="font-black text-lg">{analysis.alertLevel}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 opacity-40">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <p className="text-sm font-bold text-slate-400">Analysis will appear as we talk.</p>
              </div>
            )}
          </div>
          
          <div className="bg-slate-900 p-10 rounded-[3rem] text-white flex-1 relative overflow-hidden group">
             <div className="absolute bottom-0 right-0 w-40 h-40 bg-cyan-500/10 rounded-full -mr-10 -mb-10 blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
             <h4 className="text-lg font-black mb-4 relative z-10 leading-tight">Mindy is an AI assistant, not a therapist.</h4>
             <p className="text-slate-400 text-sm font-medium leading-relaxed relative z-10 mb-8">If you're in immediate danger or a mental health crisis, please reach out to professional emergency services.</p>
             <button className="relative z-10 w-full bg-white/10 hover:bg-white/20 border border-white/10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all">
               Emergency Resources
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICompanion;
