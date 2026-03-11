
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Ticket, Trophy, AlertCircle, ShoppingBag, ChevronRight, Calendar, Hash, Clock } from 'lucide-react';

const MyTokensPage: React.FC = () => {
  const { tokens, lotteryPlans } = useUser();
  const [activePlanId, setActivePlanId] = useState<string>('');

  // Set initial active plan to the first one available
  useEffect(() => {
    if (lotteryPlans.length > 0 && !activePlanId) {
      setActivePlanId(lotteryPlans[0].id);
    }
  }, [lotteryPlans, activePlanId]);

  const selectedPlan = useMemo(() => 
    lotteryPlans.find(p => p.id === activePlanId), 
  [lotteryPlans, activePlanId]);

  const filteredTokens = useMemo(() => 
    tokens.filter(t => t.planId === activePlanId),
  [tokens, activePlanId]);

  const totalWinnings = useMemo(() => 
    tokens.reduce((sum, t) => sum + (t.prizeAmount || 0), 0),
  [tokens]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 space-y-6 md:space-y-0">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tight leading-none mb-3">My Tokens</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
              <Ticket size={12} />
              <span>Total: {tokens.length}</span>
            </div>
            <div className="flex items-center space-x-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
              <Trophy size={12} />
              <span>Won: Rs {totalWinnings.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <Link 
          to="/lotteries" 
          className="flex items-center space-x-2 px-6 py-3 bg-[#1a233a] hover:bg-indigo-600 text-white font-black rounded-2xl transition-all text-[10px] uppercase tracking-widest shadow-xl shadow-slate-900/10 active:scale-95"
        >
          <ShoppingBag size={16} />
          <span>Buy More Tokens</span>
        </Link>
      </div>

      {/* DYNAMIC PLAN TABS - SHOWS ALL SECTIONS (Weekly & Monthly) */}
      <div className="mb-10">
        <div className="flex bg-slate-100 p-1.5 rounded-[2rem] border border-slate-200 shadow-sm overflow-x-auto no-scrollbar">
          {lotteryPlans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setActivePlanId(plan.id)}
              className={`flex-none md:flex-1 px-6 md:px-4 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center space-x-2 whitespace-nowrap ${
                activePlanId === plan.id 
                  ? 'bg-white text-indigo-600 shadow-md scale-[1.02] z-10' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
              }`}
            >
              <span className="text-lg">{plan.icon}</span>
              <span>{plan.name}</span>
              {tokens.filter(t => t.planId === plan.id).length > 0 && (
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] ${activePlanId === plan.id ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                   {tokens.filter(t => t.planId === plan.id).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tokens Display Area */}
      {filteredTokens.length === 0 ? (
        <div className="bg-white rounded-[3rem] p-16 md:p-24 text-center border border-slate-100 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
           <div className="relative z-10">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <ShoppingBag size={48} className="text-slate-200" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">No {selectedPlan?.name || 'Category'} Tokens</h3>
              <p className="text-slate-400 mb-10 max-w-sm mx-auto font-medium text-sm">
                Aap ne is category mein koi token nahi kharida. Kismat azmaein aur pehla token kharidein!
              </p>
              <Link 
                to={`/buy/${activePlanId}`}
                className="inline-flex items-center space-x-3 px-12 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-[2rem] transition-all shadow-2xl shadow-indigo-600/30 uppercase tracking-widest text-xs active:scale-95"
              >
                <Ticket size={20} />
                <span>Buy {selectedPlan?.name} Now</span>
              </Link>
           </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {filteredTokens.map((token) => (
            <div key={token.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm group hover:shadow-2xl hover:border-indigo-100 transition-all relative overflow-hidden">
               {/* Background Glow */}
               <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
               
               <div className="flex justify-between items-start mb-8 relative z-10">
                 <div className="text-4xl drop-shadow-sm group-hover:scale-110 transition-transform">
                   {selectedPlan?.icon || '🎫'}
                 </div>
                 <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${
                   token.status === 'WINNER' ? 'bg-emerald-500 text-white animate-bounce' :
                   token.status === 'WAITING' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                 }`}>
                   {token.status.replace('_', ' ')}
                 </div>
               </div>

               <div className="text-center mb-10 relative z-10">
                 <div className="text-5xl font-black text-slate-900 mb-1 tracking-tighter">#{token.number}</div>
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{selectedPlan?.name} Number</div>
               </div>

               <div className="space-y-4 pt-6 border-t border-slate-50 relative z-10">
                 <div className="flex justify-between items-center text-[10px] font-bold">
                    <div className="flex items-center space-x-2 text-slate-400">
                       <Clock size={12} />
                       <span className="uppercase tracking-widest">Purchased</span>
                    </div>
                    <span className="text-slate-900 font-black">{token.purchaseDate.split(',')[0]}</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-bold">
                    <div className="flex items-center space-x-2 text-slate-400">
                       <Calendar size={12} />
                       <span className="uppercase tracking-widest">Draw Date</span>
                    </div>
                    <span className="text-indigo-600 font-black uppercase">{selectedPlan?.drawDay}</span>
                 </div>
               </div>

               {token.status === 'WINNER' && (
                 <button className="w-full mt-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl flex items-center justify-center space-x-2 shadow-xl shadow-emerald-600/20 uppercase tracking-widest text-[10px] transition-all active:scale-95 relative z-10">
                   <Trophy size={16} />
                   <span>Claim Rs {token.prizeAmount || selectedPlan?.prizePerWinner}</span>
                 </button>
               )}
            </div>
          ))}
        </div>
      )}

      {/* Summary Footer Stats */}
      {filteredTokens.length > 0 && (
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[
            { icon: <Hash className="text-indigo-500" />, label: `${selectedPlan?.name} Tokens`, value: filteredTokens.length, sub: "Total Active" },
            { icon: <Trophy className="text-amber-500" />, label: "Total Winnings", value: `Rs ${totalWinnings.toLocaleString()}`, sub: "Life-time Earnings" },
            { icon: <Clock className="text-emerald-500" />, label: "Next Draw", value: selectedPlan?.drawDay, sub: selectedPlan?.drawTime }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center space-x-6 group hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                {stat.icon}
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-400 block uppercase tracking-widest mb-1">{stat.label}</span>
                <span className="text-2xl font-black text-slate-900 leading-none">{stat.value}</span>
                <p className="text-[9px] font-bold text-indigo-400 uppercase mt-2 tracking-widest">{stat.sub}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTokensPage;
