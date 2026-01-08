
import React, { useState, useEffect } from 'react';
import { User, UserRole, TherapySession, MoodEntry } from './types';
import LandingPage from './views/LandingPage';
import Dashboard from './views/Dashboard';
import VentingWall from './views/VentingWall';
import AICompanion from './views/AICompanion';
import StudyPlanner from './views/StudyPlanner';
import SessionList from './views/SessionList';
import SessionRoom from './views/SessionRoom';
import Tracker from './views/Tracker';
import Profile from './views/Profile';
import ProResources from './views/ProResources';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import FloatingAIChat from './components/FloatingAIChat';
import SubscriptionModal from './components/SubscriptionModal';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('mindbridge_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [view, setView] = useState<'landing' | 'dashboard' | 'vent' | 'companion' | 'planner' | 'sessions' | 'tracker' | 'profile' | 'pro-resources'>('landing');
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [sessions, setSessions] = useState<TherapySession[]>(() => {
    const saved = localStorage.getItem('mindbridge_sessions');
    const initial: TherapySession[] = [
      { id: '1', title: 'Social Anxiety Group', description: 'Strategies for navigating social spaces as an introvert.', type: 'Group', practitionerId: 'prof1', practitionerName: 'Dr. Sarah Chen', practitionerRole: UserRole.LICENSED_THERAPIST, participants: 8, maxParticipants: 12, status: 'Open', startTime: Date.now() + 3600000 },
      { id: '2', title: 'Student Practice: Exam Stress', description: 'Peer support led by final-year psych students.', type: 'Practice', practitionerId: 'stu1', practitionerName: 'Alex Johnson', practitionerRole: UserRole.STUDENT_PRACTITIONER, participants: 3, maxParticipants: 5, status: 'Open', startTime: Date.now() + 7200000 },
    ];
    return saved ? JSON.parse(saved) : initial;
  });

  const [moodLogs, setMoodLogs] = useState<MoodEntry[]>(() => {
    const saved = localStorage.getItem('mindbridge_moods');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('mindbridge_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('mindbridge_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('mindbridge_sessions', JSON.stringify(sessions));
    localStorage.setItem('mindbridge_moods', JSON.stringify(moodLogs));
  }, [sessions, moodLogs]);

  const handleLogin = (userToLogin: User) => {
    // Default healing points and subscription if missing
    if (userToLogin.healingPoints === undefined) userToLogin.healingPoints = 0;
    if (userToLogin.subscriptionTier === undefined) userToLogin.subscriptionTier = 'Free';
    setUser(userToLogin);
    setView('dashboard');
  };

  const handleUpdateUser = (updatedData: Partial<User>) => {
    if (!user) return;
    const newUser = { ...user, ...updatedData };
    setUser(newUser);

    // Also update the record in the "database" (registered users list)
    const savedUsers = localStorage.getItem('mindbridge_registered_users');
    if (savedUsers) {
      const users: User[] = JSON.parse(savedUsers);
      const index = users.findIndex(u => u.id === user.id);
      if (index !== -1) {
        users[index] = { ...users[index], ...updatedData };
        localStorage.setItem('mindbridge_registered_users', JSON.stringify(users));
      }
    }
  };

  const handleUpgrade = (tier: 'Plus' | 'Pro') => {
    handleUpdateUser({ subscriptionTier: tier });
    alert(`Successfully upgraded to MindBridge ${tier}!`);
  };

  const handleDeleteAccount = () => {
    if (!user) return;
    
    // 1. Remove from registered users list (Permanent Deletion)
    const savedUsersStr = localStorage.getItem('mindbridge_registered_users');
    if (savedUsersStr) {
      const users: User[] = JSON.parse(savedUsersStr);
      const filteredUsers = users.filter(u => u.id !== user.id);
      localStorage.setItem('mindbridge_registered_users', JSON.stringify(filteredUsers));
    }

    // 2. Clear current user state and local storage session
    setUser(null);
    localStorage.removeItem('mindbridge_user');
    setView('landing');
    setActiveSessionId(null);
  };

  const handleCreateSession = (session: TherapySession) => {
    setSessions(prev => [session, ...prev]);
    setActiveSessionId(session.id);
  };

  const handleJoinSession = (id: string) => {
    setSessions(prev => prev.map(s => {
      if (s.id === id && s.participants < s.maxParticipants) {
        return { ...s, participants: s.participants + 1 };
      }
      return s;
    }));
    setActiveSessionId(id);
  };

  const handleAddMood = (entry: MoodEntry) => {
    setMoodLogs(prev => [entry, ...prev]);
  };

  // Helper to open modal from child views
  const triggerUpgrade = () => setShowSubscriptionModal(true);

  // Helper for mobile navigation
  const handleViewChange = (newView: any) => {
    setView(newView);
    setIsMobileMenuOpen(false);
  };

  const renderView = () => {
    if (!user) return <LandingPage onLogin={handleLogin} />;
    
    if (activeSessionId) {
      const activeSession = sessions.find(s => s.id === activeSessionId);
      if (activeSession) {
        return <SessionRoom user={user} session={activeSession} onLeave={() => setActiveSessionId(null)} />;
      }
    }

    switch (view) {
      case 'dashboard': return <Dashboard user={user} sessions={sessions} moodLogs={moodLogs} setView={setView} />;
      case 'vent': return <VentingWall setView={setView} user={user} setUser={setUser} />;
      case 'companion': return <AICompanion setView={setView} />;
      case 'planner': return <StudyPlanner setView={setView} user={user} onRequireUpgrade={triggerUpgrade} />;
      case 'tracker': return <Tracker moodLogs={moodLogs} onAddMood={handleAddMood} setView={setView} user={user} onRequireUpgrade={triggerUpgrade} />;
      case 'sessions': return <SessionList user={user} sessions={sessions} onCreateSession={handleCreateSession} onJoinSession={handleJoinSession} setView={setView} />;
      case 'profile': return <Profile user={user} onUpdateUser={handleUpdateUser} onDeleteAccount={handleDeleteAccount} setView={setView} />;
      case 'pro-resources': return <ProResources user={user} onRequireUpgrade={triggerUpgrade} setView={setView} />;
      default: return <Dashboard user={user} sessions={sessions} moodLogs={moodLogs} setView={setView} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-cyan-100">
      {user && (
        <Navbar 
          user={user} 
          onLogout={() => { setUser(null); setView('landing'); setActiveSessionId(null); }} 
          setView={setView} 
          onOpenUpgrade={triggerUpgrade}
          onToggleMenu={() => setIsMobileMenuOpen(true)}
        />
      )}
      <div className="flex flex-1 overflow-hidden relative">
        {user && (
          <>
            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
              <div 
                className="fixed inset-0 bg-slate-900/50 z-30 lg:hidden backdrop-blur-sm transition-opacity"
                onClick={() => setIsMobileMenuOpen(false)}
              />
            )}
            <Sidebar 
              currentView={view} 
              setView={handleViewChange} 
              user={user} 
              isOpen={isMobileMenuOpen}
              onClose={() => setIsMobileMenuOpen(false)}
            />
          </>
        )}
        <main className={`flex-1 overflow-y-auto w-full ${!user ? 'pt-0 px-0' : 'p-4 md:p-8 bg-gradient-to-br from-slate-50 to-white'}`}>
          {renderView()}
        </main>
      </div>
      {user && <FloatingAIChat />}
      {user && (
        <SubscriptionModal 
          isOpen={showSubscriptionModal} 
          onClose={() => setShowSubscriptionModal(false)}
          onUpgrade={handleUpgrade}
          userRole={user.role}
        />
      )}
    </div>
  );
};

export default App;
