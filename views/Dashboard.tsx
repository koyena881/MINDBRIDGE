
import React from 'react';
import { User, UserRole, TherapySession, MoodEntry } from '../types';

interface DashboardProps {
  user: User;
  sessions: TherapySession[];
  moodLogs: MoodEntry[];
  setView: (view: 'dashboard' | 'vent' | 'companion' | 'planner' | 'sessions' | 'tracker') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, sessions, moodLogs, setView }) => {
  const openSessions = sessions.filter(s => s.status === 'Open').slice(0, 2);
  const latestMood = moodLogs[0];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-black text-cyan-600 uppercase tracking-[0.3em]">Welcome home</span>
            <div className="h-[2px] w-16 bg-cyan-100"></div>
          </div>
          <h2 className="text-6xl font-black text-slate-900 tracking-tighter">Hello, {user.name.split(' ')[0]}</h2>
          <p className="text-slate-400 text-xl font-medium italic">"Your healing is a revolution, not an event."</p>
        </div>
        
        <div className="flex items-center space-x-4">
           <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Impact Seeds</p>
              <p className="text-3xl font-black text-indigo-600">{user.healingPoints || 0} &hearts;</p>
           </div>
           <div 
            onClick={() => setView('tracker')}
            className="flex bg-slate-900 p-4 rounded-[3rem] border border-slate-800 shadow-2xl items-center space-x-6 cursor-pointer hover:scale-105 transition-all"
          >
            <div className="px-6 py-3 bg-white/10 rounded-[2rem] text-center text-white border border-white/5">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">State</p>
              <p className="text-xl font-black">{latestMood ? latestMood.mood.split(' ')[0] : 'Steady'}</p>
            </div>
            <div className="pr-6">
              <div className="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center text-white">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Mental Tracker Card */}
        <div 
          onClick={() => setView('tracker')}
          className="group bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col items-start cursor-pointer h-80"
        >
          <div className="w-16 h-16 bg-cyan-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-cyan-600 group-hover:text-white transition-all text-cyan-600">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h3 className="text-2xl font-black text-slate-900">Soul Tracker</h3>
          <p className="text-slate-400 mt-2 text-sm font-medium italic">Detailed analysis of your trends.</p>
        </div>

        {/* Study Architect Card */}
        <div 
          onClick={() => setView('planner')}
          className="group bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col items-start cursor-pointer h-80"
        >
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all text-indigo-600">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h3 className="text-2xl font-black text-slate-900">Study Roadmap</h3>
          <p className="text-slate-400 mt-2 text-sm font-medium italic">Balance your mind and work.</p>
        </div>

        {/* Featured Session Card */}
        <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl flex flex-col relative overflow-hidden group h-80">
          <div className="relative z-10 flex flex-col h-full">
            <span className="bg-cyan-600 w-fit text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-white/10">Live Circle</span>
            {openSessions.length > 0 ? (
              <>
                <h3 className="text-2xl font-black mt-4 leading-tight line-clamp-2">{openSessions[0].title}</h3>
                <p className="text-slate-500 text-sm mt-2 line-clamp-2">By {openSessions[0].practitionerName}</p>
                <button 
                  onClick={() => setView('sessions')}
                  className="mt-auto w-full bg-white text-slate-900 font-black py-4 rounded-2xl hover:bg-cyan-50 transition-all text-sm"
                >
                  Join Circle
                </button>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-black mt-4">Empty Nest</h3>
                <p className="text-slate-500 text-sm mt-2">No live circles right now. Start your own?</p>
                <button 
                   onClick={() => setView('sessions')}
                   className="mt-auto w-full bg-white/10 text-white font-black py-4 rounded-2xl border border-white/10 text-sm"
                >
                  Schedule One
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      <section className="bg-white p-14 rounded-[4rem] border border-slate-100 shadow-sm">
        <div className="flex justify-between items-end mb-12">
          <div className="space-y-2">
            <h3 className="text-4xl font-black text-slate-900 tracking-tighter">Community Pulse</h3>
            <p className="text-slate-400 font-medium italic">See what others are releasing anonymously.</p>
          </div>
          <button 
            onClick={() => setView('vent')}
            className="bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-cyan-600 transition-all font-black text-xs uppercase tracking-[0.2em] px-8 py-3 rounded-full"
          >
            Go to Wall &rarr;
          </button>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {[1, 2].map((i) => (
            <div 
              key={i} 
              onClick={() => setView('vent')}
              className="p-10 rounded-[3rem] bg-slate-50/50 hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-xl transition-all cursor-pointer group"
            >
               <div className="flex items-center space-x-3 mb-6">
                  <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Released {i * 15}m ago</span>
               </div>
               <p className="text-xl font-bold text-slate-800 leading-relaxed italic line-clamp-2">
                 {i === 1 ? '"Finally feeling some relief after a week of intense exams. This community helps so much."' : '"Social anxiety hit hard at the cafeteria today, but I am trying to focus on my breath."'}
               </p>
               <div className="mt-8 flex items-center justify-between">
                  <div className="flex items-center -space-x-2">
                     {[1,2,3].map(j => (
                       <div key={j} className="w-8 h-8 rounded-full bg-white border-2 border-slate-50 flex items-center justify-center text-[10px] shadow-sm">
                          {['❤️', '🤗', '✨'][j-1]}
                       </div>
                     ))}
                  </div>
                  <span className="text-[10px] font-black text-cyan-600 uppercase tracking-widest">Support Growing</span>
               </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
