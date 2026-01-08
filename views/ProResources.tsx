
import React from 'react';
import { User } from '../types';

interface ProResourcesProps {
  user: User;
  onRequireUpgrade: () => void;
  setView: (view: any) => void;
}

const ProResources: React.FC<ProResourcesProps> = ({ user, onRequireUpgrade, setView }) => {
  const isFree = !user.subscriptionTier || user.subscriptionTier === 'Free';

  const resources = [
    {
      category: 'Audio Therapy',
      items: [
        { title: 'Deep Work Binaural Beats', duration: '60 min', type: 'Focus', icon: '🎧' },
        { title: 'Social Battery Recharge', duration: '20 min', type: 'Meditation', icon: '🔋' },
        { title: 'Exam Confidence Hypnosis', duration: '30 min', type: 'Sleep', icon: '🌙' },
      ]
    },
    {
      category: 'Clinical Tools',
      items: [
        { title: 'CBT Thought Record', type: 'PDF Worksheet', icon: '📝' },
        { title: 'Anxiety Root Tracer', type: 'Interactive Tool', icon: '🌳' },
        { title: 'Mood Pattern Analytics', type: 'Advanced Report', icon: '📊' },
      ]
    },
    {
      category: 'Expert Masterclasses',
      items: [
        { title: 'Mastering Introversion', instructor: 'Dr. S. Gupta', icon: '🎓' },
        { title: 'The Physiology of Stress', instructor: 'Prof. A. Nair', icon: '🧠' },
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32 pt-4 relative">
      <div className="text-center space-y-4">
        <button 
          onClick={() => setView('dashboard')}
          className="flex items-center space-x-2 text-slate-400 hover:text-amber-600 font-black text-xs uppercase tracking-widest transition-colors mx-auto mb-4 group"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Dashboard</span>
        </button>
        <h2 className="text-6xl font-black text-slate-900 tracking-tighter">Pro Sanctuary</h2>
        <p className="text-xl text-slate-500 font-medium italic">Advanced tools for the dedicated mind.</p>
      </div>

      {/* Content Container */}
      <div className={`grid gap-12 relative ${isFree ? 'blur-sm select-none pointer-events-none' : ''}`}>
        
        {/* Featured Card */}
        <div className="bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 p-1 rounded-[3rem] shadow-xl">
           <div className="bg-white rounded-[2.8rem] p-10 md:p-14 flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1 space-y-6">
                 <span className="bg-amber-100 text-amber-700 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Featured Masterclass</span>
                 <h3 className="text-4xl font-black text-slate-900 leading-tight">Navigating Social Fatigue in University</h3>
                 <p className="text-slate-500 font-medium leading-relaxed">
                   A 4-part video series by Dr. Sarah Chen designed specifically for introverted students handling high-pressure social environments.
                 </p>
                 <button className="flex items-center space-x-3 text-slate-900 font-black text-sm uppercase tracking-widest hover:text-amber-600 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center">
                       <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>
                    </div>
                    <span>Watch Preview</span>
                 </button>
              </div>
              <div className="w-full md:w-1/3 aspect-video bg-slate-100 rounded-3xl relative overflow-hidden shadow-inner">
                 <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-20 h-20 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 </div>
              </div>
           </div>
        </div>

        {/* Resources Grid */}
        <div className="grid md:grid-cols-3 gap-8">
           {resources.map((section, idx) => (
             <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                <h4 className="text-lg font-black text-slate-900 mb-6 flex items-center space-x-2">
                   <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                   <span>{section.category}</span>
                </h4>
                <div className="space-y-4">
                   {section.items.map((item, i) => (
                     <div key={i} className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group">
                        <div className="w-12 h-12 bg-slate-50 group-hover:bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm border border-slate-100">
                           {item.icon}
                        </div>
                        <div>
                           <p className="font-bold text-slate-800 text-sm group-hover:text-amber-600 transition-colors">{item.title}</p>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              {'duration' in item ? item.duration : 'instructor' in item ? item.instructor : item.type}
                           </p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* Locked Overlay */}
      {isFree && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-auto">
           <div className="bg-white/90 backdrop-blur-md p-12 rounded-[3rem] shadow-2xl text-center max-w-lg border border-white/50">
              <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl text-amber-400">
                 <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-2">Members Only</h3>
              <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                Unlock the full library of professional mental health tools, masterclasses, and audio therapy.
              </p>
              <button 
                onClick={onRequireUpgrade}
                className="w-full py-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white font-black rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-lg flex items-center justify-center space-x-2"
              >
                <span>Unlock Pro Access</span>
                <span className="bg-amber-400 text-amber-900 text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wider">Starts ₹199</span>
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default ProResources;
