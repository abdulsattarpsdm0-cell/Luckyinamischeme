
import React from 'react';
import { useUser } from '../context/UserContext';
import { Share2, Copy, Users, Gift, CheckCircle2, Send, Sparkles, TrendingUp, Info, ShieldAlert } from 'lucide-react';

const ReferralPage: React.FC = () => {
  const { user, lotteryPlans } = useUser();
  const refLink = `${window.location.origin}/#/signup?ref=${user.referralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(refLink);
    alert('Referral link copied to clipboard!');
  };

  // Only show rewards for plans where the referral system is ENABLED in Admin
  const activeReferralPlans = lotteryPlans.filter(p => p.isReferralEnabled);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in duration-700">
      {/* Dynamic Hero Section */}
      <div className="bg-gradient-to-br from-[#0f172a] to-slate-900 rounded-[3rem] p-10 md:p-20 text-center text-white relative overflow-hidden mb-12 shadow-2xl border border-white/5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-[10px] font-black uppercase tracking-[0.25em] mb-8">
               <Sparkles size={14} />
               <span>Plan-Based Rewards Active</span>
            </div>
            
            <h1 className="text-4xl md:text-7xl font-black mb-8 leading-[0.9] uppercase tracking-tighter">
              Invite & Win <br/><span className="text-indigo-400">Unlimited Tokens</span>
            </h1>
            
            <div className="max-w-2xl mx-auto bg-white/5 backdrop-blur-2xl p-4 rounded-[2.5rem] flex flex-col md:flex-row items-center border border-white/10 shadow-2xl">
              <input 
                type="text" 
                readOnly 
                value={refLink}
                className="bg-transparent flex-grow px-6 py-4 font-bold text-indigo-200 outline-none truncate text-sm text-center md:text-left"
              />
              <button 
                onClick={copyToClipboard}
                className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-5 rounded-3xl font-black flex items-center justify-center space-x-3 transition-all active:scale-95 uppercase tracking-widest text-xs shadow-xl shadow-indigo-600/30"
              >
                <Copy size={18} />
                <span>Copy Link</span>
              </button>
            </div>
          </div>
      </div>

      {/* Plan-Wise Milestone Tracker */}
      <div className="mb-20">
        <div className="flex items-center justify-between mb-10">
           <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                 <TrendingUp size={28} />
              </div>
              <div>
                 <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Referral Goals</h2>
                 <p className="text-sm font-medium text-slate-500">Earn free tokens by inviting friends to join specific lotteries.</p>
              </div>
           </div>
           <div className="hidden md:flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
              <Info size={14} />
              <span>Rewards are repeatable</span>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeReferralPlans.map((plan) => {
            const currentRefs = user.planReferralStats[plan.id] || 0;
            const threshold = plan.referralThreshold;
            const rewardCycles = Math.floor(currentRefs / threshold);
            const progressCount = currentRefs % threshold;
            const progressPercent = (progressCount / threshold) * 100;

            return (
              <div key={plan.id} className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-50 transition-colors"></div>
                 
                 <div className="relative z-10">
                   <div className="flex justify-between items-start mb-10">
                      <div className="flex items-center space-x-4">
                        <span className="text-5xl group-hover:scale-110 transition-transform">{plan.icon}</span>
                        <div>
                           <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none mb-1">{plan.name}</h4>
                           <span className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.2em]">Active Reward Plan</span>
                        </div>
                      </div>
                      {rewardCycles > 0 && (
                        <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg font-black text-[10px] uppercase border border-emerald-100 animate-bounce">
                          {rewardCycles} Earned
                        </div>
                      )}
                   </div>
                   
                   <p className="text-slate-500 text-xs font-medium mb-10 leading-relaxed">
                     Invite friends who purchase <span className="text-slate-900 font-black">{plan.name}</span> tokens. <br/>
                     Every <span className="font-black text-indigo-600">{threshold} users</span> = <span className="font-black text-emerald-600">{plan.referralRewardCount} FREE TOKEN(S)</span>.
                   </p>
                   
                   <div className="mb-10">
                     <div className="flex justify-between text-[10px] font-black text-slate-400 mb-3 uppercase tracking-[0.2em]">
                       <span>Current Progress</span>
                       <span>{progressCount} / {threshold} Friends</span>
                     </div>
                     <div className="w-full h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner p-1">
                       <div 
                         className="h-full bg-indigo-600 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(79,70,229,0.4)]" 
                         style={{ width: `${progressPercent}%` }}
                       ></div>
                     </div>
                   </div>
                   
                   <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center space-x-2">
                         <Gift size={16} className="text-indigo-400" />
                         <span className="text-[10px] font-black text-slate-500 uppercase">Total Free Tokens</span>
                      </div>
                      <span className="font-black text-slate-900 text-sm">{(rewardCycles * plan.referralRewardCount)} Earned</span>
                   </div>
                 </div>
              </div>
            );
          })}
          
          {activeReferralPlans.length === 0 && (
            <div className="col-span-full py-24 bg-slate-50 rounded-[4rem] border border-dashed border-slate-200 text-center flex flex-col items-center">
               <ShieldAlert size={64} className="text-slate-200 mb-6" />
               <h4 className="text-slate-900 font-black uppercase text-xl mb-2">No Active Reward Programs</h4>
               <p className="text-slate-400 font-medium max-w-sm mx-auto">Referral system is currently maintenance pe hai ya koi active plans nahi hain. Jald hi naye rewards add honge!</p>
            </div>
          )}
        </div>
      </div>

      {/* Trust & Transparency */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
         <div className="bg-emerald-50 rounded-[3rem] p-12 border border-emerald-100">
            <h3 className="text-2xl font-black text-emerald-900 uppercase tracking-tight mb-4 flex items-center space-x-3">
               <CheckCircle2 size={24} />
               <span>Instant Real-Time Credit</span>
            </h3>
            <p className="text-emerald-700/70 text-sm font-medium leading-relaxed">
              System naye plans ke liye bhi real-time kaam karta hai. Jaise hi admin naya plan enable karte hain, milestones aapke dashboard par foran show ho jaty hain.
            </p>
         </div>
         <div className="bg-amber-50 rounded-[3rem] p-12 border border-amber-100">
            <h3 className="text-2xl font-black text-amber-900 uppercase tracking-tight mb-4 flex items-center space-x-3">
               <Share2 size={24} />
               <span>Dynamic Policies</span>
            </h3>
            <p className="text-amber-700/70 text-sm font-medium leading-relaxed">
              Admin kisi bhi waqt rewards goal ya tokens ki tadad change kar sakty hain. Purany referrals mehfooz rahen gy aur nayi policy naye users par apply hogi.
            </p>
         </div>
      </div>
    </div>
  );
};

export default ReferralPage;
