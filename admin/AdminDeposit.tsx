
import React, { useState } from 'react';
import { Search, Filter, Clock, CheckCircle2, XCircle, MoreVertical, ExternalLink, Image as ImageIcon } from 'lucide-react';

const AdminDeposit: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');

  const deposits = [
    { id: '1', user: 'Zaid_Ahmed', amount: 5000, method: 'EasyPaisa', txId: 'TXN987654321', date: '2024-05-18 10:30 AM', status: 'PENDING', fee: 500, net: 4500 },
    { id: '2', user: 'Dilbar_Lucky', amount: 1000, method: 'JazzCash', txId: 'JZC123456789', date: '2024-05-18 11:15 AM', status: 'PENDING', fee: 100, net: 900 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Deposit Management</h1>
          <p className="text-slate-500 font-medium">Verify payment proofs and update user balances.</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {deposits.map((dep) => (
          <div key={dep.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col group transition-all hover:shadow-xl">
            {/* Header */}
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
               <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-indigo-600 uppercase">
                    {dep.user.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 uppercase text-sm">@{dep.user}</h4>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{dep.date}</span>
                  </div>
               </div>
               <span className={`px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                 activeTab === 'PENDING' ? 'bg-amber-100 text-amber-700 animate-pulse' :
                 activeTab === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
               }`}>
                 {activeTab}
               </span>
            </div>

            {/* Body */}
            <div className="p-8 space-y-6">
               <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Requested Amount</p>
                    <h5 className="text-3xl font-black text-slate-900">PKR {dep.amount.toLocaleString()}</h5>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Fee (10%)</span>
                    <span className="text-xs font-bold text-red-500">PKR {dep.fee}</span>
                  </div>
               </div>

               <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-slate-400 uppercase tracking-widest">Gateway</span>
                    <span className="text-slate-900 uppercase">{dep.method}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-slate-400 uppercase tracking-widest">Transaction ID</span>
                    <span className="text-slate-900 text-indigo-600">{dep.txId}</span>
                  </div>
               </div>

               <button className="w-full py-3 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center space-x-2 text-slate-600 font-black text-[10px] uppercase tracking-widest transition-all">
                  <ImageIcon size={14} />
                  <span>View Payment Proof</span>
                  <ExternalLink size={12} />
               </button>

               <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Net Credit Amount</p>
                  <p className="text-lg font-black text-emerald-600">PKR {dep.net.toLocaleString()}</p>
               </div>
            </div>

            {/* Actions */}
            {activeTab === 'PENDING' && (
              <div className="p-6 bg-slate-50 flex items-center space-x-3">
                <button className="flex-grow py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-lg shadow-emerald-600/20 text-[10px] uppercase tracking-widest flex items-center justify-center space-x-2 transition-all">
                   <CheckCircle2 size={14} />
                   <span>Approve</span>
                </button>
                <button className="flex-grow py-3.5 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl shadow-lg shadow-red-600/20 text-[10px] uppercase tracking-widest flex items-center justify-center space-x-2 transition-all">
                   <XCircle size={14} />
                   <span>Reject</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDeposit;
