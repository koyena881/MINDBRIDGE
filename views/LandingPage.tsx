
import React, { useState, useEffect } from 'react';
import { UserRole, User } from '../types';

const roles = [
  { 
    role: UserRole.SEEKER, 
    desc: 'Anonymous peer support for students and anyone in need.', 
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' 
  },
  { 
    role: UserRole.STUDENT_PRACTITIONER, 
    desc: 'Psychology students gaining hours through peer counseling.', 
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' 
  },
  { 
    role: UserRole.LICENSED_THERAPIST, 
    desc: 'Verified professionals providing clinical group sessions.', 
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' 
  },
  { 
    role: UserRole.PSYCHIATRIST, 
    desc: 'Medical doctors managing complex psychiatric wellness.', 
    icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' 
  }
];

interface LandingPageProps {
  onLogin: (user: User) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'welcome' | 'signup' | 'login' | 'forgot-password'>('welcome');
  const [step, setStep] = useState<'role' | 'identity' | 'verify'>('role');
  const [forgotStep, setForgotStep] = useState<'email' | 'link-sent' | 'reset'>('email');
  
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let timer: number;
    if (resendTimer > 0) {
      timer = window.setInterval(() => setResendTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  const getStoredUsers = (): User[] => {
    const saved = localStorage.getItem('mindbridge_registered_users');
    return saved ? JSON.parse(saved) : [];
  };

  const saveUserToStore = (user: User) => {
    const users = getStoredUsers();
    users.push(user);
    localStorage.setItem('mindbridge_registered_users', JSON.stringify(users));
  };

  const updateStoredUsers = (users: User[]) => {
    localStorage.setItem('mindbridge_registered_users', JSON.stringify(users));
  };

  const handleStartSignup = (role: UserRole) => {
    setSelectedRole(role);
    setMode('signup');
    setStep('identity');
    setError('');
    setSuccessMsg('');
  };

  const handleSignupIdentitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const users = getStoredUsers();
    if (users.find(u => u.email === email)) {
      setError('An account with this email already exists.');
      return;
    }

    // Direct progression: Skip Verification only for Seekers
    if (selectedRole === UserRole.SEEKER) {
      const newUser: User = {
        id: 'u_' + Math.random().toString(36).substr(2, 9),
        name: name || 'Anonymous Seeker',
        email,
        password,
        role: selectedRole,
        isVerified: true,
        healingPoints: 0
      };
      saveUserToStore(newUser);
      onLogin(newUser);
    } else {
      // Both Students and Pros need to verify
      setStep('verify');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const users = getStoredUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      onLogin(user);
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  // --- Password Reset Logic ---

  const handleForgotRequestEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const users = getStoredUsers();
    if (users.find(u => u.email === email)) {
      // Generate a fake link token
      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      setForgotStep('link-sent');
      setResendTimer(30);
      console.log(`[MindBridge] Simulated Reset Link: https://mindbridge.care/reset-password?token=${token}&email=${email}`);
    } else {
      setError('No account found with this email.');
    }
  };

  const handleSimulateLinkClick = () => {
    // Simulates the user clicking the link in their email
    setForgotStep('reset');
    setError('');
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const users = getStoredUsers();
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex === -1) {
      setError('No account found with this email address.');
      return;
    }

    const updatedUsers = [...users];
    updatedUsers[userIndex] = { ...updatedUsers[userIndex], password };
    updateStoredUsers(updatedUsers);

    setSuccessMsg('Your password has been successfully updated.');
    setTimeout(() => {
      setMode('login');
      setForgotStep('email');
      setSuccessMsg('');
      setPassword('');
      setConfirmPassword('');
    }, 2000);
  };

  // --- End Password Reset Logic ---

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
    }, 2000);
  };

  const completeVerification = () => {
    if (selectedRole && name && email && password && verificationId && uploadSuccess) {
      // Prefix: 's_' for students, 'p_' for other professionals
      const prefix = selectedRole === UserRole.STUDENT_PRACTITIONER ? 's_' : 'p_';
      const newUser: User = {
        id: prefix + Math.random().toString(36).substr(2, 9),
        name,
        email,
        password,
        role: selectedRole,
        isVerified: true,
        healingPoints: 0
      };

      if (selectedRole === UserRole.STUDENT_PRACTITIONER) {
        newUser.studentId = verificationId;
      } else {
        newUser.licenseNumber = verificationId;
      }

      saveUserToStore(newUser);
      onLogin(newUser);
    }
  };

  const resendLink = () => {
    setResendTimer(30);
    console.log(`[MindBridge] Resent Link to ${email}`);
    // Re-trigger the "link sent" UI state slightly to give feedback
    const currentStep = forgotStep;
    setForgotStep('email'); // flicker
    setTimeout(() => setForgotStep(currentStep), 100);
  };

  // Rendering Forgot Password View
  if (mode === 'forgot-password') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 animate-in fade-in zoom-in duration-500">
        <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-12 border border-slate-100 relative overflow-hidden">
          
          <div className="text-center mb-10 relative z-10">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-100">
              {forgotStep === 'email' && <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>}
              {forgotStep === 'link-sent' && <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
              {forgotStep === 'reset' && <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Reset Access</h2>
            <p className="text-slate-500 font-medium mt-2 text-sm">
              {forgotStep === 'email' ? 'Enter your email to receive a secure link.' : 
               forgotStep === 'link-sent' ? 'Check your inbox for the magic link.' : 
               'Secure your account with a new password.'}
            </p>
          </div>

          {forgotStep === 'email' && (
            <form onSubmit={handleForgotRequestEmail} className="space-y-6 relative z-10">
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-black uppercase tracking-widest animate-in shake duration-300">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Your Account Email</label>
                <input 
                  required
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-indigo-100 focus:bg-white outline-none transition-all font-bold text-slate-700"
                  placeholder="your@email.com"
                />
              </div>
              <button className="w-full py-5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-lg shadow-xl shadow-slate-200 transition-all active:scale-95">
                Send Reset Link
              </button>
            </form>
          )}

          {forgotStep === 'link-sent' && (
            <div className="space-y-6 relative z-10 animate-in fade-in slide-in-from-right-8 duration-500">
              
              {/* Simulated Email Inbox UI */}
              <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-200 shadow-inner">
                 <div className="flex items-center space-x-3 mb-4 border-b border-slate-200 pb-4">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                       <span className="text-xs">✉️</span>
                    </div>
                    <div>
                       <p className="text-xs font-bold text-slate-800">MindBridge Support</p>
                       <p className="text-[10px] text-slate-400">To: {email}</p>
                    </div>
                    <span className="ml-auto text-[9px] text-slate-400 font-bold uppercase">Just Now</span>
                 </div>
                 <div className="space-y-4">
                    <p className="text-sm font-medium text-slate-600">Here is your magic link to reset your password.</p>
                    <button 
                      onClick={handleSimulateLinkClick}
                      className="w-full py-3 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95"
                    >
                      Reset Password
                    </button>
                    <p className="text-[9px] text-slate-400 text-center">(Simulated Email Viewer)</p>
                 </div>
              </div>

              <div className="text-center">
                <button 
                  type="button"
                  disabled={resendTimer > 0}
                  onClick={resendLink}
                  className={`text-indigo-600 font-black uppercase text-[10px] tracking-widest ${resendTimer > 0 ? 'opacity-50' : 'hover:text-indigo-800'}`}
                >
                  {resendTimer > 0 ? `Resend Link in ${resendTimer}s` : 'Resend Magic Link'}
                </button>
              </div>
            </div>
          )}

          {forgotStep === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-6 relative z-10 animate-in fade-in slide-in-from-right-8 duration-500">
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-black uppercase tracking-widest animate-in shake duration-300">
                  {error}
                </div>
              )}
              {successMsg && (
                <div className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl text-xs font-black uppercase tracking-widest animate-in fade-in duration-300">
                  {successMsg}
                </div>
              )}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">New Password</label>
                <input 
                  required
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-indigo-100 focus:bg-white outline-none transition-all font-bold text-slate-700"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Confirm New Password</label>
                <input 
                  required
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-indigo-100 focus:bg-white outline-none transition-all font-bold text-slate-700"
                  placeholder="••••••••"
                />
              </div>
              <button className="w-full py-5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-lg shadow-xl shadow-slate-200 transition-all active:scale-95">
                Update Password
              </button>
            </form>
          )}

          <div className="mt-10 text-center relative z-10">
             <button 
              onClick={() => { setMode('login'); setForgotStep('email'); setError(''); }}
              className="text-slate-400 font-black uppercase text-xs tracking-[0.2em] mt-2 hover:text-slate-900"
             >
               &larr; Back to Login
             </button>
          </div>
        </div>
      </div>
    );
  }

  // Rendering Login View
  if (mode === 'login') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 animate-in fade-in zoom-in duration-500">
        <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-12 border border-slate-100">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-cyan-100">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-1.17-1.951c2.139-4.388 3.923-9.17 3.923-14.12 0-3.313-2.687-6-6-6S0 1.187 0 4.5c0 4.95 1.784 9.732 3.923 14.12.333.682.355 1.487.16 2.22a10.09 10.09 0 00-.47 2.281 10.091 10.091 0 0112.502 1.341c.421.421.433.81.433 1.258" /></svg>
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Welcome Back</h2>
            <p className="text-slate-500 font-medium mt-2">Log in to your sanctuary.</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-black uppercase tracking-widest animate-in shake duration-300">
                {error}
              </div>
            )}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Email Address</label>
              <input 
                required
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-cyan-100 focus:bg-white outline-none transition-all font-bold text-slate-700"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                <button 
                  type="button"
                  onClick={() => { setMode('forgot-password'); setForgotStep('email'); setError(''); }}
                  className="text-[9px] font-black text-cyan-600 uppercase tracking-widest hover:text-cyan-800"
                >
                  Forgot Password?
                </button>
              </div>
              <input 
                required
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-cyan-100 focus:bg-white outline-none transition-all font-bold text-slate-700"
                placeholder="••••••••"
              />
            </div>
            <button className="w-full py-5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-lg shadow-xl shadow-slate-200 transition-all active:scale-95">
              Enter MindBridge
            </button>
          </form>

          <div className="mt-10 text-center">
             <p className="text-slate-400 font-medium">New to MindBridge?</p>
             <button 
              onClick={() => setMode('welcome')}
              className="text-cyan-600 font-black uppercase text-xs tracking-[0.2em] mt-2 hover:text-cyan-700"
             >
               Create an Account
             </button>
          </div>
        </div>
      </div>
    );
  }

  // Rendering Signup Identity View
  if (mode === 'signup' && step === 'identity') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-100">
          <button onClick={() => setMode('welcome')} className="mb-8 text-slate-400 hover:text-slate-600 flex items-center space-x-2 transition-colors group">
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            <span className="font-bold text-sm">Back</span>
          </button>
          
          <h2 className="text-3xl font-black text-slate-900 mb-2">Create Profile</h2>
          <p className="text-slate-500 mb-8 font-medium">Joining as <span className="text-cyan-600 font-bold">{selectedRole}</span>.</p>
          
          <form onSubmit={handleSignupIdentitySubmit} className="space-y-6">
            {error && <p className="text-red-500 text-xs font-black uppercase">{error}</p>}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Display Name</label>
              <input required type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={selectedRole === UserRole.SEEKER ? "Anonymous Alias" : "Full Name"} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-cyan-100 focus:bg-white outline-none transition-all font-bold text-slate-700" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Email</label>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-cyan-100 focus:bg-white outline-none transition-all font-bold text-slate-700" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Password</label>
              <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a secure password" className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-cyan-100 focus:bg-white outline-none transition-all font-bold text-slate-700" />
            </div>

            <button type="submit" className="w-full py-5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-lg shadow-xl shadow-slate-200 transition-all active:scale-95">
              {selectedRole === UserRole.SEEKER ? 'Complete Registration' : 'Next: Verification'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Rendering Verify Step (Professional Documents)
  if (step === 'verify' && mode === 'signup') {
    const isStudent = selectedRole === UserRole.STUDENT_PRACTITIONER;
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
        <div className="max-w-lg w-full bg-white rounded-[3rem] shadow-2xl p-12 border border-slate-100">
          <h2 className="text-3xl font-black text-slate-900 mb-6">{isStudent ? 'Student Verification' : 'Pro Verification'}</h2>
          <div className="space-y-8">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{isStudent ? 'Student ID Number' : 'License Number'}</label>
              <input type="text" value={verificationId} onChange={(e) => setVerificationId(e.target.value)} placeholder={isStudent ? "e.g. STU-88219" : "e.g. LIC-99238"} className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-cyan-100 focus:bg-white outline-none transition-all font-bold text-slate-700" />
            </div>
            <div 
              className={`border-2 border-dashed rounded-[2rem] p-10 transition-all flex flex-col items-center justify-center cursor-pointer ${uploadSuccess ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}
              onClick={() => !uploadSuccess && !isUploading && handleUpload()}
            >
              {isUploading ? (
                <p className="font-black text-cyan-600 animate-pulse">Scanning...</p>
              ) : uploadSuccess ? (
                <p className="font-black text-emerald-600">ID Verified</p>
              ) : (
                <p className="text-sm font-black text-slate-400 uppercase">{isStudent ? 'Upload Student ID' : 'Upload ID Document'}</p>
              )}
            </div>
            <button 
              disabled={!verificationId || !uploadSuccess}
              onClick={completeVerification}
              className={`w-full py-6 rounded-2xl font-black text-white text-lg ${(!verificationId || !uploadSuccess) ? 'bg-slate-200' : 'bg-cyan-600 hover:bg-cyan-700 shadow-xl shadow-cyan-100'}`}
            >
              Finalize Signup
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Initial Welcome View
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
      <div className="max-w-6xl w-full text-center space-y-12">
        <div className="animate-in fade-in slide-in-from-top-10 duration-1000">
          <div className="w-20 h-20 bg-cyan-600 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-cyan-200">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          </div>
          <h1 className="text-7xl md:text-[8rem] font-black text-slate-900 tracking-tighter leading-[0.85]">
            Bridging Minds.<br/><span className="text-cyan-600">Healing Hearts.</span>
          </h1>
          <p className="text-2xl text-slate-500 max-w-3xl mx-auto font-medium mt-8 leading-tight">
            A secure community for anonymous support, AI insights, and professional care.
          </p>
          
          <div className="mt-12 flex justify-center space-x-6">
             <button 
               onClick={() => setMode('login')}
               className="px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-lg shadow-xl hover:bg-slate-800 transition-all active:scale-95"
             >
               Already a Member? Login
             </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          {roles.map((item) => (
            <button 
              key={item.role}
              onClick={() => handleStartSignup(item.role)}
              className="group p-8 bg-white border-2 border-slate-50 hover:border-cyan-500 hover:shadow-2xl rounded-[3rem] transition-all text-left flex flex-col"
            >
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-cyan-600 group-hover:text-white transition-all text-slate-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} /></svg>
              </div>
              <h3 className="font-black text-slate-900 text-xl mb-2">{item.role}</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
              <span className="mt-auto pt-6 text-[10px] font-black uppercase tracking-widest text-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity">Sign Up Free &rarr;</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
