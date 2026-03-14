
import React, { useState, useMemo } from 'react';
import { Share2, Users, Gift, TrendingUp, CheckCircle2, ShieldCheck, Zap, Edit3, X, ToggleLeft, ToggleRight, Info, ChevronRight } from 'lucide-react';
import { useUser } from '../../context/UserContext.ts';

const AdminReferrals: React.FC = () => {
  const { users, lotteryPlans, updateLottery } = useUser();
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({ threshold: 0, reward: 0 });

  // Statistics Calculation
  const stats = useMemo(() => {
    const activePolicies = lotteryPlans.filter(p => p.isReferralEnabled).length;
    const totalReferrers = users.filter(u => u.referralsCount > 0).length;
    
    const totalFreeTokens = users.reduce((acc, u) => {
      let count = 0;
      Object.entries(u.planReferralStats || {}).forEach(([planId, refCount]) => {
        const plan = lotteryPlans.find(p => p.id === planId);
        if (plan && plan.isReferralEnabled && plan.referralThreshold > 0) {
          count += Math.floor((refCount as number) / plan.referralThreshold) * plan.referralRewardCount;
        }
      });
      return acc + count;
    }, 0);

    const convRate = users.length > 0 ? Math.round((totalReferrers / users.length) * 100) : 0;

    return [
      { label: 'Active Policies', value: activePolicies.toString(), icon: <Zap size={18} />, color: 'bg-indigo-600' },
      { label: 'Total Referrers', value: totalReferrers.toString(), icon: <Users size={18} />, color: 'bg-emerald-600' },
      { label: 'Free Tokens Won', value: totalFreeTokens.toString(), icon: <Gift size={18} />, color: 'bg-amber-600' },
      { label: 'Conversion Rate', value: `${convRate}%`, icon: <TrendingUp size={18} />, color: 'bg-pink-600' },
    ];
  }, [users, lotteryPlans]);

  // Milestone Logs
  const rewardLogs = useMemo(() => {
    const logs: any[] = [];
    users.forEach(u => {
      Object.entries(u.planReferralStats || {}).forEach(([planId, refCount]) => {
        const plan = lotteryPlans.find(p => p.id === planId);
        if (plan && (refCount as number) > 0) {
          const cycles = Math.floor((refCount as number) / plan.referralThreshold);
          if (cycles > 0) {
            logs.push({
              user: u.firstName + ' ' + u.lastName,
              username: u.username,
              plan: plan.name,
              goal: `${refCount}/${plan.referralThreshold}`,
              date: u.joinDate || 'Recent',
              totalEarned: cycles * plan.referralRewardCount
            });
          }
        }
      });
    });
    return logs.sort((a, b) => b.totalEarned - a.totalEarned).slice(0, 10);
  }, [users, lotteryPlans]);

  const handleStartEdit = (plan: any) => {
    setEditingPlanId(plan.id);
    setEditValues({ threshold: plan.referralThreshold, reward: plan.referralRewardCount });
  };

  const handleSave = (plan: any) => {
    updateLottery({
      ...plan,
      referralThreshold: editValues.threshold,
      referralRewardCount: editValues.reward
    });
    setEditingPlanId(null);
  };

  const togglePlanReferral = (plan: any) => {
    updateLottery({
      ...plan,
      isReferralEnabled: !plan.isReferralEnabled
    });
  };

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-500 pb-20 max-w-full overflow-x-hidden">
      
      {/* 1. HEADER SECTION */}
      <div className="px-1 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 uppercase tracking-tight leading-tight">Referral Policies</h1>
          <div className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100 flex items-center w-fit space-x-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            <span>Real-time Active</span>
          </div>
        </div>
        <p className="text-[11px] md:text-sm text-slate-500 font-bold uppercase tracking-widest leading-relaxed">Manage automated reward milestones</p>
      </div>

      {/* 2. STATS - VERTICAL STACK ON MOBILE (Ek ke niche ek) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl md:rounded-[2.5rem] p-5 md:p-8 border border-slate-100 shadow-sm flex items-center md:items-start md:flex-col space-x-4 md:space-x-0 group transition-all hover:shadow-md">
             <div className={`${stat.color} w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-lg`}>
                <div className="scale-110 md:scale-125">{stat.icon}</div>
             </div>
             <div className="min-w-0 md:mt-6">
                <span className="block text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] leading-none mb-1.5 md:mb-2 truncate">{stat.label}</span>
                <h3 className="text-xl md:text-3xl font-black text-slate-900 leading-none truncate">{stat.value}</h3>
             </div>
          </div>
        ))}
      </div>

      {/* 3. POLICY GRID - ONE COLUMN ON MOBILE */}
      <section className="bg-white rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
         <div className="p-6 md:p-10 border-b border-slate-50 bg-slate-50/30">
            <h3 className="font-black text-slate-900 uppercase tracking-tight flex items-center space-x-2 text-sm md:text-lg">
              <ShieldCheck className="text-indigo-600 flex-shrink-0" size={18} />
              <span>Logic Configuration</span>
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">Customize per category</p>
         </div>

         <div className="p-4 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
               {lotteryPlans.map((plan) => (
                  <div key={plan.id} className={`p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border-2 transition-all relative overflow-hidden ${plan.isReferralEnabled ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-50 border-dashed border-slate-200 opacity-60'}`}>
                     
                     <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center space-x-3 min-w-0">
                           <span className="text-3xl flex-shrink-0">{plan.icon}</span>
                           <div className="min-w-0">
                              <span className="block font-black text-slate-900 text-xs md:text-sm uppercase truncate leading-tight">{plan.name}</span>
                              <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest block mt-0.5 ${plan.isReferralEnabled ? 'text-indigo-600' : 'text-slate-400'}`}>
                                 {plan.isReferralEnabled ? 'System Active' : 'Paused'}
                              </span>
                           </div>
                        </div>
                        <div className="flex items-center space-x-1 flex-shrink-0">
                           <button onClick={() => togglePlanReferral(plan)} className="transform scale-90 md:scale-100">
                              {plan.isReferralEnabled ? <ToggleRight className="text-emerald-500" size={32} /> : <ToggleLeft className="text-slate-300" size={32} />}
                           </button>
                           {plan.isReferralEnabled && !editingPlanId && (
                             <button onClick={() => handleStartEdit(plan)} className="p-1.5 text-slate-400 hover:text-indigo-600 transition-all">
                                <Edit3 size={16} />
                             </button>
                           )}
                        </div>
                     </div>

                     {plan.isReferralEnabled ? (
                       <div className="space-y-4">
                          {editingPlanId === plan.id ? (
                            <div className="space-y-3 animate-in fade-in slide-in-from-top-1">
                               <div className="space-y-3">
                                  <div className="space-y-1">
                                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block px-1">Invites Required</label>
                                    <input 
                                      type="number" 
                                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black text-indigo-600 outline-none"
                                      value={editValues.threshold}
                                      onChange={(e) => setEditValues({...editValues, threshold: Number(e.target.value)})}
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block px-1">Reward Tokens</label>
                                    <input 
                                      type="number" 
                                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black text-emerald-600 outline-none"
                                      value={editValues.reward}
                                      onChange={(e) => setEditValues({...editValues, reward: Number(e.target.value)})}
                                    />
                                  </div>
                               </div>
                               <div className="flex space-x-2 pt-1">
                                  <button onClick={() => handleSave(plan)} className="flex-grow py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">Save</button>
                                  <button onClick={() => setEditingPlanId(null)} className="px-4 py-3 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase">X</button>
                               </div>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 gap-2.5">
                               <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Milestone</span>
                                  <span className="text-xs font-black text-slate-900">{plan.referralThreshold} Users</span>
                               </div>
                               <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Reward</span>
                                  <span className="text-xs font-black text-emerald-600">{plan.referralRewardCount} Free Token(s)</span>
                               </div>
                            </div>
                          )}
                       </div>
                     ) : (
                       <div className="py-6 text-center flex flex-col items-center justify-center bg-slate-50/50 rounded-[1.5rem] border border-dashed border-slate-200">
                          <Info size={20} className="text-slate-300 mb-2" />
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Tracking Disabled</p>
                       </div>
                     )}
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 4. ACTIVITY LOG - SCROLLABLE TABLE */}
      <div className="bg-white rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 md:p-10 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/30">
             <h3 className="font-black text-slate-900 uppercase tracking-tight text-sm md:text-base">Recent Milestones</h3>
             <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest border border-indigo-100 bg-indigo-50 px-3 py-1.5 rounded-full shadow-sm">Live Feed</span>
          </div>

          <div className="w-full">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto no-scrollbar touch-pan-x">
               <table className="w-full text-left min-w-[700px] border-collapse">
                  <thead>
                     <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <th className="py-5 px-8">Referrer</th>
                        <th className="py-5 px-6">Plan</th>
                        <th className="py-5 px-6 text-center">Status</th>
                        <th className="py-5 px-8 text-right">Reward</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {rewardLogs.map((log, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                           <td className="py-5 px-8">
                              <div className="flex items-center space-x-3">
                                 <div className="w-9 h-9 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black text-xs uppercase border border-white shadow-md flex-shrink-0">{log.user.charAt(0)}</div>
                                 <div className="min-w-0">
                                    <span className="block font-black text-slate-900 text-xs uppercase truncate max-w-[150px]">{log.user}</span>
                                    <span className="text-[9px] text-indigo-600 font-black uppercase tracking-widest">@{log.username}</span>
                                 </div>
                              </div>
                           </td>
                           <td className="py-5 px-6 font-black text-slate-600 text-[10px] uppercase tracking-widest">{log.plan}</td>
                           <td className="py-5 px-6 text-center">
                              <div className="inline-flex items-center space-x-1.5 text-emerald-600 font-black text-[9px] uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                                 <CheckCircle2 size={10} />
                                 <span>{log.goal} Done</span>
                              </div>
                           </td>
                           <td className="py-5 px-8 text-right">
                              <div className="inline-block bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md">
                                 {log.totalEarned} Tokens
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
            {/* Mobile Cards */}
            <div className="md:hidden flex flex-col divide-y divide-slate-50">
               {rewardLogs.map((log, i) => (
                  <div key={i} className="p-4 hover:bg-slate-50/50 transition-colors flex flex-col gap-3">
                     <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3">
                           <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black text-sm uppercase border border-white shadow-md flex-shrink-0">{log.user.charAt(0)}</div>
                           <div className="min-w-0">
                              <span className="block font-black text-slate-900 text-sm uppercase truncate">{log.user}</span>
                              <span className="text-[10px] text-indigo-600 font-black uppercase tracking-widest">@{log.username}</span>
                           </div>
                        </div>
                        <div className="inline-block bg-slate-900 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md flex-shrink-0">
                           {log.totalEarned} Tokens
                        </div>
                     </div>
                     <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100 mt-1">
                        <div className="flex flex-col">
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Plan</span>
                           <span className="font-black text-slate-600 text-[11px] uppercase tracking-widest">{log.plan}</span>
                        </div>
                        <div className="inline-flex items-center space-x-1.5 text-emerald-600 font-black text-[10px] uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                           <CheckCircle2 size={12} />
                           <span>{log.goal} Done</span>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
          </div>
      </div>
    </div>
  );
};

export default AdminReferrals;
