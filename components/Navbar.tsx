
import React from 'react';
import { User } from '../types';

interface NavbarProps {
  user: User;
  onLogout: () => void;
  setView: (view: any) => void;
  onOpenUpgrade?: () => void;
  onToggleMenu?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, setView, onOpenUpgrade, onToggleMenu }) => {
  const isFree = !user.subscriptionTier || user.subscriptionTier === 'Free';

  return (
    <nav className="bg-white border-b border-slate-200 px-4 md:px-6 py-4 flex justify-between items-center z-20 sticky top-0 shadow-sm md:shadow-none">
      <div className="flex items-center">
        {onToggleMenu && (
          <button 
            onClick={onToggleMenu}
            className="mr-4 lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        <div 
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => setView('dashboard')}
        >
          <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight hidden md:inline">MindBridge</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 md:space-x-8">
        {isFree && onOpenUpgrade && (
          <button 
            onClick={onOpenUpgrade}
            className="flex items-center space-x-2 bg-gradient-to-r from-amber-200 to-yellow-400 text-yellow-900 px-3 py-2 md:px-4 md:py-2 rounded-xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:shadow-lg hover:scale-105 transition-all whitespace-nowrap"
          >
            <svg className="w-4 h-4 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            <span>Go Premium</span>
          </button>
        )}

        <div 
          className="text-right hidden sm:block cursor-pointer hover:opacity-75 transition-opacity"
          onClick={() => setView('profile')}
        >
          <div className="flex items-center justify-end space-x-2">
            <p className="text-sm font-semibold text-slate-800">{user.name}</p>
            {!isFree && (
              <span className="bg-cyan-100 text-cyan-700 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest">{user.subscriptionTier}</span>
            )}
          </div>
          <p className="text-xs text-cyan-600 font-medium">{user.role}</p>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-4 border-l border-slate-100 pl-2 md:pl-4">
          <button 
            onClick={() => setView('profile')}
            className="text-sm text-slate-600 hover:text-cyan-600 font-bold transition-colors flex items-center space-x-2 p-2"
          >
             <span className="md:hidden">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
             </span>
            <span className="hidden md:inline">Profile</span>
          </button>
          
          <button 
            onClick={onLogout}
            className="text-sm text-slate-400 hover:text-red-600 font-medium transition-colors p-2"
          >
            <span className="md:hidden">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </span>
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
