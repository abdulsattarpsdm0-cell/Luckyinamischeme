
import React, { useState } from 'react';
import { Trophy, Star, Target, ShieldCheck, History, AlertCircle, XCircle, CheckCircle2, Play, Sparkles, X } from 'lucide-react';
import { useUser } from '../../context/UserContext.ts';

const AdminWinner: React.FC = () => {
  const { lotteryPlans, tokens: allTokens } = useUser();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [drawMethod, setDrawMethod] = useState<'MANUAL' | 'RANDOM'>('MANUAL');
  const [winnersInputs, setWinnersInputs] = useState<string[]>(Array(10).fill(''));

  const handleDraw = () => {
    alert(`Draw for ${activeCategory} conducted successfully!`);
    setActiveCategory(null);
    setWinnersInputs(Array(10).fill(''));
  };

  const selectedPlan = lotteryPlans.find(p => p.id === activeCategory);

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">Winner Draws</h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium italic">"Luck starts here - Live draw management."</p>
        </div>
        <button className="flex items-center space-x-2 bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100 text-[10px] font-black uppercase tracking-widest text-indigo-600">
          <History size={16} />
          <span>Past Draws</span>
        </button>
      </div>

      {/* Adaptive Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        {lotteryPlans.map((plan) => {
          const soldCount = allTokens.filter(t => t.planId === plan.id).length;
          return (
            <button 
              key={plan.id}
              onClick={() => setActiveCategory(plan.id)}
              className="bg-white rounded-[2rem] p-6 md:p-10 border border-slate-100 text-left relative overflow-hidden group transition-all hover:shadow-xl active:scale-[0.98]"
            >
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-4xl group-hover:scale-110 transition-transform">{plan.icon}</span>
                  <div className="bg-slate-50 px-2 py-1 rounded-lg text-[8px] font-black text-slate-400 uppercase border border-slate-100">
                    ID: {plan.id.slice(0, 5)}
                  </div>
                </div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight truncate">{plan.name}</h3>
                <div className="flex space-x-4 mt-6">
                  <div>
                    <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">Sold</span>
                    <span className="text-sm font-black text-slate-900">{soldCount}</span>
                  </div>
                  <div className="w-px bg-slate-100 h-6 mt-1"></div>
                  <div>
                    <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">Prize</span>
                    <span className="text-sm font-black text-emerald-600">Rs {plan.prizePerWinner.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-6 right-6 w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 shadow-lg">
                <Play size={20} fill="white" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Responsive Winner Modal */}
      {activeCategory && selectedPlan && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 bg-slate-900/90 backdrop-blur-md">
           <div className="bg-white w-full max-w-3xl md:rounded-[3rem] rounded-t-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[95vh] flex flex-col">
              {/* Header */}
              <div className="p-6 md:p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                 <div className="flex items-center space-x-4 md:space-x-6">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-2xl md:text-3xl shadow-xl">
                      {selectedPlan.icon}
                    </div>
                    <div>
                      <h3 className="text-lg md:text-2xl font-black text-slate-900 uppercase tracking-tight">Draw: {selectedPlan.name}</h3>
                      <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1">Announcing {selectedPlan.totalWinners} Winners</p>
                    </div>
                 </div>
                 <button onClick={() => setActiveCategory(null)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-all">
                   <X size={24} />
                 </button>
              </div>

              {/* Scrollable Body */}
              <div className="flex-grow overflow-y-auto p-6 md:p-10 space-y-8">
                 <div className="space-y-3">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block px-1">1. Choose Drawing Method</label>
                    <div className="grid grid-cols-2 gap-3">
                       <button onClick={() => setDrawMethod('MANUAL')} className={`p-4 md:p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${drawMethod === 'MANUAL' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 text-slate-400'}`}>
                          <Target size={20} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Manual</span>
                       </button>
                       <button onClick={() => setDrawMethod('RANDOM')} className={`p-4 md:p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${drawMethod === 'RANDOM' ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-slate-100 text-slate-400'}`}>
                          <Sparkles size={20} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Random</span>
                       </button>
                    </div>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block px-1">2. Identify Winning Numbers</label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                       {Array.from({ length: Math.min(selectedPlan.totalWinners, 10) }).map((_, i) => (
                         <div key={i} className="relative">
                            <span className="absolute -top-2 -left-2 w-5 h-5 bg-slate-900 text-white rounded-md text-[8px] font-black flex items-center justify-center z-10 border border-white">#{i+1}</span>
                            <input 
                              type="text" 
                              placeholder="---"
                              value={drawMethod === 'RANDOM' ? Math.floor(Math.random() * selectedPlan.totalTokens) + 1 : winnersInputs[i]}
                              onChange={(e) => {
                                const newVal = [...winnersInputs];
                                newVal[i] = e.target.value;
                                setWinnersInputs(newVal);
                              }}
                              readOnly={drawMethod === 'RANDOM'}
                              className="w-full h-12 md:h-16 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-indigo-600 text-center font-black text-lg"
                            />
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start space-x-3">
                    <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={16} />
                    <p className="text-[10px] text-amber-800 leading-relaxed font-bold uppercase tracking-tight">Winners will be announced platform-wide immediately upon confirmation.</p>
                 </div>

                 <button 
                  onClick={handleDraw}
                  className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl shadow-xl uppercase tracking-widest text-xs active:scale-95 flex items-center justify-center space-x-3"
                 >
                    <Trophy size={18} />
                    <span>Announce Winners Now</span>
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminWinner;
