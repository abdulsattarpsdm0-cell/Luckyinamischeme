
import React, { useState } from 'react';
import { Trophy, Star, Target, ShieldCheck, History, AlertCircle, XCircle, CheckCircle2, Play, Sparkles } from 'lucide-react';

const AdminWinner: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'SILVER' | 'GOLD' | 'PLATINUM' | null>(null);
  const [drawMethod, setDrawMethod] = useState<'MANUAL' | 'RANDOM'>('MANUAL');
  const [tokens, setTokens] = useState<string[]>(Array(10).fill(''));

  const categories = [
    { id: 'SILVER', title: 'Silver Category', icon: '🥈', color: 'from-slate-400 to-slate-600', count: 1250, winners: 120 },
    { id: 'GOLD', title: 'Gold Category', icon: '🥇', color: 'from-amber-400 to-amber-600', count: 840, winners: 80 },
    { id: 'PLATINUM', title: 'Platinum Category', icon: '💎', color: 'from-cyan-400 to-cyan-600', count: 420, winners: 40 },
  ];

  const handleDraw = () => {
    alert("Draw conducted successfully! Winners have been notified.");
    setActiveCategory(null);
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Winner Management</h1>
          <p className="text-slate-500 font-medium">Conduct live draws and manage winner categories.</p>
        </div>
        <div className="flex items-center space-x-2 bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100 text-xs font-black uppercase tracking-widest text-indigo-600">
          <History size={16} />
          <span>View Past Draws</span>
        </div>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <button 
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as any)}
            className={`bg-gradient-to-br ${cat.color} rounded-[3rem] p-10 text-white text-left relative overflow-hidden group transition-all hover:scale-[1.02] shadow-2xl active:scale-95`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-colors"></div>
            <div className="relative z-10">
              <span className="text-5xl mb-6 block drop-shadow-lg">{cat.icon}</span>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-2">{cat.title}</h3>
              <div className="flex space-x-4 mt-6">
                <div>
                  <span className="block text-[9px] font-black text-white/60 uppercase tracking-widest mb-1">Total Tokens</span>
                  <span className="text-lg font-black">{cat.count.toLocaleString()}</span>
                </div>
                <div className="w-px bg-white/20 h-8 mt-2"></div>
                <div>
                  <span className="block text-[9px] font-black text-white/60 uppercase tracking-widest mb-1">Total Winners</span>
                  <span className="text-lg font-black">{cat.winners}</span>
                </div>
              </div>
            </div>
            <div className="absolute bottom-8 right-8 w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Play size={24} fill="white" />
            </div>
          </button>
        ))}
      </div>

      {/* Stats Summary Section */}
      <section className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-10">
         <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center">
               <Trophy size={40} />
            </div>
            <div>
               <h3 className="text-2xl font-black text-slate-900 uppercase">Current Cycle Stats</h3>
               <p className="text-sm text-slate-500 font-medium">Draw results from the last 30 days.</p>
            </div>
         </div>
         <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            <div className="text-center">
               <span className="block text-3xl font-black text-slate-900">240</span>
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Winners</span>
            </div>
            <div className="text-center">
               <span className="block text-3xl font-black text-emerald-600">98%</span>
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Prize Paid</span>
            </div>
            <div className="text-center">
               <span className="block text-3xl font-black text-slate-900">PKR 1.2M</span>
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Prize Distributed</span>
            </div>
         </div>
      </section>

      {/* Winner Draw Modal Overlay */}
      {activeCategory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-xl">
           <div className="bg-white w-full max-w-4xl rounded-[3rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-20 duration-500 flex flex-col max-h-[95vh]">
              {/* Header */}
              <div className="p-8 md:p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                 <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 bg-slate-900 text-white rounded-[1.5rem] flex items-center justify-center text-3xl shadow-xl">
                      {categories.find(c => c.id === activeCategory)?.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">{activeCategory} Category Draw</h3>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-2">Announce 10 winners for this weekend</p>
                    </div>
                 </div>
                 <button onClick={() => setActiveCategory(null)} className="p-3 text-slate-400 hover:bg-slate-100 rounded-2xl transition-all">
                   <XCircle size={28} />
                 </button>
              </div>

              {/* Body */}
              <div className="flex-grow overflow-y-auto p-8 md:p-12 space-y-10">
                 {/* Selection Method */}
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] px-1 block">1. Select Drawing Method</label>
                    <div className="grid grid-cols-2 gap-4">
                       <button 
                        onClick={() => setDrawMethod('MANUAL')}
                        className={`p-6 rounded-[2rem] border-2 font-black transition-all flex items-center space-x-4 ${
                          drawMethod === 'MANUAL' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 text-slate-400 grayscale'
                        }`}
                       >
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${drawMethod === 'MANUAL' ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}>
                             <Target size={20} />
                          </div>
                          <div className="text-left">
                             <p className="text-sm uppercase tracking-wider">Manual Entry</p>
                             <p className="text-[9px] font-bold text-slate-400 uppercase">Input tokens manually</p>
                          </div>
                       </button>
                       <button 
                        onClick={() => setDrawMethod('RANDOM')}
                        className={`p-6 rounded-[2rem] border-2 font-black transition-all flex items-center space-x-4 ${
                          drawMethod === 'RANDOM' ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-slate-100 text-slate-400 grayscale'
                        }`}
                       >
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${drawMethod === 'RANDOM' ? 'bg-emerald-600 text-white' : 'bg-slate-100'}`}>
                             <Sparkles size={20} />
                          </div>
                          <div className="text-left">
                             <p className="text-sm uppercase tracking-wider">Random Selection</p>
                             <p className="text-[9px] font-bold text-slate-400 uppercase">Auto-pick random winners</p>
                          </div>
                       </button>
                    </div>
                 </div>

                 {/* Token Entry Grid */}
                 <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] block">2. Identify Winning Tokens</label>
                       {drawMethod === 'RANDOM' && (
                         <button className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline animate-pulse">Generate 10 New Numbers</button>
                       )}
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                       {tokens.map((token, i) => (
                         <div key={i} className="relative group">
                            <span className="absolute -top-2 -left-2 w-6 h-6 bg-slate-900 text-white rounded-lg text-[10px] font-black flex items-center justify-center z-10 border-2 border-white shadow-lg">#{i+1}</span>
                            <input 
                              type="text" 
                              placeholder="000"
                              value={drawMethod === 'RANDOM' ? Math.floor(Math.random() * 200) + 1 : token}
                              readOnly={drawMethod === 'RANDOM'}
                              className="w-full h-16 px-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-600 focus:bg-white text-center font-black text-xl transition-all"
                            />
                            {token && <CheckCircle2 size={14} className="absolute bottom-2 right-2 text-emerald-500" />}
                         </div>
                       ))}
                    </div>
                 </div>

                 {/* Confirmation Notice */}
                 <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex items-start space-x-4">
                    <AlertCircle className="text-amber-600 flex-shrink-0 mt-1" size={20} />
                    <div>
                       <h5 className="text-sm font-black text-amber-900 uppercase tracking-tight mb-1">Critical Action Warning</h5>
                       <p className="text-xs text-amber-700 leading-relaxed">By clicking the button below, these 10 users will be officially announced as winners. This action will trigger notifications and prize allocations across the entire platform. <span className="font-bold underline">Ensure all numbers are verified.</span></p>
                    </div>
                 </div>

                 <button 
                  onClick={handleDraw}
                  className="w-full py-6 bg-[#1a233a] hover:bg-slate-800 text-white font-black rounded-3xl shadow-2xl shadow-slate-900/30 transition-all uppercase tracking-[0.25em] text-sm active:scale-95 flex items-center justify-center space-x-4 group"
                 >
                    <Target size={20} className="group-hover:rotate-45 transition-transform" />
                    <span>Conduct Draw & Announce Winners</span>
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminWinner;
