
import React, { useState, useMemo } from 'react';
import { 
  ClipboardList, 
  Ticket, 
  Search, 
  Clock, 
  LayoutGrid, 
  List, 
  ChevronRight,
  Zap,
  Calendar,
  Trophy,
  ArrowRight
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { LotteryPlan, Token } from '../../types';

const AdminSoldTokens: React.FC = () => {
  const { tokens, lotteryPlans } = useUser();
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'TABLE' | 'GRID'>('TABLE');

  // Group Plans by Cycle
  const weeklyPlans = useMemo(() => lotteryPlans.filter(p => p.drawCycle === 'WEEKLY'), [lotteryPlans]);
  const monthlyPlans = useMemo(() => lotteryPlans.filter(p => p.drawCycle === 'MONTHLY'), [lotteryPlans]);

  // Filter Tokens by Search
  const filteredTokens = useMemo(() => {
    return tokens.filter(t => {
      const plan = lotteryPlans.find(p => p.id === t.planId);
      const planName = plan?.name.toLowerCase() || '';
      return t.number.toString().includes(search) || planName.includes(search.toLowerCase());
    });
  }, [tokens, search, lotteryPlans]);

  // Group Tokens for UI Sections
  const weeklyTokens = useMemo(() => 
    filteredTokens.filter(t => weeklyPlans.some(p => p.id === t.planId)),
  [filteredTokens, weeklyPlans]);

  const monthlyTokens = useMemo(() => 
    filteredTokens.filter(t => monthlyPlans.some(p => p.id === t.planId)),
  [filteredTokens, monthlyPlans]);

  // Section Component for better organization
  const TokenSection = ({ title, icon, tokensList, plansList, colorClass }: { 
    title: string, 
    icon: React.ReactNode, 
    tokensList: Token[], 
    plansList: LotteryPlan[],
    colorClass: string 
  }) => (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 ${colorClass} text-white rounded-xl flex items-center justify-center shadow-lg`}>
            {icon}
          </div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{title}</h2>
          <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
            {tokensList.length} Sold
          </span>
        </div>
      </div>

      {/* Individual Plan Mini-Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4">
        {plansList.map(plan => {
          const count = tokens.filter(t => t.planId === plan.id).length;
          return (
            <div key={plan.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center group hover:border-indigo-200 transition-all">
               <span className="text-xl mb-1 group-hover:scale-110 transition-transform">{plan.icon}</span>
               <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter truncate w-full">{plan.name}</span>
               <span className="text-lg font-black text-slate-900 leading-none mt-1">{count}</span>
            </div>
          );
        })}
      </div>

      {tokensList.length === 0 ? (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] p-10 text-center">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No tokens sold in this category yet</p>
        </div>
      ) : (
        <div className={`bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden ${viewMode === 'TABLE' ? 'overflow-x-auto' : ''}`}>
           {viewMode === 'TABLE' ? (
             <table className="w-full text-left min-w-[700px]">
               <thead>
                 <tr className="bg-slate-50/50 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                   <th className="py-4 px-8">Ticket #</th>
                   <th className="py-4 px-6">Plan Name</th>
                   <th className="py-4 px-6">Date Purchased</th>
                   <th className="py-4 px-6">Price</th>
                   <th className="py-4 px-8 text-right">Status</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                 {tokensList.map(token => {
                   const plan = plansList.find(p => p.id === token.planId);
                   return (
                     <tr key={token.id} className="hover:bg-slate-50/30 transition-colors">
                       <td className="py-4 px-8">
                         <div className="w-10 h-10 bg-indigo-50 text-indigo-700 rounded-lg flex items-center justify-center font-black text-sm border border-indigo-100">
                           {token.number}
                         </div>
                       </td>
                       <td className="py-4 px-6">
                         <div className="flex items-center space-x-2">
                            <span>{plan?.icon}</span>
                            <span className="font-black text-slate-900 text-xs uppercase">{plan?.name}</span>
                         </div>
                       </td>
                       <td className="py-4 px-6">
                         <div className="flex flex-col text-[10px] font-bold text-slate-500 uppercase">
                            <span>{token.purchaseDate.split(',')[0]}</span>
                            <span className="text-slate-300 text-[8px]">{token.purchaseDate.split(',')[1]}</span>
                         </div>
                       </td>
                       <td className="py-4 px-6 font-black text-slate-900 text-xs">Rs {plan?.tokenPrice}</td>
                       <td className="py-4 px-8 text-right">
                          <span className={`px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter ${
                            token.status === 'WINNER' ? 'bg-emerald-500 text-white' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {token.status}
                          </span>
                       </td>
                     </tr>
                   );
                 })}
               </tbody>
             </table>
           ) : (
             <div className="p-6 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {tokensList.map(token => {
                  const plan = plansList.find(p => p.id === token.planId);
                  return (
                    <div key={token.id} className="bg-slate-50 p-4 rounded-xl text-center border border-slate-200/50 hover:bg-white hover:shadow-md transition-all">
                       <div className="text-lg mb-1">{plan?.icon}</div>
                       <div className="text-xl font-black text-slate-900">#{token.number}</div>
                       <div className="text-[7px] font-black text-indigo-600 uppercase tracking-tighter truncate">{plan?.name}</div>
                    </div>
                  );
                })}
             </div>
           )}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      
      {/* HEADER & GLOBAL STATS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Sold Tokens Monitor</h1>
          <p className="text-slate-500 font-medium">Categorized view of all active sales across Weekly and Monthly draws.</p>
        </div>
        
        <div className="flex items-center space-x-4 w-full md:w-auto">
           <div className="relative flex-grow md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input 
                type="text" 
                placeholder="Search ticket #..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-600/10"
              />
           </div>
           <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
             <button onClick={() => setViewMode('TABLE')} className={`p-2 rounded-lg transition-all ${viewMode === 'TABLE' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}><List size={18}/></button>
             <button onClick={() => setViewMode('GRID')} className={`p-2 rounded-lg transition-all ${viewMode === 'GRID' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}><LayoutGrid size={18}/></button>
           </div>
        </div>
      </div>

      {/* OVERALL SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-900 p-6 rounded-[2.5rem] text-white flex items-center space-x-5 shadow-2xl relative overflow-hidden">
           <div className="bg-white/10 w-12 h-12 rounded-2xl flex items-center justify-center"><ClipboardList size={22}/></div>
           <div>
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Sales</span>
              <span className="text-3xl font-black">{tokens.length}</span>
           </div>
           <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        </div>
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center space-x-5">
           <div className="bg-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg"><Zap size={22}/></div>
           <div>
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Weekly Sales</span>
              <span className="text-3xl font-black text-slate-900">{weeklyTokens.length}</span>
           </div>
        </div>
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center space-x-5">
           <div className="bg-pink-600 w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg"><Calendar size={22}/></div>
           <div>
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Monthly Sales</span>
              <span className="text-3xl font-black text-slate-900">{monthlyTokens.length}</span>
           </div>
        </div>
      </div>

      {/* 1. WEEKLY SECTION */}
      <TokenSection 
        title="Weekly Draw Sales" 
        icon={<Zap size={20} />} 
        tokensList={weeklyTokens} 
        plansList={weeklyPlans}
        colorClass="bg-indigo-600"
      />

      {/* 2. MONTHLY SECTION */}
      <TokenSection 
        title="Monthly Draw Sales" 
        icon={<Calendar size={20} />} 
        tokensList={monthlyTokens} 
        plansList={monthlyPlans}
        colorClass="bg-pink-600"
      />

      {/* FOOTER INFO */}
      <div className="bg-indigo-50 border border-indigo-100 p-8 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm"><Trophy size={24}/></div>
            <div>
               <h4 className="font-black text-indigo-900 uppercase tracking-tight leading-none mb-1">Revenue Tracking</h4>
               <p className="text-xs text-indigo-700/60 font-medium">Verify your bank accounts or wallets for the incoming funds from these tokens.</p>
            </div>
         </div>
         <button className="px-8 py-4 bg-white text-indigo-600 font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-600/5 hover:bg-indigo-600 hover:text-white transition-all flex items-center space-x-2">
            <span>View Full Ledger</span>
            <ArrowRight size={14} />
         </button>
      </div>

    </div>
  );
};

export default AdminSoldTokens;
