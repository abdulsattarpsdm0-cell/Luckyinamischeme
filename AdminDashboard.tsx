
import React from 'react';
import { Users, CreditCard, ArrowDownCircle, ArrowUpCircle, Ticket, BarChart3, Clock, TrendingUp, AlertCircle } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const stats = [
    { label: 'Total Users', value: '1,284', icon: <Users size={24} />, color: 'bg-blue-600', sub: 'Active today: 42' },
    { label: 'Total Deposits', value: 'PKR 450,200', icon: <ArrowDownCircle size={24} />, color: 'bg-emerald-600', sub: 'Pending: 5' },
    { label: 'Total Withdrawals', value: 'PKR 125,000', icon: <ArrowUpCircle size={24} />, color: 'bg-orange-600', sub: 'Approved: 28' },
    { label: 'Active Users', value: '86', icon: <TrendingUp size={24} />, color: 'bg-indigo-600', sub: 'Playing now: 12' },
    { label: 'Token Buyers', value: '412', icon: <Ticket size={24} />, color: 'bg-pink-600', sub: 'Sold today: 156' },
    { label: 'Revenue Today', value: 'PKR 12,500', icon: <BarChart3 size={24} />, color: 'bg-teal-600', sub: 'Profit: 4,200' },
  ];

  const activities = [
    { type: 'USER', user: 'Ali_Khan', desc: 'New user registered', time: '2 mins ago', icon: '👤', color: 'text-blue-500' },
    { type: 'DEPOSIT', user: 'Zaid_123', desc: 'Deposited 5,000 PKR', time: '15 mins ago', icon: '💰', color: 'text-emerald-500' },
    { type: 'TOKEN', user: 'Sara_Lucky', desc: 'Bought Gold token #156', time: '42 mins ago', icon: '🎫', color: 'text-indigo-500' },
    { type: 'WITHDRAW', user: 'Irfan_M', desc: 'Requested withdrawal of 10k', time: '1 hour ago', icon: '💸', color: 'text-orange-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 font-medium">Real-time control center for Lucky Inami Scheme.</p>
        </div>
        <div className="hidden md:flex items-center space-x-2 bg-white px-4 py-2 rounded-xl border border-slate-200 text-xs font-black uppercase tracking-widest text-slate-400">
          <Clock size={14} />
          <span>Syncing: Every 5s</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
             <div className={`${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-${stat.color.split('-')[1]}-600/20`}>
                {stat.icon}
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
             <h3 className="text-xl font-black text-slate-900">{stat.value}</h3>
             <div className="mt-3 flex items-center space-x-1 text-[9px] font-black uppercase text-slate-400">
                <AlertCircle size={10} className="text-indigo-500" />
                <span>{stat.sub}</span>
             </div>
          </div>
        ))}
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Activity Feed */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col h-full overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <h3 className="font-black text-slate-900 uppercase tracking-tight">Live Activity</h3>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            </div>
            <div className="p-8 space-y-6 overflow-y-auto max-h-[400px]">
              {activities.map((act, i) => (
                <div key={i} className="flex items-start space-x-4 group">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-lg shadow-inner group-hover:scale-110 transition-transform">
                    {act.icon}
                  </div>
                  <div className="flex-grow">
                    <p className="text-xs font-black text-slate-900 uppercase">
                      {act.user} <span className="text-slate-400 font-bold lowercase">— {act.desc}</span>
                    </p>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 h-full">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-black text-slate-900 uppercase tracking-tight">Revenue Trend (Last 7 Days)</h3>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black rounded-lg">Week</button>
                <button className="px-3 py-1 bg-slate-50 text-slate-400 text-[10px] font-black rounded-lg hover:bg-slate-100 transition-all">Month</button>
              </div>
            </div>
            
            {/* Visual Chart Placeholder */}
            <div className="h-[300px] flex items-end space-x-4 px-4 border-b border-slate-100 pb-2">
               {[40, 65, 30, 85, 55, 90, 75].map((val, i) => (
                 <div key={i} className="flex-grow flex flex-col items-center">
                   <div 
                    className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-xl group relative cursor-pointer hover:opacity-80 transition-all" 
                    style={{ height: `${val}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {val * 100}k
                    </div>
                  </div>
                   <span className="mt-3 text-[10px] font-black text-slate-400 uppercase">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
