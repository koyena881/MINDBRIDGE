
import React, { useState, useEffect } from 'react';
import { VentPost, User } from '../types';

interface VentingWallProps {
  setView: (view: any) => void;
  user: User;
  setUser: (user: User) => void;
}

const VentingWall: React.FC<VentingWallProps> = ({ setView, user, setUser }) => {
  const [posts, setPosts] = useState<VentPost[]>(() => {
    const saved = localStorage.getItem('mindbridge_posts');
    const initial: VentPost[] = [
      { id: '1', content: "Being an introvert in college is so draining. Sometimes I just want to hide in the library forever.", timestamp: Date.now() - 3600000, tags: ['introvert', 'college'], hugs: 12, hearts: 5 },
      { id: '2', content: "I'm really struggling with my anxiety today. Just putting this out there to feel less alone.", timestamp: Date.now() - 7200000, tags: ['anxiety'], hugs: 45, hearts: 21 },
      { id: '3', content: "Got a B+ on my exam! I was so stressed but I did it. Celebrating small wins.", timestamp: Date.now() - 10800000, tags: ['wins', 'student'], hugs: 3, hearts: 89 },
    ];
    return saved ? JSON.parse(saved) : initial;
  });

  useEffect(() => {
    localStorage.setItem('mindbridge_posts', JSON.stringify(posts));
  }, [posts]);

  const [newPost, setNewPost] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    const post: VentPost = {
      id: Date.now().toString(),
      content: newPost,
      timestamp: Date.now(),
      tags: ['mental-health', 'community'],
      hugs: 0,
      hearts: 0
    };
    setPosts([post, ...posts]);
    setNewPost('');
    
    // Reward for sharing
    const updatedUser = { ...user, healingPoints: (user.healingPoints || 0) + 5 };
    setUser(updatedUser);
  };

  const handleSupport = (postId: string, type: 'hugs' | 'hearts') => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, [type]: p[type] + 1 };
      }
      return p;
    }));
    
    // Reward supporter
    const updatedUser = { ...user, healingPoints: (user.healingPoints || 0) + 1 };
    setUser(updatedUser);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-32 pt-8">
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
        <div className="w-20 h-20 bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-cyan-100 rotate-3 group-hover:-rotate-3 transition-transform">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        </div>
        <h2 className="text-6xl font-black text-slate-900 tracking-tighter">Community Wall</h2>
        <p className="text-xl text-slate-500 font-medium">Earn <span className="text-cyan-600 font-bold">Healing Points</span> by sharing and supporting others.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[3rem] shadow-[0_25px_80px_rgba(0,0,0,0.04)] border border-slate-100 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
        <textarea
          required
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Speak your truth. Get 5 healing points for sharing..."
          className="w-full h-48 p-8 bg-slate-50/50 border-2 border-transparent rounded-[2rem] focus:border-cyan-100 focus:bg-white transition-all resize-none text-xl text-slate-700 placeholder:text-slate-300 font-medium outline-none"
        />
        <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-4">
          <div className="flex items-center space-x-3 text-slate-400">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <p className="text-xs font-black uppercase tracking-widest">Always Anonymous</p>
          </div>
          <button className="bg-slate-900 hover:bg-slate-800 text-white font-black px-12 py-5 rounded-2xl transition-all shadow-2xl shadow-slate-200 active:scale-95 text-lg">
            Share Secretly
          </button>
        </div>
      </form>

      <div className="grid gap-8">
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.06)] transition-all group animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-cyan-400 rounded-full group-hover:scale-150 transition-transform"></div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Anonymous soul</span>
              </div>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                {new Date(post.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
              </span>
            </div>
            <p className="text-2xl text-slate-800 leading-relaxed font-bold italic tracking-tight">"{post.content}"</p>
            <div className="mt-10 flex flex-wrap items-center justify-between border-t border-slate-50 pt-8 gap-4">
              <div className="flex space-x-3">
                {post.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-black px-4 py-2 bg-slate-50 text-slate-400 rounded-full group-hover:bg-cyan-50 group-hover:text-cyan-600 transition-colors uppercase tracking-widest">#{tag}</span>
                ))}
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => handleSupport(post.id, 'hugs')}
                  className="flex items-center space-x-2 px-6 py-3 bg-slate-50 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-2xl font-black text-xs uppercase tracking-widest transition-all group/btn"
                >
                  <span>🤗 {post.hugs || 0} Hugs</span>
                </button>
                <button 
                   onClick={() => handleSupport(post.id, 'hearts')}
                   className="flex items-center space-x-2 px-6 py-3 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-2xl font-black text-xs uppercase tracking-widest transition-all group/btn"
                >
                  <span>❤️ {post.hearts || 0} Hearts</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VentingWall;
