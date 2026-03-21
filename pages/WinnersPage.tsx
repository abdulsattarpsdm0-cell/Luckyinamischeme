import React, { useState, useEffect, useMemo } from 'react';
import { Trophy, Timer, Star, CheckCircle, Ticket, Sparkles, CalendarDays } from 'lucide-react';
import { useUser } from '../context/UserContext.ts';

const WinnersPage: React.FC = () => {
  const { lotteryPlans, draws } = useUser();
  const [activeCycle, setActiveCycle] = useState<'WEEKLY' | 'MONTHLY'>('WEEKLY');
  const [activeTab, setActiveTab] = useState<string>('');
  const [latestDrawId, setLatestDrawId] = useState<string>('');

  // Auto-switch to the most recent draw's plan and cycle when a new draw comes in
  useEffect(() => {
    if (draws.length > 0) {
      const mostRecentDraw = draws[0];
      if (mostRecentDraw.id !== latestDrawId) {
        setLatestDrawId(mostRecentDraw.id);
        const plan = lotteryPlans.find(p => p.id === mostRecentDraw.planId);
        if (plan) {
          setActiveCycle(plan.drawCycle);
          setActiveTab(mostRecentDraw.planId);
        }
      }
    }
  }, [draws, latestDrawId, lotteryPlans]);

  // Filter plans by active cycle
  const filteredPlans = useMemo(() => {
    return lotteryPlans.filter(p => p.drawCycle === activeCycle);
  }, [lotteryPlans, activeCycle]);

  // Initialize first tab when plans or cycle changes
  useEffect(() => {
    if (filteredPlans.length > 0 && (!activeTab || !filteredPlans.find(p => p.id === activeTab))) {
      setActiveTab(filteredPlans[0].id);
    }
  }, [filteredPlans, activeTab]);

  const selectedPlan = useMemo(() => lotteryPlans.find(p => p.id === activeTab), [lotteryPlans, activeTab]);
  
  // Get all draws for the selected plan
  const planDraws = useMemo(() => {
    return draws.filter(d => d.planId === activeTab);
  }, [draws, activeTab]);

  if (lotteryPlans.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Trophy size={64} className="mx-auto text-slate-200 mb-6" />
        <h2 className="text-2xl font-black text-slate-900 uppercase">No Active Lotteries</h2>
        <p className="text-slate-500 mt-2">Check back later for upcoming draws!</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in duration-500">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight uppercase">Lottery Winners</h1>
        <p className="text-slate-500 text-lg font-medium italic">"Aapki qismat bhi yahan khul sakti hai!"</p>
      </div>

      {/* Cycle Tabs (Weekly / Monthly) */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setActiveCycle('WEEKLY')}
          className={`px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest transition-all shadow-sm ${
            activeCycle === 'WEEKLY'
              ? 'bg-slate-900 text-white shadow-slate-300 shadow-xl scale-105'
              : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          Weekly Winners
        </button>
        <button
          onClick={() => setActiveCycle('MONTHLY')}
          className={`px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest transition-all shadow-sm ${
            activeCycle === 'MONTHLY'
              ? 'bg-slate-900 text-white shadow-slate-300 shadow-xl scale-105'
              : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          Monthly Winners
        </button>
      </div>

      {/* Dynamic Tabs based on Lottery Plans */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {filteredPlans.map((plan) => (
          <button
            key={plan.id}
            onClick={() => setActiveTab(plan.id)}
            className={`px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-sm flex items-center space-x-2 ${
              activeTab === plan.id 
                ? 'bg-indigo-600 text-white shadow-indigo-200 shadow-xl scale-105' 
                : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'
            }`}
          >
            <span>{plan.icon}</span>
            <span>{plan.name}</span>
          </button>
        ))}
      </div>

      {/* Waiting for Draw Section */}
      {planDraws.length === 0 && selectedPlan && (
        <div className="bg-slate-900 rounded-[3rem] p-12 text-center text-white relative overflow-hidden mb-12 shadow-2xl">
           <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
           <div className="relative z-10 max-w-2xl mx-auto">
             <div className="flex justify-center mb-8">
               <div className="w-24 h-24 bg-indigo-500/20 rounded-full flex items-center justify-center animate-pulse">
                 <Timer size={48} className="text-indigo-400" />
               </div>
             </div>
             <h2 className="text-3xl md:text-4xl font-black mb-4 uppercase tracking-tight">Next {selectedPlan.name} Draw</h2>
             <p className="text-indigo-200/60 mb-10 leading-relaxed font-medium uppercase tracking-widest text-xs">
               Draw starts every {selectedPlan.drawTime}. Apne tokens check karein!
             </p>
             
             <div className="inline-flex items-center space-x-3 px-8 py-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                <CalendarDays size={20} className="text-indigo-400" />
                <span className="text-sm font-black uppercase tracking-widest">Awaiting Results</span>
             </div>
           </div>
        </div>
      )}

      {/* Final Results Display */}
      {planDraws.length > 0 && selectedPlan && (
        <div className="space-y-16">
          {planDraws.map((draw, drawIndex) => (
            <div key={draw.id} className="space-y-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-6 gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shadow-inner">
                     <Trophy size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase">{selectedPlan.name} Winners List</h2>
                    <p className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em] mt-1">
                      {drawIndex === 0 ? 'Latest Draw Result' : 'Past Draw Result'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Draw Date</span>
                  <span className="text-sm font-black text-slate-900">{new Date(draw.date).toLocaleDateString()} {new Date(draw.date).toLocaleTimeString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                {draw.winningNumbers.map((num, i) => {
                  const winnerInfo = draw.winners.find(w => Number(w.number) === Number(num));
                  return (
                    <div key={i} className="group bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm text-center transform hover:-translate-y-2 transition-all hover:shadow-2xl relative overflow-hidden">
                      {winnerInfo && (
                        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                      )}
                      <div className="relative mb-6">
                         <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center mx-auto transition-all shadow-inner ${winnerInfo ? 'bg-amber-100 text-amber-600 group-hover:scale-110 group-hover:bg-amber-200' : 'bg-slate-50 text-slate-400'}`}>
                           <Star fill="currentColor" size={32} />
                         </div>
                         <div className="absolute -top-2 -right-2 w-8 h-8 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black text-xs shadow-lg">#{i+1}</div>
                      </div>
                      <div className="text-[10px] font-black text-emerald-600 mb-1 uppercase tracking-[0.2em]">Winning Number</div>
                      <div className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">#{num}</div>
                      
                      {winnerInfo ? (
                        <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 py-3 px-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm flex flex-col gap-1">
                          <span>Winner: {winnerInfo.username || 'Anonymous'}</span>
                          <span className="text-emerald-900">Prize: Rs {(winnerInfo.prize || 0).toLocaleString()}</span>
                        </div>
                      ) : (
                        <div className="bg-slate-50 border border-slate-100 text-slate-500 py-3 px-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm">
                          Unsold Ticket
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Informational Footer */}
      <div className="mt-20 text-center p-12 bg-white rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <Trophy size={48} className="text-indigo-600 mx-auto mb-6 relative z-10" />
        <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight relative z-10">Fair Draw Transparency</h3>
        <p className="text-slate-500 max-w-xl mx-auto leading-relaxed font-medium relative z-10">
          Lucky Inami Scheme ensures every draw is conducted with 100% transparency. Our automated random selection system guarantees a fair chance for every single token holder.
        </p>
        <div className="mt-8 flex justify-center space-x-6 relative z-10">
           <div className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-200 pr-6">
              <CheckCircle size={14} className="text-emerald-500" />
              <span>Verified Draw</span>
           </div>
           <div className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <Ticket size={14} className="text-indigo-500" />
              <span>Secure Tokens</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default WinnersPage;