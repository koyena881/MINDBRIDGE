
import React from 'react';
import { User, UserRole } from '../types';

interface SidebarProps {
  currentView: string;
  setView: (view: any) => void;
  user: User;
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, user, isOpen = false, onClose }) => {
  const isFree = !user.subscriptionTier || user.subscriptionTier === 'Free';
  const isPractitioner = [UserRole.STUDENT_PRACTITIONER, UserRole.LICENSED_THERAPIST, UserRole.PSYCHIATRIST].includes(user.role);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'vent', label: 'Venting Wall', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
    { id: 'tracker', label: 'Mood Tracker', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'companion', label: 'AI Companion', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
    { id: 'planner', label: 'Study Planner', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { id: 'sessions', label: 'Therapy Sessions', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
  ];

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col h-full transform transition-transform duration-300 ease-in-out
      lg:relative lg:translate-x-0 lg:z-0 lg:shadow-none
      ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
    `}>
      <div className="p-6 space-y-2 flex-1 overflow-y-auto">
        <div className="flex justify-between items-center mb-6 lg:hidden">
           <span className="font-black text-slate-800 text-lg">Menu</span>
           <button onClick={onClose} className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-red-500">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
           </button>
        </div>

        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Main Menu</p>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
              currentView === item.id 
                ? 'bg-cyan-50 text-cyan-700 shadow-sm' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
            </svg>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}

        {/* Pro Sanctuary Menu Item */}
        <button
            onClick={() => setView('pro-resources')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group border ${
              currentView === 'pro-resources' 
                ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200' 
                : 'text-slate-800 border-slate-100 hover:border-slate-300 bg-slate-50'
            }`}
          >
            <div className="flex items-center space-x-3">
               <svg className={`w-5 h-5 flex-shrink-0 ${currentView === 'pro-resources' ? 'text-amber-400' : 'text-slate-400 group-hover:text-amber-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
               <span className="font-bold">Pro Sanctuary</span>
            </div>
            {isFree && <svg className="w-3 h-3 text-slate-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>}
          </button>

        <div className="mt-8">
          <div className="bg-gradient-to-br from-indigo-50 to-cyan-50 p-6 rounded-3xl border border-indigo-100/50">
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Impact Level</p>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-black text-indigo-900">{user.healingPoints || 0}</span>
              <span className="text-[10px] font-bold text-indigo-500 bg-white px-3 py-1 rounded-full shadow-sm">Seeds &hearts;</span>
            </div>
          </div>
        </div>

        {isPractitioner && (
          <div className="mt-8 p-6 bg-slate-900 rounded-3xl text-white">
            <div className="flex items-center space-x-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <h3 className="text-xs font-black uppercase tracking-widest">Practitioner Hub</h3>
            </div>
            <p className="text-[10px] text-slate-400 font-medium mb-4 leading-relaxed">
              As a {user.role}, you help grow the community forest.
            </p>
            <button 
              onClick={() => setView('sessions')}
              className="w-full bg-cyan-600 hover:bg-cyan-500 py-2.5 rounded-xl text-xs font-black transition-all shadow-lg shadow-cyan-900/20"
            >
              Manage Sessions
            </button>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-slate-100 shrink-0">
        <div 
          onClick={() => setView('profile')}
          className="flex items-center space-x-3 cursor-pointer hover:bg-slate-50 p-2 -mx-2 rounded-2xl transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-50 overflow-hidden border border-slate-100 p-0.5 group-hover:border-cyan-200 transition-colors flex-shrink-0">
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatar || user.name}`} 
              alt="avatar" 
              className="rounded-lg"
            />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-black text-slate-800 truncate group-hover:text-cyan-700">{user.name}</p>
            <p className="text-[10px] text-cyan-600 font-bold uppercase tracking-tight truncate">{user.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
