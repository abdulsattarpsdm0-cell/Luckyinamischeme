
import React, { useState } from 'react';
import { Search, Filter, Clock, CheckCircle2, XCircle, MoreVertical, CreditCard, Wallet, AlertTriangle } from 'lucide-react';

const AdminWithdraw: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');

  const withdrawals = [
    { id: '1', user: 'Sara_Lucky', amount: 12000, balance: 45000, method: 'EasyPaisa', accTitle: 'Sara Khan', accNo: '03459876543', date: '2024-05-18 09:45 AM', status: 'PENDING', fee: 1200, net: 10800 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Withdrawal Management</h1>
          <p className="text-slate-500 font-medium">Review and process user withdrawal requests.</p>
        </div>
        
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm w-full md:w-auto">
          {['PENDING', 'APPROVED', 'REJECTED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {withdrawals.map((wid) => (
          <div key={wid.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col group transition-all hover:shadow-xl">
            {/* Header */}
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
               <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-indigo-600 text-white rounded-[1.25rem] flex items-center justify-center font-black text-xl border-4 border-white shadow-lg">
                    {wid.user.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 uppercase text-base">@{wid.user}</h4>
                    <div className="flex items-center space-x-2 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                       <Wallet size={12} />
                       <span>Balance: PKR {wid.balance.toLocaleString()}</span>
                    </div>
                  </div>
               </div>
               <div className="text-right">
                  <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{wid.date}</span>
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[9px] font-black uppercase rounded-full">Pending</span>
               </div>
            </div>

            {/* Body */}
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
               <div className="space-y-6">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Payout Method</p>
                    <div className="flex items-center space-x-3">
                       <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-indigo-600">
                          <CreditCard size={20} />
                       </div>
                       <div>
                          <p className="font-black text-slate-900 text-sm uppercase">{wid.method}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">{wid.accNo}</p>
                       </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Account Holder</p>
                    <p className="font-black text-slate-900 text-base uppercase">{wid.accTitle}</p>
                  </div>
               </div>

               <div className="bg-slate-900 rounded-3xl p-6 text-white space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Request</span>
                    <span className="font-bold">PKR {wid.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fee (10%)</span>
                    <span className="font-bold text-red-400">- PKR {wid.fee.toLocaleString()}</span>
                  </div>
                  <div className="h-px bg-white/10 my-2"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Net Payout</span>
                    <span className="text-xl font-black text-emerald-400">PKR {wid.net.toLocaleString()}</span>
                  </div>
               </div>
            </div>

            {/* Warning for high amounts */}
            {wid.amount > 10000 && (
              <div className="mx-8 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-center space-x-3 text-amber-700">
                 <AlertTriangle size={18} />
                 <p className="text-[10px] font-black uppercase tracking-tight">Large Withdrawal Alert: Verify user activity before approving.</p>
              </div>
            )}

            {/* Actions */}
            <div className="p-8 flex items-center space-x-4">
               <button className="flex-grow py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-xl shadow-emerald-600/20 text-xs uppercase tracking-[0.15em] transition-all active:scale-95 flex items-center justify-center space-x-2">
                  <CheckCircle2 size={18} />
                  <span>Approve & Mark Paid</span>
               </button>
               <button className="px-6 py-4 bg-white border border-slate-200 hover:bg-red-50 hover:border-red-600 hover:text-red-600 text-slate-400 rounded-2xl transition-all font-black text-xs uppercase tracking-widest">
                  Reject
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminWithdraw;
