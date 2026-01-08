
import React, { useState, useRef, useEffect } from 'react';
import { getStudyPlan } from '../services/geminiService';
import { StudyTask, StudyPlanResponse, SavedStudyPlan, User } from '../types';

interface StudyPlannerProps {
  setView: (view: any) => void;
  user?: User;
  onRequireUpgrade?: () => void;
}

const StudyPlanner: React.FC<StudyPlannerProps> = ({ setView, user, onRequireUpgrade }) => {
  const [subjects, setSubjects] = useState('');
  const [hours, setHours] = useState(4);
  const [currentMood, setCurrentMood] = useState('Productive');
  const [plan, setPlan] = useState<StudyTask[]>([]);
  const [recommendations, setRecommendations] = useState<StudyPlanResponse['recommendations']>([]);
  const [loading, setLoading] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [savedPlans, setSavedPlans] = useState<SavedStudyPlan[]>(() => {
    const saved = localStorage.getItem('mindbridge_saved_plans');
    return saved ? JSON.parse(saved) : [];
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('mindbridge_saved_plans', JSON.stringify(savedPlans));
  }, [savedPlans]);

  const handleImageInputClick = () => {
    // Monetization Gate
    if (user && (!user.subscriptionTier || user.subscriptionTier === 'Free')) {
      if (onRequireUpgrade) onRequireUpgrade();
      return;
    }
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const generatePlan = async () => {
    setLoading(true);
    try {
      const subjectList = subjects.trim() ? subjects.split(',').map(s => s.trim()) : [];
      const result = await getStudyPlan(subjectList, hours, currentMood, selectedImage || undefined);
      setPlan(result.plan);
      setRecommendations(result.recommendations);
      setCompletedTasks([]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePlan = () => {
    if (plan.length === 0) return;
    const newSavedPlan: SavedStudyPlan = {
      id: Date.now().toString(),
      name: subjects.split(',')[0] || 'My Study Plan',
      timestamp: Date.now(),
      plan,
      recommendations
    };
    setSavedPlans([newSavedPlan, ...savedPlans]);
  };

  const handleLoadPlan = (saved: SavedStudyPlan) => {
    setPlan(saved.plan);
    setRecommendations(saved.recommendations);
    setCompletedTasks([]);
    // Optionally pre-fill the form fields
    setSubjects(saved.name);
  };

  const handleDeletePlan = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedPlans(prev => prev.filter(p => p.id !== id));
  };

  const toggleTask = (index: number) => {
    setCompletedTasks(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-top-4 duration-700 pb-32">
      <div className="text-center space-y-4">
        <button 
          onClick={() => setView('dashboard')}
          className="flex items-center space-x-2 text-slate-400 hover:text-indigo-600 font-black text-xs uppercase tracking-widest transition-colors mx-auto mb-4 group"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Dashboard</span>
        </button>
        <h2 className="text-6xl font-black text-slate-900 tracking-tighter">Study Architect</h2>
        <p className="text-xl text-slate-500 font-medium italic">Intelligent planning that adapts to your mind and goals.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Input Controls */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 h-fit space-y-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Visual Input (Optional)</label>
                   {user && (!user.subscriptionTier || user.subscriptionTier === 'Free') && (
                     <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest bg-amber-50 px-2 py-0.5 rounded">Pro Only</span>
                   )}
                </div>
                <div 
                  onClick={handleImageInputClick}
                  className={`w-full border-2 border-dashed rounded-3xl p-6 transition-all cursor-pointer flex flex-col items-center justify-center text-center ${
                    selectedImage ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  {selectedImage ? (
                    <div className="relative w-full h-32">
                      <img src={selectedImage} alt="Uploaded notes" className="w-full h-full object-cover rounded-2xl" />
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ) : (
                    <>
                      {user && (!user.subscriptionTier || user.subscriptionTier === 'Free') ? (
                         <div className="opacity-50">
                            <svg className="w-8 h-8 text-slate-300 mb-2 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                            <p className="text-[10px] font-black text-slate-400 uppercase">Upgrade to Scan Notes</p>
                         </div>
                      ) : (
                        <>
                           <svg className="w-8 h-8 text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                           <p className="text-[10px] font-black text-slate-400 uppercase">Scan Notes / Textbook</p>
                        </>
                      )}
                    </>
                  )}
                  <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageChange} />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Target Subjects</label>
                <textarea
                  value={subjects}
                  onChange={(e) => setSubjects(e.target.value)}
                  placeholder="List topics or let AI extract from image above..."
                  className="w-full h-24 p-6 bg-slate-50 border-2 border-transparent rounded-[2rem] focus:border-indigo-100 focus:bg-white transition-all text-slate-700 font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Today's Focus Level</label>
                <select 
                  value={currentMood}
                  onChange={(e) => setCurrentMood(e.target.value)}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-black text-slate-700"
                >
                  <option value="Productive & Focused">🔥 High Energy</option>
                  <option value="Calm & Steady">☕ Moderate Focus</option>
                  <option value="Overwhelmed & Tired">🐌 Low Energy</option>
                  <option value="Anxious">🍃 Nervous</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Study Window</label>
                <div className="flex items-center space-x-6">
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={hours}
                    onChange={(e) => setHours(parseInt(e.target.value))}
                    className="flex-1 accent-indigo-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-3xl font-black text-indigo-600 w-16 text-center">{hours}h</span>
                </div>
              </div>

              <button
                onClick={generatePlan}
                disabled={loading || (!subjects.trim() && !selectedImage)}
                className={`w-full py-5 rounded-2xl font-black text-white shadow-xl transition-all ${
                  loading || (!subjects.trim() && !selectedImage) ? 'bg-slate-200' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100 active:scale-95'
                }`}
              >
                {loading ? 'Building Architect...' : 'Create Optimized Plan'}
              </button>
            </div>
          </div>

          {/* Saved Plans Sidebar Section */}
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl space-y-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Saved Architecture</h3>
            <div className="space-y-3">
              {savedPlans.length > 0 ? (
                savedPlans.map(saved => (
                  <div 
                    key={saved.id} 
                    onClick={() => handleLoadPlan(saved)}
                    className="group p-5 bg-slate-50 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 rounded-[2rem] transition-all cursor-pointer flex justify-between items-center"
                  >
                    <div className="overflow-hidden">
                      <p className="text-sm font-black text-slate-700 truncate">{saved.name}</p>
                      <p className="text-[10px] font-bold text-slate-400">{new Date(saved.timestamp).toLocaleDateString()}</p>
                    </div>
                    <button 
                      onClick={(e) => handleDeletePlan(saved.id, e)}
                      className="p-2 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 font-medium italic text-center py-4">No saved plans yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Plan Results & Suggestions */}
        <div className="lg:col-span-8 space-y-8">
          {plan.length > 0 ? (
            <>
              {/* Toolbar Section */}
              <div className="flex justify-between items-center bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Active Plan Found</span>
                </div>
                <button 
                  onClick={handleSavePlan}
                  className="flex items-center space-x-2 px-6 py-3 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                  <span>Save Plan</span>
                </button>
              </div>

              {/* Recommendations Section */}
              <div className="grid md:grid-cols-2 gap-4">
                 {recommendations.map((rec, idx) => (
                   <div key={idx} className={`p-6 rounded-[2.5rem] border flex items-start space-x-4 transition-all hover:shadow-lg ${
                     rec.type === 'Wellness' ? 'bg-emerald-50 border-emerald-100' : 'bg-indigo-50 border-indigo-100'
                   }`}>
                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                       rec.type === 'Wellness' ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white'
                     }`}>
                       {rec.type === 'Wellness' ? (
                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                       ) : (
                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                       )}
                     </div>
                     <div>
                       <p className={`text-[10px] font-black uppercase tracking-widest ${rec.type === 'Wellness' ? 'text-emerald-600' : 'text-indigo-600'}`}>
                         AI Recommendation • {rec.type}
                       </p>
                       <h4 className="text-lg font-black text-slate-800 leading-tight">{rec.title}</h4>
                       <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed italic">"{rec.reason}"</p>
                     </div>
                   </div>
                 ))}
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center px-4">
                   <h3 className="text-xl font-black text-slate-800">Your Core Roadmap</h3>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-4 py-1.5 rounded-full">
                     {completedTasks.length}/{plan.length} Completed
                   </span>
                </div>
                <div className="space-y-4">
                  {plan.map((task, i) => (
                    <div 
                      key={i} 
                      onClick={() => toggleTask(i)}
                      className={`bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between group cursor-pointer transition-all hover:translate-x-2 ${
                        completedTasks.includes(i) ? 'opacity-50 grayscale scale-95' : 'hover:border-indigo-200'
                      }`}
                    >
                      <div className="flex items-center space-x-8">
                        <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-bold text-xs shadow-sm transition-colors ${
                          completedTasks.includes(i) ? 'bg-slate-200 text-slate-400' :
                          task.priority === 'High' ? 'bg-red-50 text-red-600' : 
                          task.priority === 'Medium' ? 'bg-indigo-50 text-indigo-600' : 
                          'bg-emerald-50 text-emerald-600'
                        }`}>
                          <span className="opacity-40 uppercase tracking-widest text-[8px]">Pri</span>
                          <span className="text-xl font-black">{task.priority[0]}</span>
                        </div>
                        <div>
                          <h4 className={`text-2xl font-black text-slate-800 ${completedTasks.includes(i) ? 'line-through' : ''}`}>{task.subject}</h4>
                          <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">{task.topic}</p>
                        </div>
                      </div>
                      <div className="text-right flex items-center space-x-4">
                        <div className="bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 font-black text-slate-600 text-sm">
                          {task.duration}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-slate-50/50 rounded-[4rem] border-4 border-dashed border-slate-200 p-16 text-center animate-pulse">
              <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mb-8 shadow-sm text-slate-100">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <h4 className="text-2xl font-black text-slate-300 tracking-tight">Your intelligent roadmap is waiting.</h4>
              <p className="text-slate-400 mt-4 max-w-sm font-medium leading-relaxed italic">Upload notes or enter subjects. AI will suggest extra topics based on your input and current energy levels.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyPlanner;
