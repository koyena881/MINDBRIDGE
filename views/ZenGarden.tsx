
import React, { useState, useEffect, useRef } from 'react';

interface ZenGardenProps {
  setView: (view: any) => void;
}

const ZenGarden: React.FC<ZenGardenProps> = ({ setView }) => {
  const [breathState, setBreathState] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [seconds, setSeconds] = useState(4);
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Volume State with persistence
  const [volume, setVolume] = useState<number>(() => {
    const saved = localStorage.getItem('mindbridge_zen_volume');
    return saved ? parseFloat(saved) : 0.6;
  });

  const sounds = [
    { 
      id: 'ocean', 
      icon: '🌊', 
      label: 'Ocean Tide', 
      color: 'bg-blue-50 text-blue-600', 
      activeColor: 'bg-blue-600 text-white',
      url: 'https://cdn.pixabay.com/audio/2022/10/24/audio_012e4f0e0f.mp3' 
    },
    { 
      id: 'rain', 
      icon: '🌲', 
      label: 'Forest Rain', 
      color: 'bg-emerald-50 text-emerald-600', 
      activeColor: 'bg-emerald-600 text-white',
      url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_c8c8a73467.mp3' 
    },
    { 
      id: 'fire', 
      icon: '🔥', 
      label: 'Night Fire', 
      color: 'bg-orange-50 text-orange-600', 
      activeColor: 'bg-orange-600 text-white',
      url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c3c3330b6e.mp3' 
    }
  ];

  // Breathing Animation Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) {
          if (breathState === 'Inhale') {
            setBreathState('Hold');
            return 4;
          } else if (breathState === 'Hold') {
            setBreathState('Exhale');
            return 4;
          } else {
            setBreathState('Inhale');
            return 4;
          }
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [breathState]);

  // Audio Cleanup on Unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Sync volume with active audio and localStorage
  useEffect(() => {
    localStorage.setItem('mindbridge_zen_volume', volume.toString());
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const toggleSound = (sound: typeof sounds[0]) => {
    if (activeSound === sound.id) {
      // Stop current sound
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setActiveSound(null);
    } else {
      // Stop previous sound if any
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      // Start new sound
      const audio = new Audio(sound.url);
      audio.loop = true;
      audio.volume = volume;
      audio.crossOrigin = "anonymous";
      audio.play().catch(err => console.error("Audio play failed:", err));
      
      audioRef.current = audio;
      setActiveSound(sound.id);
    }
  };

  return (
    <div className="max-w-5xl mx-auto min-h-[80vh] flex flex-col items-center justify-center space-y-12 animate-in fade-in zoom-in duration-1000 pb-20">
      <div className="text-center space-y-6">
        <button 
          onClick={() => setView('dashboard')}
          className="flex items-center space-x-2 text-slate-400 hover:text-emerald-600 font-black text-xs uppercase tracking-widest transition-colors mx-auto mb-4 group"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Return to Reality</span>
        </button>
        <h2 className="text-6xl font-black text-slate-900 tracking-tighter">Zen Garden</h2>
        <p className="text-xl text-slate-500 font-medium italic">Synchronize with your inner rhythm.</p>
      </div>

      <div className="relative flex items-center justify-center w-80 h-80 md:w-[32rem] md:h-[32rem]">
        {/* Breathing Circle */}
        <div className={`absolute inset-0 rounded-full border-[20px] border-emerald-100/50 transition-all duration-[4000ms] ease-in-out ${
          breathState === 'Inhale' ? 'scale-110 opacity-100' : 
          breathState === 'Hold' ? 'scale-110 opacity-80' : 'scale-50 opacity-40'
        }`} />
        
        <div className={`absolute inset-0 rounded-full border-4 border-emerald-500/20 animate-ping`} />

        <div className="relative z-10 text-center">
          <p className="text-sm font-black text-emerald-600 uppercase tracking-[0.5em] mb-4 transition-all duration-500">
            {breathState}
          </p>
          <p className="text-8xl font-black text-slate-900 tracking-tighter">
            {seconds}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl pt-12">
        {sounds.map(sound => {
          const isActive = activeSound === sound.id;
          return (
            <button 
              key={sound.id} 
              onClick={() => toggleSound(sound)}
              className={`p-8 rounded-[3rem] border transition-all flex flex-col items-center space-y-4 group relative overflow-hidden ${
                isActive 
                  ? 'bg-slate-900 border-slate-900 shadow-xl scale-105' 
                  : 'bg-white border-slate-100 hover:shadow-xl hover:shadow-slate-100'
              }`}
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-transform ${
                isActive ? 'bg-white/10 text-white rotate-12' : `${sound.color} group-hover:scale-110`
              }`}>
                {sound.icon}
              </div>
              <div className="text-center relative z-10">
                <p className={`text-xs font-black uppercase tracking-widest ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-900'
                }`}>
                  {sound.label}
                </p>
                {isActive && (
                  <div className="flex justify-center space-x-1 mt-2">
                    <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                    <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Volume Slider Control */}
      <div className="w-full max-w-md bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button 
          onClick={() => setVolume(v => v === 0 ? 0.6 : 0)}
          className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 transition-colors"
          title={volume === 0 ? "Unmute" : "Mute"}
        >
          {volume === 0 ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
          ) : volume < 0.5 ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
          ) : (
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
          )}
        </button>
        <div className="flex-1 space-y-2">
           <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
             <span>Volume</span>
             <span>{Math.round(volume * 100)}%</span>
           </div>
           <input 
             type="range" 
             min="0" 
             max="1" 
             step="0.01" 
             value={volume}
             onChange={(e) => setVolume(parseFloat(e.target.value))}
             className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-900"
           />
        </div>
      </div>

      <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">
        {activeSound ? 'Sound Playing... Tap card to Pause' : 'Select an atmosphere'}
      </p>
    </div>
  );
};

export default ZenGarden;
