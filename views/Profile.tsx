
import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface ProfileProps {
  user: User;
  onUpdateUser: (data: Partial<User>) => void;
  onDeleteAccount: () => void;
  setView: (view: any) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser, onDeleteAccount, setView }) => {
  const [name, setName] = useState(user.name);
  const [avatarSeed, setAvatarSeed] = useState(user.avatar || user.name);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Update avatar preview when name changes if user hasn't set a custom seed
  useEffect(() => {
    if (!user.avatar && name !== user.name) {
      setAvatarSeed(name);
    }
  }, [name, user.name, user.avatar]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulate network delay
    setTimeout(() => {
      onUpdateUser({
        name,
        avatar: avatarSeed
      });
      setIsSaving(false);
      setSuccessMsg('Profile updated successfully.');
      
      setTimeout(() => setSuccessMsg(''), 3000);
    }, 800);
  };

  const handleRandomizeAvatar = () => {
    setAvatarSeed(Math.random().toString(36).substring(7));
  };

  const handleDeleteClick = () => {
    if (window.confirm("Are you absolutely sure? This action cannot be undone and your account data will be permanently lost.")) {
      onDeleteAccount();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32 pt-8">
      <div className="text-center space-y-4">
        <button 
          onClick={() => setView('dashboard')}
          className="flex items-center space-x-2 text-slate-400 hover:text-cyan-600 font-black text-xs uppercase tracking-widest transition-colors mx-auto mb-4 group"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Dashboard</span>
        </button>
        <h2 className="text-6xl font-black text-slate-900 tracking-tighter">Your Profile</h2>
        <p className="text-xl text-slate-500 font-medium italic">Manage your identity in the sanctuary.</p>
      </div>

      <div className="bg-white rounded-[3.5rem] p-10 md:p-14 shadow-2xl shadow-slate-200 border border-slate-100">
        <form onSubmit={handleSubmit} className="grid md:grid-cols-12 gap-12">
          
          {/* Avatar Section */}
          <div className="md:col-span-4 flex flex-col items-center space-y-6">
            <div className="relative group">
              <div className="w-48 h-48 rounded-[2.5rem] bg-slate-50 border-4 border-white shadow-xl overflow-hidden relative">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`} 
                  alt="Avatar Preview" 
                  className="w-full h-full object-cover"
                />
              </div>
              <button 
                type="button"
                onClick={handleRandomizeAvatar}
                className="absolute bottom-4 right-4 bg-white p-3 rounded-xl shadow-lg hover:scale-110 transition-transform text-slate-600 hover:text-cyan-600"
                title="Randomize Look"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              </button>
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest text-center">
              Visual Identity<br/>
              <span className="font-medium text-slate-300 normal-case">Generated via DiceBear</span>
            </p>
          </div>

          {/* Form Section */}
          <div className="md:col-span-8 space-y-8">
            {successMsg && (
              <div className="bg-emerald-50 text-emerald-600 px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest animate-in fade-in slide-in-from-top-2">
                {successMsg}
              </div>
            )}
            
            <div className="space-y-4">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-4">Display Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent rounded-[2rem] focus:border-cyan-100 focus:bg-white outline-none transition-all font-bold text-lg text-slate-700 placeholder-slate-300"
                placeholder="How should we call you?"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-4">Role</label>
                <div className="w-full px-8 py-5 bg-slate-50 rounded-[2rem] font-bold text-slate-500 cursor-not-allowed opacity-75">
                  {user.role}
                </div>
              </div>
              <div className="space-y-4">
                 <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-4">Healing Points</label>
                 <div className="w-full px-8 py-5 bg-indigo-50 text-indigo-600 rounded-[2rem] font-black border border-indigo-100">
                    {user.healingPoints || 0} &hearts;
                 </div>
              </div>
            </div>

            {(user.studentId || user.licenseNumber) && (
              <div className="space-y-4">
                 <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-4">
                    {user.studentId ? 'Verified Student ID' : 'License Number'}
                 </label>
                 <div className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-[2rem] font-bold text-slate-600 flex items-center justify-between">
                    <span>{user.studentId || user.licenseNumber}</span>
                    <div className="flex items-center space-x-2 text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                       <span>Verified</span>
                    </div>
                 </div>
              </div>
            )}

            <div className="space-y-4">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-4">Email Address</label>
              <div className="w-full px-8 py-5 bg-slate-50 rounded-[2rem] font-bold text-slate-500 cursor-not-allowed opacity-75">
                {user.email}
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit"
                disabled={isSaving}
                className={`w-full py-5 rounded-[2rem] font-black text-white text-lg shadow-xl transition-all active:scale-95 ${
                  isSaving ? 'bg-slate-300 cursor-wait' : 'bg-slate-900 hover:bg-slate-800 shadow-slate-200'
                }`}
              >
                {isSaving ? 'Saving Changes...' : 'Save Profile'}
              </button>
            </div>

            {/* Danger Zone */}
            <div className="pt-12 mt-12 border-t border-slate-100 space-y-4">
               <h3 className="text-sm font-black text-red-500 uppercase tracking-widest">Danger Zone</h3>
               <div className="bg-red-50 rounded-[2rem] p-6 border border-red-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div>
                    <h4 className="font-bold text-red-900">Delete Account</h4>
                    <p className="text-xs text-red-700/70 mt-1">Permanently remove your profile and all data.</p>
                  </div>
                  <button 
                    type="button"
                    onClick={handleDeleteClick}
                    className="px-6 py-3 bg-white text-red-600 font-black text-xs uppercase tracking-widest rounded-xl shadow-sm hover:bg-red-600 hover:text-white transition-all border border-red-100"
                  >
                    Delete Forever
                  </button>
               </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
