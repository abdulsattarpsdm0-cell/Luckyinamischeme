
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext.ts';
import { Trophy, Ticket, CalendarDays, Clock, ChevronRight, Zap, Hash, Users } from 'lucide-react';

const LotteriesPage: React.FC = () => {
  const { lotteryPlans, tokens } = useUser();
  const [activeCycle, setActiveCycle] = useState<'WEEKLY' | 'MONTHLY'>('WEEKLY');

  // ONLY SHOW ACTIVE PLANS ON USER FRONTEND
  const filteredPlans = useMemo(() => {
    return lotteryPlans.filter(p => p.drawCycle === activeCycle && p.isActive);
  }, [lotteryPlans, activeCycle]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-in fade-in duration-500">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 md:mb-16 space-y-6 md:space-y-0">
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-black text-[#1a233a] uppercase tracking-tight leading-none mb-2">Live Lotteries</h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium italic">"Apni pasand ka plan select karein aur kismat azmaein!"</p>
        </div>
        
        {/* Horizontal Scrolling Tabs on Mobile */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl md:rounded-[2rem] border border-slate-200 shadow-sm w-full md:w-auto overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveCycle('WEEKLY')}
            className={`flex-1 md:flex-none md:px-10 py-3 rounded-xl md:rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center space-x-2 whitespace-nowrap ${
              activeCycle === 'WEEKLY' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white/50'
            }`}
          >
            <Zap size={14} />
            <span>Weekly Plans</span>
          </button>
          <button
            onClick={() => setActiveCycle('MONTHLY')}
            className={`flex-1 md:flex-none md:px-10 py-3 rounded-xl md:rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center space-x-2 whitespace-nowrap ${
              activeCycle === 'MONTHLY' ? 'bg-pink-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white/50'
            }`}
          >
            <CalendarDays size={14} />
            <span>Monthly Plans</span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
        {filteredPlans.map((plan) => {
          const soldCount = tokens.filter(t => t.planId === plan.id).length;
          const percentage = Math.round((soldCount / plan.totalTokens) * 100);

          return (
            <div key={plan.id} className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-xl group relative">
              
              {/* Plan Image */}
              <div className="relative h-48 md:h-64 overflow-hidden bg-slate-100">
                 {plan.image ? (
                   <img src={plan.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={plan.name} />
                 ) : (
                   <div className="absolute inset-0 flex items-center justify-center text-6xl md:text-7xl bg-gradient-to-br from-indigo-50 to-slate-200">
                      {plan.icon}
                   </div>
                 )}
                 <div className={`absolute top-4 right-4 px-4 py-1.5 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest text-white shadow-lg z-10 ${plan.drawCycle === 'WEEKLY' ? 'bg-indigo-600' : 'bg-pink-600'}`}>
                    {plan.drawCycle} DRAW
                 </div>
                 
                 {/* CLEAR TOKEN COUNT BADGE */}
                 <div className="absolute bottom-4 left-4 px-4 py-2 rounded-2xl bg-white/90 backdrop-blur-md text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-900 shadow-xl border border-white z-10">
                    Total {plan.totalTokens.toLocaleString()} Tokens
                 </div>
                 
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40"></div>
              </div>

              {/* Content Body */}
              <div className="p-6 md:p-10 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-6 md:mb-8">
                   <div>
                      <h3 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight leading-none mb-1">{plan.name}</h3>
                      <span className="text-[9px] md:text-[10px] font-black text-indigo-600 uppercase tracking-widest">Entry: Rs {plan.tokenPrice}</span>
                   </div>
                   <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 rounded-xl flex items-center justify-center text-amber-500 shadow-inner">
                      <Trophy size={20} />
                   </div>
                </div>

                {/* Prize Box */}
                <div className="bg-indigo-600 rounded-2xl md:rounded-[2rem] p-4 md:p-6 mb-6 md:mb-8 text-white flex items-center justify-between shadow-lg shadow-indigo-100">
                   <div>
                      <span className="block text-[8px] md:text-[9px] font-black text-indigo-200 uppercase tracking-widest mb-1">Inami Item</span>
                      <span className="text-lg md:text-xl font-black">{plan.prizeName || `Rs ${plan.prizePerWinner.toLocaleString()}`}</span>
                   </div>
                   <div className="bg-white/20 p-2 rounded-lg">
                     <Zap size={18} className="text-white" />
                   </div>
                </div>

                {/* DYNAMIC PROGRESS SECTION */}
                <div className="mb-8 space-y-3">
                   <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Users size={14} className="text-indigo-400" />
                        Availability
                      </span>
                      <span className={`text-[11px] font-black uppercase tracking-widest ${percentage > 85 ? 'text-red-600' : 'text-indigo-600'}`}>
                        {percentage}% Sold
                      </span>
                   </div>
                   <div className="w-full h-3 bg-slate-50 rounded-full overflow-hidden p-0.5 border border-slate-100 shadow-inner">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 shadow-sm ${percentage > 85 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                        style={{ width: `${percentage}%` }}
                      ></div>
                   </div>
                   <p className="text-[9px] font-bold text-slate-400 text-center uppercase tracking-widest">
                     {soldCount} Booked / {plan.totalTokens - soldCount} Available
                   </p>
                </div>

                {/* Detail List */}
                <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                  <div className="flex justify-between items-center text-[10px] md:text-xs font-bold text-slate-500">
                    <div className="flex items-center space-x-2">
                       <Clock size={14} className="text-indigo-400" />
                       <span className="uppercase tracking-widest text-[8px] md:text-[9px]">Schedule</span>
                    </div>
                    <span className="text-slate-900 font-black text-right">{plan.drawTime}</span>
                  </div>
                  
                  {/* CLEAR TOKEN COUNT ROW */}
                  <div className="flex justify-between items-center text-[10px] md:text-xs font-bold text-slate-500 pt-3 md:pt-4 border-t border-slate-50">
                    <div className="flex items-center space-x-2">
                       <Hash size={14} className="text-emerald-500" />
                       <span className="uppercase tracking-widest text-[8px] md:text-[9px]">Total Numbers</span>
                    </div>
                    <span className="text-slate-900 font-black">{plan.totalTokens.toLocaleString()} Spots</span>
                  </div>

                  <div className="flex justify-between items-center text-[10px] md:text-xs font-bold text-slate-500 pt-3 md:pt-4 border-t border-slate-50">
                    <div className="flex items-center space-x-2">
                       <CalendarDays size={14} className="text-amber-500" />
                       <span className="uppercase tracking-widest text-[8px] md:text-[9px]">Winners</span>
                    </div>
                    <span className="text-slate-900 font-black">{plan.totalWinners} Spots</span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-auto">
                  <Link
                    to={`/buy/${plan.id}`}
                    className="w-full py-4 md:py-5 bg-[#1a233a] hover:bg-indigo-600 text-white rounded-2xl md:rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center space-x-3 transition-all active:scale-95 shadow-lg"
                  >
                    <Ticket size={18} />
                    <span>Open Lottery</span>
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {filteredPlans.length === 0 && (
          <div className="col-span-full py-16 md:py-24 bg-slate-50 rounded-[2.5rem] md:rounded-[4rem] border border-dashed border-slate-200 text-center flex flex-col items-center">
             <CalendarDays size={48} className="text-slate-200 mb-6" />
             <h4 className="text-slate-900 font-black uppercase text-lg md:text-xl mb-2">No Plans Available</h4>
             <p className="text-slate-400 text-xs md:text-sm font-medium max-w-sm px-6">Filhal is category mein koi active lottery nahi hai. Jald hi naye events start honge!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LotteriesPage;
