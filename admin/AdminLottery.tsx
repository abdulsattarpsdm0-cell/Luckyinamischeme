
import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Ticket, Trophy, Clock, PlayCircle, StopCircle, Eye } from 'lucide-react';
import { LOTTERY_PLANS } from '../../constants';

const AdminLottery: React.FC = () => {
  const [lotteries, setLotteries] = useState(LOTTERY_PLANS.map(p => ({ ...p, status: 'ACTIVE', sold: 84 })));

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Lottery Management</h1>
          <p className="text-slate-500 font-medium">Create, update, and manage your lottery plans.</p>
        </div>
        <button className="flex items-center space-x-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/20 transition-all uppercase tracking-widest text-xs active:scale-95">
          <Plus size={18} />
          <span>Add New Lottery</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {lotteries.map((lottery) => (
          <div key={lottery.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col group transition-all hover:shadow-2xl">
            {/* Header */}
            <div className="relative h-48 bg-slate-100 overflow-hidden">
               <div className="absolute inset-0 flex items-center justify-center text-7xl group-hover:scale-110 transition-transform duration-500 grayscale group-hover:grayscale-0">
                  {lottery.icon}
               </div>
               <div className="absolute top-6 right-6">
                  <span className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg ${
                    lottery.status === 'ACTIVE' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {lottery.status === 'ACTIVE' ? <PlayCircle size={10} /> : <StopCircle size={10} />}
                    <span>{lottery.status}</span>
                  </span>
               </div>
            </div>

            {/* Body */}
            <div className="p-8 flex-grow space-y-6">
               <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 uppercase">{lottery.name}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">PKR {lottery.tokenPrice} per token</p>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">Total Prize</span>
                    <span className="text-lg font-black text-indigo-600">PKR {lottery.prizePerWinner.toLocaleString()}</span>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-500 border-b border-slate-50 pb-2">
                    <div className="flex items-center space-x-2">
                       <Clock size={14} className="text-slate-300" />
                       <span>Next Draw</span>
                    </div>
                    <span className="text-slate-900">Sunday 4:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold text-slate-500 border-b border-slate-50 pb-2">
                    <div className="flex items-center space-x-2">
                       <Trophy size={14} className="text-slate-300" />
                       <span>Winners</span>
                    </div>
                    <span className="text-slate-900">{lottery.totalWinners} spots</span>
                  </div>
               </div>

               <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                     <span>{lottery.sold} / {lottery.totalTokens} Tokens Sold</span>
                     <span className="text-indigo-600">{Math.round((lottery.sold/lottery.totalTokens)*100)}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-50 rounded-full overflow-hidden shadow-inner">
                     <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${(lottery.sold/lottery.totalTokens)*100}%` }}></div>
                  </div>
               </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-slate-50 flex items-center space-x-3">
               <button className="flex-grow flex items-center justify-center space-x-2 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-indigo-600 hover:border-indigo-600 transition-all font-bold text-xs uppercase shadow-sm">
                  <Edit3 size={16} />
                  <span>Edit</span>
               </button>
               <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all shadow-sm">
                  <Eye size={18} />
               </button>
               <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-red-600 hover:border-red-600 transition-all shadow-sm">
                  <Trash2 size={18} />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminLottery;
