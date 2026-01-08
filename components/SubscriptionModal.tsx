
import React, { useState } from 'react';
import { UserRole } from '../types';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: (tier: 'Plus' | 'Pro') => void;
  userRole: UserRole;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, onUpgrade, userRole }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  if (!isOpen) return null;

  const isPractitioner = [UserRole.STUDENT_PRACTITIONER, UserRole.LICENSED_THERAPIST, UserRole.PSYCHIATRIST].includes(userRole);
  const targetTier = isPractitioner ? 'Pro' : 'Plus';
  
  // Professional Indian Market Pricing (INR)
  // Plus (Seekers): ₹199/mo 
  // Pro (Practitioners): ₹899/mo
  const price = isPractitioner 
    ? (billingCycle === 'monthly' ? 899 : 8999)
    : (billingCycle === 'monthly' ? 199 : 1999);

  const features = isPractitioner ? [
    "Verified Practitioner Badge",
    "Host Unlimited Group Sessions",
    "Advanced Patient Analytics",
    "Priority Listing in Directory",
    "Zero Commission Fees"
  ] : [
    "Unlimited AI Companion Access",
    "Deep Holistic Health Reports",
    "Visual Study Planner (Image Scan)",
    "Priority 1-on-1 Matching",
    "Ad-Free Experience"
  ];

  const handleSubscribe = () => {
    setIsProcessing(true);
    // Simulate payment gateway delay
    setTimeout(() => {
      onUpgrade(targetTier);
      setIsProcessing(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header with decorative background */}
        <div className="bg-slate-900 text-white p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="bg-amber-400 text-amber-900 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                  {targetTier} Membership
                </span>
              </div>
              <h2 className="text-4xl font-black tracking-tight mb-2">Unlock Your Full Potential</h2>
              <p className="text-slate-400 font-medium">Invest in your mind and your future.</p>
            </div>
            <div className="text-right">
              <p className="text-5xl font-black tracking-tighter">₹{price}</p>
              <p className="text-slate-400 text-sm font-medium">per {billingCycle === 'monthly' ? 'month' : 'year'}</p>
            </div>
          </div>
        </div>

        <div className="p-10">
          {/* Toggle */}
          <div className="flex justify-center mb-10">
            <div className="bg-slate-100 p-1 rounded-2xl flex font-bold text-sm">
              <button 
                onClick={() => setBillingCycle('monthly')}
                className={`px-8 py-3 rounded-xl transition-all ${billingCycle === 'monthly' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setBillingCycle('yearly')}
                className={`px-8 py-3 rounded-xl transition-all flex items-center space-x-2 ${billingCycle === 'yearly' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
              >
                <span>Yearly</span>
                <span className="text-[9px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full ml-1">SAVE 17%</span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div className="space-y-4">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Premium Features</p>
              <ul className="space-y-4">
                {features.map((feature, idx) => (
                  <li key={idx} className="flex items-center space-x-3 text-slate-700 font-bold">
                    <div className="w-6 h-6 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex flex-col justify-center text-center">
              <h3 className="font-black text-slate-900 mb-2">Secure Processing</h3>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                Your subscription helps us maintain a safe, ad-free sanctuary for everyone. UPI & Cards accepted.
              </p>
              <div className="flex justify-center space-x-3 opacity-50 grayscale mb-6">
                <div className="h-6 w-10 bg-slate-300 rounded flex items-center justify-center text-[8px] font-bold text-white">UPI</div>
                <div className="h-6 w-10 bg-slate-300 rounded flex items-center justify-center text-[8px] font-bold text-white">VISA</div>
                <div className="h-6 w-10 bg-slate-300 rounded flex items-center justify-center text-[8px] font-bold text-white">RuPay</div>
              </div>
              <button 
                onClick={handleSubscribe}
                disabled={isProcessing}
                className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Upgrade Now</span>
                )}
              </button>
            </div>
          </div>
          
          <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            100% Money-back guarantee for 14 days
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
