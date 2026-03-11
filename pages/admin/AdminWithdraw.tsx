
import React, { useState } from 'react';
import { Search, Filter, Clock, CheckCircle2, XCircle, MoreVertical, CreditCard, Wallet, AlertTriangle, User, Copy } from 'lucide-react';
import { useUser } from '../../context/UserContext.ts';

const AdminWithdraw: React.FC = () => {
  const { transactions, updateTransactionStatus } = useUser();
  const [activeTab, setActiveTab] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');

  // Filter only WITHDRAWAL transactions from global state
  const withdrawals = transactions.filter(t => t.type === 'WITHDRAWAL' && t.status === activeTab);

  const handleAction = (id: string, status: 'APPROVED' | 'REJECTED') => {
    updateTransactionStatus(id, status);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard: ' + text);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Withdrawal Management</h1>
          <p className="text-slate-500 font-medium">Review real-time cash-out requests from users.</p>
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
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
               <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-indigo-600 text-white rounded-[1.25rem] flex items-center justify-center font-black text-xl border-4 border-white shadow-lg">
                    {(wid.username || 'W').charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 uppercase text-base">@{wid.username || 'User Request'}</h4>
                    <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                       <Clock size={12} />
                       <span>{wid.date}</span>
                    </div>
                  </div>
               </div>
               <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                    wid.status === 'PENDING' ? 'bg-amber-100 text-amber-700 animate-pulse' :
                    wid.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {wid.status}
                  </span>
               </div>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
               {/* Account Details Column */}
               <div className="space-y-6">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Target Account Info</p>
                    
                    <div className="flex flex-col space-y-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Payment Method</span>
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                          <CreditCard size={14} />
                        </div>
                        <span className="font-black text-slate-900 text-sm uppercase">{wid.method}</span>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Account Title / Name</span>
                      <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="font-black text-slate-900 text-sm uppercase">{wid.accountName || 'N/A'}</span>
                        <button onClick={() => copyToClipboard(wid.accountName || '')} className="text-slate-300 hover:text-indigo-600"><Copy size={14}/></button>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Mobile / Account Number</span>
                      <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="font-black text-indigo-600 text-base">{wid.accountNumber || 'N/A'}</span>
                        <button onClick={() => copyToClipboard(wid.accountNumber || '')} className="text-slate-300 hover:text-indigo-600"><Copy size={14}/></button>
                      </div>
                    </div>
                  </div>
               </div>

               {/* Payout Summary Column */}
               <div className="flex flex-col">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2 mb-6">Payout Calculation</p>
                  <div className="bg-slate-900 rounded-3xl p-6 text-white space-y-4 shadow-xl flex-grow">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Requested</span>
                      <span className="font-bold">Rs {wid.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Service Fee</span>
                      <span className="font-bold text-red-400">- Rs {wid.charges.toLocaleString()}</span>
                    </div>
                    <div className="h-px bg-white/10 my-2"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Send Exactly</span>
                      <span className="text-xl font-black text-emerald-400">Rs {wid.netAmount.toLocaleString()}</span>
                    </div>
                    <div className="pt-4 mt-auto">
                      <p className="text-[8px] text-center text-slate-500 uppercase font-bold tracking-widest font-mono">TXID: {wid.id.slice(0, 12)}</p>
                    </div>
                  </div>
               </div>
            </div>

            {wid.status === 'PENDING' && (
              <div className="p-8 flex items-center space-x-4 bg-slate-50/50">
                 <button 
                  onClick={() => handleAction(wid.id, 'APPROVED')}
                  className="flex-grow py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-xl shadow-emerald-600/20 text-xs uppercase tracking-[0.15em] transition-all active:scale-95 flex items-center justify-center space-x-2"
                 >
                    <CheckCircle2 size={18} />
                    <span>Confirm & Mark Paid</span>
                 </button>
                 <button 
                  onClick={() => handleAction(wid.id, 'REJECTED')}
                  className="px-6 py-4 bg-white border border-slate-200 hover:bg-red-50 hover:border-red-600 hover:text-red-600 text-slate-400 rounded-2xl transition-all font-black text-xs uppercase tracking-widest active:scale-95"
                 >
                    Reject
                 </button>
              </div>
            )}
          </div>
        ))}

        {withdrawals.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
             <Wallet size={48} className="mx-auto text-slate-200 mb-4" />
             <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No {activeTab.toLowerCase()} withdrawal requests found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminWithdraw;
