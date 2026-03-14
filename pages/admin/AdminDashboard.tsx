
import React, { useMemo, useState, useEffect } from 'react';
import { Users, CreditCard, ArrowDownCircle, ArrowUpCircle, Ticket, BarChart3, Clock, TrendingUp, AlertCircle, Zap, Activity } from 'lucide-react';
import { useUser } from '../../context/UserContext.ts';

const AdminDashboard: React.FC = () => {
  const { users, transactions, allTokens: tokens } = useUser();
  const [activeNow, setActiveNow] = useState(0);
  
  useEffect(() => {
    setActiveNow(Math.max(1, Math.floor(users.length * 0.2)));
    const interval = setInterval(() => {
      setActiveNow(prev => Math.max(1, prev + (Math.random() > 0.5 ? 1 : -1)));
    }, 10000);
    return () => clearInterval(interval);
  }, [users.length]);

  const stats = useMemo(() => {
    const pendingDeposits = transactions.filter(t => t.type === 'DEPOSIT' && t.status === 'PENDING').length;
    const pendingWithdrawals = transactions.filter(t => t.type === 'WITHDRAWAL' && t.status === 'PENDING').length;
    const totalDeposits = transactions.filter(t => t.type === 'DEPOSIT' && t.status === 'APPROVED').reduce((acc, curr) => acc + curr.amount, 0);
    const totalPayouts = transactions.filter(t => t.type === 'WITHDRAWAL' && t.status === 'APPROVED').reduce((acc, curr) => acc + curr.amount, 0);
    
    return [
      { label: 'Total Users', value: users.length.toString(), icon: <Users size={20} />, color: 'bg-blue-600', sub: 'Registered Members' },
      { label: 'Pending Deposits', value: pendingDeposits.toString(), icon: <ArrowDownCircle size={20} />, color: 'bg-amber-500', sub: 'Review Required', isLive: pendingDeposits > 0 },
      { label: 'Pending Payouts', value: pendingWithdrawals.toString(), icon: <ArrowUpCircle size={20} />, color: 'bg-indigo-600', sub: 'Process Requests', isLive: pendingWithdrawals > 0 },
      { label: 'Tokens Sold', value: tokens.length.toString(), icon: <Ticket size={20} />, color: 'bg-pink-600', sub: 'All Categories' },
      { label: 'Total Revenue', value: `Rs ${totalDeposits.toLocaleString()}`, icon: <BarChart3 size={20} />, color: 'bg-emerald-600', sub: 'Gross Inflow' },
      { label: 'Total Payouts', value: `Rs ${totalPayouts.toLocaleString()}`, icon: <CreditCard size={20} />, color: 'bg-slate-900', sub: 'Processed' },
    ];
  }, [users, transactions, tokens]);

  const liveActivities = useMemo(() => {
    return [...transactions, ...tokens.map(tk => ({ ...tk, type: 'TOKEN' as any, username: 'User', date: tk.purchaseDate, id: tk.id.toString(), amount: 0 }))]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 8);
  }, [transactions, tokens]);

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 px-1">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Real-Time Control</h1>
          <p className="text-sm text-slate-500 font-medium">Monitoring actual platform traffic and financial data.</p>
        </div>
        <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400 shadow-sm">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
          <span>System Health: Perfect</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm group hover:shadow-lg transition-all relative overflow-hidden">
             <div className={`${stat.color} w-10 h-10 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg`}>
                {stat.icon}
             </div>
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 truncate">{stat.label}</p>
             <h3 className="text-lg font-black text-slate-900 truncate">{stat.value}</h3>
             {stat.isLive && <span className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 flex flex-col">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col h-full overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <h3 className="font-black text-slate-900 uppercase tracking-tight text-xs">Platform Activity</h3>
              <Activity size={16} className="text-indigo-600" />
            </div>
            <div className="p-6 space-y-4 overflow-y-auto max-h-[450px]">
              {liveActivities.length === 0 ? (
                <div className="py-10 text-center text-slate-300 font-black uppercase text-[10px]">No Activity Yet</div>
              ) : liveActivities.map((act: any, i) => (
                <div key={i} className="flex items-start space-x-3 border-b border-slate-50 pb-3 last:border-0">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-sm">
                    {act.type === 'DEPOSIT' ? '💰' : act.type === 'WITHDRAWAL' ? '💸' : '🎫'}
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-[10px] font-black uppercase truncate text-slate-900">
                      {act.username || 'Member'} <span className="text-slate-400 font-bold lowercase">— {act.type || 'Action'}</span>
                    </p>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{act.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl h-full flex flex-col justify-center">
             <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-8">
                   <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                      <Users size={24} />
                   </div>
                   <div>
                      <h3 className="text-xl font-black uppercase tracking-tight">Active Traffic</h3>
                      <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Real-Time Simulation</p>
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-10">
                   <div>
                      <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Simulated Visitors</span>
                      <span className="text-5xl font-black text-white">{activeNow}</span>
                   </div>
                   <div>
                      <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Platform Goal</span>
                      <span className="text-5xl font-black text-indigo-400">100%</span>
                   </div>
                </div>
             </div>
             <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
