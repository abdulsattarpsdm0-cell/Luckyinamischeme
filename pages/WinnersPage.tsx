import React, { useState, useEffect, useMemo } from 'react';
import { Trophy, Timer, Star, CheckCircle, Ticket, Sparkles } from 'lucide-react';
import { useUser } from '../context/UserContext.ts';

const WinnersPage: React.FC = () => {
  const { lotteryPlans } = useUser();
  const [activeTab, setActiveTab] = useState<string>('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawProgress, setDrawProgress] = useState(0);
  const [winners, setWinners] = useState<number[]>([]);

  // Initialize first tab when plans are loaded
  useEffect(() => {
    if (lotteryPlans.length > 0 && !activeTab) {
      setActiveTab(lotteryPlans[0].id);
    }
  }, [lotteryPlans, activeTab]);

  const selectedPlan = useMemo(() => lotteryPlans.find(p => p.id === activeTab), [lotteryPlans, activeTab]);

  // Simulate a live draw
  const startDraw = () => {
    if (!selectedPlan) return;
    setIsDrawing(true);
    setDrawProgress(0);
    setWinners([]);
    
    let p = 0;
    const interval = setInterval(() => {
      p += 1;
      setDrawProgress(p);
      
      // Gradually add winners as progress bar moves
      if (p % 10 === 0 && winners.length < selectedPlan.totalWinners) {
        setWinners(prev => [...prev, Math.floor(Math.random() * selectedPlan.totalTokens) + 1]);
      }

      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => setIsDrawing(false), 2000);
      }
    }, 40);
  };

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

      {/* Dynamic Tabs based on Lottery Plans */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {lotteryPlans.map((plan) => (
          <button
            key={plan.id}
            onClick={() => {
              setActiveTab(plan.id);
              setWinners([]); // Clear previous results when switching
            }}
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

      {/* Live Draw Simulator Section */}
      {!isDrawing && winners.length === 0 && selectedPlan && (
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
             
             <div className="grid grid-cols-3 gap-4 mb-12">
                <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/5">
                  <span className="block text-3xl font-black">14</span>
                  <span className="text-[10px] uppercase text-indigo-400 font-black tracking-widest">Hours</span>
                </div>
                <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/5">
                  <span className="block text-3xl font-black">45</span>
                  <span className="text-[10px] uppercase text-indigo-400 font-black tracking-widest">Mins</span>
                </div>
                <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/5">
                  <span className="block text-3xl font-black">22</span>
                  <span className="text-[10px] uppercase text-indigo-400 font-black tracking-widest">Secs</span>
                </div>
             </div>
             
             <button 
               onClick={startDraw}
               className="px-12 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-600/30 uppercase tracking-[0.2em] text-sm active:scale-95"
             >
               Start Live Mock Draw
             </button>
           </div>
        </div>
      )}

      {/* Draw Animation */}
      {isDrawing && selectedPlan && (
        <div className="bg-white rounded-[3rem] border border-slate-100 p-12 mb-12 shadow-inner">
           <div className="max-w-xl mx-auto text-center">
             <div className="flex items-center justify-center space-x-3 mb-6">
               <Sparkles className="text-indigo-600 animate-spin" size={24} />
               <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Live {selectedPlan.name} Result</h3>
             </div>
             <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden mb-12 shadow-inner border border-slate-50">
               <div className="h-full bg-indigo-600 transition-all duration-300 shadow-[0_0_20px_rgba(79,70,229,0.5)]" style={{ width: `${drawProgress}%` }}></div>
             </div>

             <div className="grid grid-cols-5 gap-4">
               {winners.map((w, i) => (
                 <div key={i} className="aspect-square bg-indigo-50 border-2 border-indigo-600 rounded-2xl flex items-center justify-center animate-in zoom-in duration-500 shadow-lg shadow-indigo-100">
                   <span className="text-xl font-black text-indigo-700">#{w}</span>
                 </div>
               ))}
               {Array.from({ length: Math.min(selectedPlan.totalWinners, 10) - winners.length }).map((_, i) => (
                 <div key={i} className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center">
                   <div className="w-2 h-2 bg-indigo-200 rounded-full animate-ping"></div>
                 </div>
               ))}
             </div>
           </div>
        </div>
      )}

      {/* Final Results Display */}
      {!isDrawing && winners.length > 0 && selectedPlan && (
        <div className="space-y-10">
          <div className="flex items-center space-x-4 border-b border-slate-100 pb-6">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shadow-inner">
               <Trophy size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 uppercase">{selectedPlan.name} Winners List</h2>
              <p className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em] mt-1">Official Selection Result</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {winners.map((num, i) => (
              <div key={i} className="group bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm text-center transform hover:-translate-y-2 transition-all hover:shadow-2xl">
                <div className="relative mb-6">
                   <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center mx-auto text-amber-500 group-hover:scale-110 group-hover:bg-amber-50 transition-all shadow-inner">
                     <Star fill="currentColor" size={32} />
                   </div>
                   <div className="absolute -top-2 -right-2 w-8 h-8 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black text-xs shadow-lg">#{i+1}</div>
                </div>
                <div className="text-[10px] font-black text-emerald-600 mb-1 uppercase tracking-[0.2em]">Winner Rank</div>
                <div className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">#{num}</div>
                <div className="bg-slate-900 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-200">
                  Prize: Rs {selectedPlan.prizePerWinner.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
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