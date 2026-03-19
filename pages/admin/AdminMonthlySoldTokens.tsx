import React, { useState, useMemo } from 'react';
import { 
  ClipboardList, 
  Search, 
  LayoutGrid, 
  List, 
  Calendar,
  Trophy,
  ArrowRight
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { LotteryPlan, Token } from '../../types';

const AdminMonthlySoldTokens: React.FC = () => {
  const { allTokens: tokens, lotteryPlans } = useUser();
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'TABLE' | 'GRID'>('TABLE');
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  // Group Plans by Cycle
  const monthlyPlans = useMemo(() => lotteryPlans.filter(p => p.drawCycle === 'MONTHLY'), [lotteryPlans]);

  // Filter Tokens by Search and Status
  const filteredTokens = useMemo(() => {
    return tokens.filter(t => {
      if (t.status !== 'WAITING') return false;
      const plan = lotteryPlans.find(p => p.id === t.planId);
      const planName = plan?.name.toLowerCase() || '';
      return t.number.toString().includes(search) || planName.includes(search.toLowerCase());
    });
  }, [tokens, search, lotteryPlans]);

  // Group Tokens for UI Sections
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
          const count = tokensList.filter(t => t.planId === plan.id).length;
          const isSelected = selectedPlanId === plan.id;
          return (
            <button 
              key={plan.id} 
              onClick={() => setSelectedPlanId(isSelected ? null : plan.id)}
              className={`p-4 rounded-2xl border shadow-sm flex flex-col items-center text-center group transition-all ${isSelected ? 'bg-pink-50 border-pink-300' : 'bg-white border-slate-100 hover:border-pink-200'}`}
            >
               <span className="text-xl mb-1 group-hover:scale-110 transition-transform">{plan.icon}</span>
               <span className={`text-[8px] font-black uppercase tracking-tighter truncate w-full ${isSelected ? 'text-pink-700' : 'text-slate-400'}`}>{plan.name}</span>
               <span className={`text-lg font-black leading-none mt-1 ${isSelected ? 'text-pink-900' : 'text-slate-900'}`}>{count}</span>
            </button>
          );
        })}
      </div>

      {tokensList.length === 0 ? (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] p-10 text-center">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No tokens sold in this category yet</p>
        </div>
      ) : (
        <div className="space-y-8">
          {plansList.filter(p => selectedPlanId ? p.id === selectedPlanId : true).map(plan => {
            const planTokens = tokensList.filter(t => t.planId === plan.id);
            if (planTokens.length === 0) return null;

            return (
              <div key={plan.id} className={`bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden ${viewMode === 'TABLE' ? 'overflow-x-auto' : ''}`}>
                <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{plan.icon}</span>
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">{plan.name} Tokens</h3>
                  </div>
                  <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {planTokens.length} Sold
                  </span>
                </div>

                {viewMode === 'TABLE' ? (
                  <div className="w-full">
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left min-w-[700px]">
                        <thead>
                          <tr className="bg-white text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                            <th className="py-4 px-8">Ticket #</th>
                            <th className="py-4 px-6">User</th>
                            <th className="py-4 px-6">Date Purchased</th>
                            <th className="py-4 px-6">Price</th>
                            <th className="py-4 px-8 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {planTokens.map(token => (
                            <tr key={token.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-4 px-8">
                                <div className="w-10 h-10 bg-pink-50 text-pink-700 rounded-lg flex items-center justify-center font-black text-sm border border-pink-100">
                                  {token.number}
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <span className="font-black text-slate-900 text-xs">{token.username || 'Anonymous'}</span>
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex flex-col text-[10px] font-bold text-slate-500 uppercase">
                                    <span>{token.purchaseDate.split(',')[0]}</span>
                                    <span className="text-slate-400 text-[8px]">{token.purchaseDate.split(',')[1]}</span>
                                </div>
                              </td>
                              <td className="py-4 px-6 font-black text-slate-900 text-xs">Rs {plan.tokenPrice}</td>
                              <td className="py-4 px-8 text-right">
                                  <span className={`px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter ${
                                    token.status === 'WINNER' ? 'bg-emerald-500 text-white' : 'bg-amber-100 text-amber-700'
                                  }`}>
                                    {token.status}
                                  </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {/* Mobile Cards */}
                    <div className="md:hidden flex flex-col divide-y divide-slate-100">
                      {planTokens.map(token => (
                        <div key={token.id} className="p-4 flex flex-col gap-3 hover:bg-slate-50 transition-colors">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-pink-50 text-pink-700 rounded-lg flex items-center justify-center font-black text-sm border border-pink-100 flex-shrink-0">
                                {token.number}
                              </div>
                              <div className="min-w-0">
                                <span className="font-black text-slate-900 text-sm block truncate">{token.username || 'Anonymous'}</span>
                                <span className="text-[10px] font-bold text-slate-500 uppercase block truncate">{token.purchaseDate.split(',')[0]}</span>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <span className="font-black text-slate-900 text-sm block">Rs {plan.tokenPrice}</span>
                              <span className={`inline-block px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter mt-1 ${
                                token.status === 'WINNER' ? 'bg-emerald-500 text-white' : 'bg-amber-100 text-amber-700'
                              }`}>
                                {token.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-6 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 bg-white">
                    {planTokens.map(token => (
                      <div key={token.id} className="bg-slate-50 p-4 rounded-xl text-center border border-slate-200/50 hover:bg-white hover:shadow-md transition-all relative group">
                          <div className="text-xl font-black text-slate-900 mb-1">#{token.number}</div>
                          <div className="text-[8px] font-black text-slate-500 uppercase tracking-tighter truncate">{token.username || 'Anonymous'}</div>
                          <div className={`absolute -top-2 -right-2 w-4 h-4 rounded-full border-2 border-white ${token.status === 'WINNER' ? 'bg-emerald-500' : 'bg-amber-400'}`}></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 md:space-y-10 animate-in fade-in duration-500 pb-20">
      
      {/* HEADER & GLOBAL STATS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 px-1">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">Monthly Sold Tokens</h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium mt-1">Categorized view of all active sales for Monthly draws.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
           <div className="relative flex-grow md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input 
                type="text" 
                placeholder="Search ticket #..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-pink-600/10"
              />
           </div>
           <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm w-full sm:w-auto">
             <button onClick={() => setViewMode('TABLE')} className={`flex-1 sm:flex-none p-2 rounded-lg transition-all flex justify-center ${viewMode === 'TABLE' ? 'bg-pink-600 text-white' : 'text-slate-400'}`}><List size={18}/></button>
             <button onClick={() => setViewMode('GRID')} className={`flex-1 sm:flex-none p-2 rounded-lg transition-all flex justify-center ${viewMode === 'GRID' ? 'bg-pink-600 text-white' : 'text-slate-400'}`}><LayoutGrid size={18}/></button>
           </div>
        </div>
      </div>

      {/* OVERALL SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-slate-900 p-5 md:p-6 rounded-2xl md:rounded-[2.5rem] text-white flex items-center space-x-4 md:space-x-5 shadow-2xl relative overflow-hidden">
           <div className="bg-white/10 w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0"><ClipboardList size={20}/></div>
           <div className="min-w-0">
              <span className="block text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1 truncate">Total Monthly Sales</span>
              <span className="text-2xl md:text-3xl font-black truncate">{monthlyTokens.length}</span>
           </div>
           <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        </div>
        <div className="bg-white p-5 md:p-6 rounded-2xl md:rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center space-x-4 md:space-x-5">
           <div className="bg-pink-600 w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0"><Calendar size={20}/></div>
           <div className="min-w-0">
              <span className="block text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1 truncate">Active Monthly Plans</span>
              <span className="text-2xl md:text-3xl font-black text-slate-900 truncate">{monthlyPlans.length}</span>
           </div>
        </div>
      </div>

      {/* 1. MONTHLY SECTION */}
      <TokenSection 
        title="Monthly Draw Sales" 
        icon={<Calendar size={20} />} 
        tokensList={monthlyTokens} 
        plansList={monthlyPlans}
        colorClass="bg-pink-600"
      />

      {/* FOOTER INFO */}
      <div className="bg-pink-50 border border-pink-100 p-8 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-pink-600 shadow-sm"><Trophy size={24}/></div>
            <div>
               <h4 className="font-black text-pink-900 uppercase tracking-tight leading-none mb-1">Revenue Tracking</h4>
               <p className="text-xs text-pink-700/60 font-medium">Verify your bank accounts or wallets for the incoming funds from these tokens.</p>
            </div>
         </div>
         <button className="px-8 py-4 bg-white text-pink-600 font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-lg shadow-pink-600/5 hover:bg-pink-600 hover:text-white transition-all flex items-center space-x-2">
            <span>View Full Ledger</span>
            <ArrowRight size={14} />
         </button>
      </div>

    </div>
  );
};

export default AdminMonthlySoldTokens;
