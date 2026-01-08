
import React, { useState } from 'react';
import { User, UserRole, TherapySession } from '../types';

interface SessionListProps {
  user: User;
  sessions: TherapySession[];
  onCreateSession: (session: TherapySession) => void;
  onJoinSession: (id: string) => void;
  setView: (view: any) => void;
}

const SessionList: React.FC<SessionListProps> = ({ user, sessions, onCreateSession, onJoinSession, setView }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSession, setNewSession] = useState({
    title: '',
    description: '',
    type: 'Group' as any,
    maxParticipants: 5
  });

  const isPractitioner = [UserRole.STUDENT_PRACTITIONER, UserRole.LICENSED_THERAPIST, UserRole.PSYCHIATRIST].includes(user.role);
  const isStudent = user.role === UserRole.STUDENT_PRACTITIONER;
  const isSeeker = user.role === UserRole.SEEKER;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const session: TherapySession = {
      id: Date.now().toString(),
      ...newSession,
      practitionerId: user.id,
      practitionerName: user.name,
      practitionerRole: user.role,
      participants: 0,
      status: 'Open',
      startTime: Date.now() + 3600000
    };
    onCreateSession(session);
    setShowCreateModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32 pt-4">
      {/* Navigation & Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <button 
            onClick={() => setView('dashboard')}
            className="flex items-center space-x-2 text-slate-400 hover:text-cyan-600 font-black text-xs uppercase tracking-widest transition-colors mb-2 group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Dashboard</span>
          </button>
          <div className="space-y-2">
            <h2 className="text-6xl font-black text-slate-900 tracking-tighter">
              {isPractitioner ? 'Practitioner Hub' : 'Discovery & Healing'}
            </h2>
            <p className="text-slate-500 font-medium text-lg italic">
              {isPractitioner 
                ? "Manage your circles and facilitate community growth." 
                : "Join verified sessions led by students and professionals."}
            </p>
          </div>
        </div>
      </div>

      {/* Practitioner Creation Area */}
      {isPractitioner && (
        <section className="bg-slate-900 p-10 md:p-14 rounded-[4rem] text-white shadow-2xl shadow-slate-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-600/20 rounded-full -mr-48 -mt-48 blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <span className="bg-cyan-600 text-[11px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl border border-white/10 shadow-lg">Hosting Area</span>
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-4xl font-black leading-tight tracking-tight">Ready to lead a session?</h3>
              <p className="text-slate-400 text-lg font-medium leading-relaxed">
                {isStudent 
                  ? "As a student practitioner, you can host Peer Practice Circles to refine your counseling skills and support other students anonymously." 
                  : "Launch a licensed therapy session. Set your topic, attendee limits, and focus goals for the community."}
              </p>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="bg-white text-slate-900 font-black px-12 py-5 rounded-[2rem] hover:bg-slate-100 transition-all shadow-xl active:scale-95 text-lg flex items-center space-x-3"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                <span>{isStudent ? 'Start Practice Circle' : 'Launch Clinical Session'}</span>
              </button>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="w-64 h-64 bg-white/5 rounded-[3rem] border border-white/10 flex items-center justify-center backdrop-blur-sm">
                 <svg className="w-32 h-32 text-cyan-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                 </svg>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Join Session Area */}
      <section className="space-y-8">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">Available Sessions</h3>
            <span className="bg-slate-100 text-[10px] font-black text-slate-400 px-4 py-1.5 rounded-full uppercase tracking-widest">{sessions.length} Live</span>
          </div>
          {isSeeker && (
             <div className="flex items-center space-x-2 text-cyan-600 font-black text-xs uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-cyan-600 animate-pulse"></span>
                <span>Active Join Area</span>
             </div>
          )}
        </div>

        {sessions.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sessions.map((session) => (
              <div key={session.id} className="bg-white rounded-[3rem] border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_25px_80px_rgba(0,0,0,0.08)] transition-all overflow-hidden flex flex-col group border-b-8 border-b-transparent hover:border-b-cyan-500">
                <div className="p-10 pb-4 flex justify-between items-start">
                  <div className="flex flex-col space-y-2">
                    <span className={`w-fit px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                      session.practitionerRole === UserRole.STUDENT_PRACTITIONER ? 'bg-indigo-50 text-indigo-600' :
                      'bg-emerald-50 text-emerald-600'
                    }`}>
                      {session.practitionerRole === UserRole.STUDENT_PRACTITIONER ? 'Peer Practice' : 'Professional Therapy'}
                    </span>
                  </div>
                  <span className={`flex items-center space-x-1.5 text-[10px] font-black uppercase tracking-widest ${
                    session.status === 'Open' ? 'text-emerald-500' : 'text-slate-400'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${session.status === 'Open' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                    <span>{session.status}</span>
                  </span>
                </div>

                <div className="px-10 py-6 flex-1">
                  <h3 className="text-3xl font-black text-slate-900 leading-[1.1] mb-4 group-hover:text-cyan-600 transition-colors">{session.title}</h3>
                  <p className="text-base text-slate-500 font-medium leading-relaxed italic line-clamp-3">"{session.description}"</p>
                  
                  <div className="mt-8 flex items-center p-5 bg-slate-50 rounded-[2rem] border border-slate-100 group-hover:bg-white transition-colors">
                    <div className="w-14 h-14 rounded-2xl bg-white overflow-hidden border border-slate-200 shadow-sm flex-shrink-0">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${session.practitionerName}`} alt="avatar" />
                    </div>
                    <div className="ml-4 overflow-hidden">
                      <p className="text-sm font-black text-slate-900 truncate">{session.practitionerName}</p>
                      <p className="text-[10px] font-bold text-cyan-600 uppercase tracking-widest truncate">{session.practitionerRole}</p>
                    </div>
                  </div>
                </div>

                <div className="p-10 pt-4 mt-auto">
                  <div className="flex items-center justify-between mb-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                      <span>{session.participants}/{session.maxParticipants} Occupied</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => onJoinSession(session.id)}
                    disabled={session.status !== 'Open' || (session.participants >= session.maxParticipants && session.practitionerId !== user.id)}
                    className={`w-full py-6 rounded-[2rem] font-black text-lg transition-all ${
                      (session.status === 'Open' && session.participants < session.maxParticipants) || session.practitionerId === user.id
                        ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-2xl shadow-slate-200 active:scale-95' 
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {session.practitionerId === user.id ? 'Re-enter Area' : (session.status === 'Open' ? (session.participants < session.maxParticipants ? 'Join Area' : 'Area Full') : 'In Session')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-32 bg-white rounded-[4rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center text-center px-6">
             <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-8 text-slate-200">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
             </div>
             <h4 className="text-2xl font-black text-slate-400">Quiet for now.</h4>
             <p className="text-slate-500 font-medium max-w-sm mt-4 italic">"The strongest communities are those that wait for the right moment to speak."</p>
          </div>
        )}
      </section>

      {/* Modal for Creating Sessions */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white max-w-lg w-full rounded-[3.5rem] shadow-2xl p-12 animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">{isStudent ? 'New Practice Circle' : 'Clinical Setup'}</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-900 transition-colors">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Topic / Area of Focus</label>
                <input 
                  required
                  type="text" 
                  value={newSession.title}
                  onChange={e => setNewSession({...newSession, title: e.target.value})}
                  placeholder={isStudent ? "e.g. Dealing with Exam Anxiety" : "e.g. Deep Trauma Processing"}
                  className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-[2rem] focus:border-cyan-100 focus:bg-white outline-none transition-all font-bold text-slate-700"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Session Description</label>
                <textarea 
                  required
                  value={newSession.description}
                  onChange={e => setNewSession({...newSession, description: e.target.value})}
                  placeholder="What is the goal of this conversation?"
                  className="w-full h-32 px-6 py-5 bg-slate-50 border-2 border-transparent rounded-[2rem] focus:border-cyan-100 focus:bg-white outline-none transition-all font-medium text-slate-700 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Circle Size</label>
                  <input 
                    type="number" 
                    min="1"
                    max="50"
                    value={newSession.maxParticipants}
                    onChange={e => setNewSession({...newSession, maxParticipants: parseInt(e.target.value)})}
                    className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-cyan-100 focus:bg-white outline-none transition-all font-black text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Type</label>
                  <select 
                    value={newSession.type}
                    onChange={e => setNewSession({...newSession, type: e.target.value})}
                    className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-cyan-100 focus:bg-white outline-none transition-all font-black text-slate-700"
                  >
                    <option value="Group">Group</option>
                    <option value="Practice">Practice</option>
                    <option value="One-on-One">1-on-1</option>
                  </select>
                </div>
              </div>

              <button className="w-full py-6 bg-cyan-600 hover:bg-cyan-700 text-white font-black rounded-[2rem] shadow-2xl shadow-cyan-100 transition-all active:scale-95 text-lg">
                Finalize & Publish Area
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionList;
