
import React, { useState, useEffect, useRef } from 'react';
import { User, TherapySession, ChatMessage, UserRole } from '../types';

interface SessionRoomProps {
  user: User;
  session: TherapySession;
  onLeave: () => void;
}

const SessionRoom: React.FC<SessionRoomProps> = ({ user, session, onLeave }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulated welcome messages
    const welcomeMsgs: ChatMessage[] = [
      {
        id: '1',
        senderId: session.practitionerId,
        senderName: session.practitionerName,
        senderRole: session.practitionerRole,
        text: `Hello everyone! Welcome to our ${session.type.toLowerCase()} circle on ${session.title}. This is a safe space.`,
        timestamp: Date.now() - 5000,
      }
    ];
    setMessages(welcomeMsgs);
  }, [session]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const msg: ChatMessage = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: user.role === UserRole.SEEKER ? 'Anonymous Seeker' : user.name,
      senderRole: user.role,
      text: input,
      timestamp: Date.now(),
    };
    setMessages([...messages, msg]);
    setInput('');
  };

  return (
    <div className="h-[calc(100dvh-7rem)] md:h-[calc(100vh-8rem)] flex flex-col bg-white rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-700">
      {/* Header */}
      <div className="p-6 md:p-8 bg-slate-900 text-white flex justify-between items-center shrink-0">
        <div className="flex items-center space-x-4 md:space-x-6">
          <div className="w-10 h-10 md:w-14 md:h-14 bg-cyan-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shrink-0">
             <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          </div>
          <div>
            <h3 className="text-lg md:text-2xl font-black tracking-tight line-clamp-1">{session.title}</h3>
            <div className="flex items-center space-x-2 md:space-x-3 text-cyan-400 text-[10px] md:text-xs font-black uppercase tracking-widest">
              <span>{session.type} Area</span>
              <span className="w-1 h-1 bg-white/20 rounded-full hidden md:block"></span>
              <span className="hidden md:inline">Led by {session.practitionerName}</span>
            </div>
          </div>
        </div>
        <button 
          onClick={onLeave}
          className="px-4 py-2 md:px-6 md:py-3 bg-white/10 hover:bg-red-500/20 text-white font-black text-[10px] md:text-xs uppercase tracking-widest rounded-xl transition-all border border-white/10 whitespace-nowrap"
        >
          Leave
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Participants Sidebar - Hidden on mobile */}
        <div className="w-72 border-r border-slate-100 bg-slate-50/30 hidden md:flex flex-col p-8 overflow-y-auto">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">In this circle</p>
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-600 flex items-center justify-center text-white text-xs font-black">
                {session.practitionerName[0]}
              </div>
              <div>
                <p className="text-sm font-black text-slate-800">{session.practitionerName}</p>
                <p className="text-[9px] font-bold text-cyan-600 uppercase">Practitioner</p>
              </div>
            </div>
            {/* Simulation of other participants */}
            <div className="flex items-center space-x-3 opacity-60">
              <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center text-slate-500 text-xs font-black">
                AS
              </div>
              <div>
                <p className="text-sm font-black text-slate-800">Anonymous Seeker</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase">Participant</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white text-xs font-black ring-2 ring-cyan-500/50">
                ME
              </div>
              <div>
                <p className="text-sm font-black text-slate-800">{user.role === UserRole.SEEKER ? 'Anonymous Seeker' : user.name}</p>
                <p className="text-[9px] font-bold text-cyan-600 uppercase">You</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-10 space-y-4 md:space-y-6">
            {messages.map((m) => (
              <div key={m.id} className={`flex flex-col ${m.senderId === user.id ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center space-x-2 mb-1 px-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.senderName}</span>
                  <span className="text-[9px] text-slate-300 font-bold">{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className={`max-w-[85%] md:max-w-[80%] p-4 md:p-6 rounded-[2rem] text-sm md:text-base leading-relaxed ${
                  m.senderId === user.id 
                    ? 'bg-slate-900 text-white rounded-tr-none shadow-xl' 
                    : 'bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 md:p-8 bg-white border-t border-slate-100">
            <div className="relative group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Share your thoughts here..."
                className="w-full px-6 md:px-8 py-4 md:py-6 pr-24 md:pr-32 bg-slate-50 border-2 border-transparent rounded-[2.5rem] focus:border-cyan-100 focus:bg-white transition-all font-bold text-slate-700 outline-none text-sm md:text-base"
              />
              <button 
                onClick={handleSend}
                className="absolute right-2 top-2 bottom-2 md:right-3 md:top-3 md:bottom-3 bg-cyan-600 text-white font-black px-6 md:px-10 rounded-[2rem] hover:bg-cyan-700 transition-all active:scale-95 text-sm md:text-base"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionRoom;
