
import React, { useState } from 'react';
import { Search, Filter, Clock, CheckCircle2, XCircle, MoreVertical, ExternalLink, Image as ImageIcon, User, Eye, X } from 'lucide-react';
import { useUser } from '../../context/UserContext.ts';

const AdminDeposit: React.FC = () => {
  const { transactions, updateTransactionStatus } = useUser();
  const [activeTab, setActiveTab] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const deposits = transactions.filter(t => t.type === 'DEPOSIT' && t.status === activeTab);

  const handleAction = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      await updateTransactionStatus(id, status);
      alert(`Transaction ${status} successfully.`);
    } catch (error) {
      console.error("Error updating transaction:", error);
      alert("Failed to update transaction. Please try again.");
    }
  };

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-1">
        <div>
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 uppercase tracking-tight leading-none">Deposit Desk</h1>
          <p className="text-[10px] md:text-sm text-slate-500 font-bold uppercase tracking-widest mt-2">Manage fund injections.</p>
        </div>
        
        <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm w-full md:w-auto overflow-x-auto no-scrollbar">
          {['PENDING', 'APPROVED', 'REJECTED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {deposits.map((dep) => (
          <div key={dep.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col group transition-all hover:shadow-lg">
            {/* Header */}
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
               <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-white text-sm">
                    {(dep.username || 'U').charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-black text-slate-900 uppercase text-[11px] truncate block">@{dep.username || 'User'}</h4>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{dep.date.split(',')[0]}</span>
                  </div>
               </div>
               <span className={`px-2 py-1 rounded-full text-[8px] font-black uppercase ${
                 dep.status === 'PENDING' ? 'bg-amber-100 text-amber-700 animate-pulse' :
                 dep.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
               }`}>
                 {dep.status}
               </span>
            </div>

            {/* Proof Area */}
            <div className="px-6 pt-6">
               <div 
                 onClick={() => dep.proofImage && setPreviewImage(dep.proofImage)}
                 className="w-full aspect-[16/10] rounded-2xl bg-slate-100 border border-slate-50 overflow-hidden relative group/img cursor-pointer shadow-inner"
               >
                  {dep.proofImage ? (
                    <img src={dep.proofImage} className="w-full h-full object-cover" alt="Proof" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                      <ImageIcon size={32} />
                      <span className="text-[8px] font-black uppercase mt-1">No Image</span>
                    </div>
                  )}
                  {dep.proofImage && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                       <Eye className="text-white" size={24} />
                    </div>
                  )}
               </div>
            </div>

            {/* Money Box */}
            <div className="p-6 space-y-5">
               <div className="flex justify-between items-end">
                  <div className="min-w-0">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Bill</p>
                    <h5 className="text-xl md:text-2xl font-black text-slate-900 truncate">Rs {(dep.amount || 0).toLocaleString()}</h5>
                  </div>
                  <div className="text-right whitespace-nowrap">
                    <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Fee (10%)</span>
                    <span className="text-[10px] font-bold text-red-500">Rs {(dep.charges || 0).toLocaleString()}</span>
                  </div>
               </div>

               <div className="bg-[#1a233a] rounded-2xl p-5 text-white shadow-xl space-y-3">
                  <div className="flex justify-between items-center text-[9px] font-black tracking-widest uppercase">
                    <span className="text-slate-400">Gateway</span>
                    <span className="text-indigo-400">{dep.method}</span>
                  </div>
                  <div className="h-px bg-white/5"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-slate-400 uppercase">To Add</span>
                    <span className="text-lg font-black text-emerald-400">Rs {(dep.netAmount || 0).toLocaleString()}</span>
                  </div>
               </div>

               <div className="text-[9px] font-bold text-slate-400 uppercase bg-slate-50 p-2.5 rounded-xl border border-slate-100 truncate">
                  TXID: <span className="font-mono text-slate-700">{dep.txId || 'NONE'}</span>
               </div>
            </div>

            {dep.status === 'PENDING' && (
              <div className="px-6 pb-6 pt-0 flex items-center space-x-2">
                <button onClick={() => handleAction(dep.id, 'APPROVED')} className="flex-grow py-3 bg-emerald-600 text-white font-black rounded-xl text-[9px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">Confirm</button>
                <button onClick={() => handleAction(dep.id, 'REJECTED')} className="flex-grow py-3 bg-red-600 text-white font-black rounded-xl text-[9px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">Reject</button>
              </div>
            )}
          </div>
        ))}

        {deposits.length === 0 && (
          <div className="col-span-full py-20 text-center">
             <Clock size={48} className="mx-auto text-slate-200 mb-4" />
             <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">No {activeTab.toLowerCase()} requests.</p>
          </div>
        )}
      </div>

      {previewImage && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md">
           <div className="relative max-w-2xl w-full flex flex-col items-center">
              <button onClick={() => setPreviewImage(null)} className="absolute -top-10 right-0 text-white"><X size={32}/></button>
              <img src={previewImage} className="w-full h-full object-contain rounded-xl shadow-2xl" alt="Proof" />
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminDeposit;
