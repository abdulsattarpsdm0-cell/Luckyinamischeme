
import React from 'react';
import { Plus, Edit3, Trash2, CreditCard, ShieldCheck, CheckCircle2, XCircle, ChevronRight, Smartphone } from 'lucide-react';

const AdminPayment: React.FC = () => {
  const methods = [
    { id: '1', name: 'EasyPaisa', title: 'Dilbar Ali', number: '03177730425', status: 'ACTIVE', type: 'Mobile Wallet' },
    { id: '2', name: 'JazzCash', title: 'Dilbar Ali', number: '03177730425', status: 'ACTIVE', type: 'Mobile Wallet' },
    { id: '3', name: 'Bank Transfer', title: 'Lucky Scheme Account', number: 'PK81HABB0010203040', status: 'INACTIVE', type: 'Bank' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Payment Gateways</h1>
          <p className="text-slate-500 font-medium">Configure deposit and withdrawal methods for your users.</p>
        </div>
        <button className="flex items-center space-x-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/20 transition-all uppercase tracking-widest text-xs active:scale-95">
          <Plus size={18} />
          <span>Add Payout Method</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {methods.map((method) => (
          <div key={method.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col group transition-all hover:shadow-xl">
            {/* Design Element */}
            <div className="h-3 bg-indigo-600"></div>
            
            <div className="p-8 space-y-8">
               <div className="flex justify-between items-start">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                     <CreditCard size={32} />
                  </div>
                  <div className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    method.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {method.status}
                  </div>
               </div>

               <div>
                  <h4 className="text-xl font-black text-slate-900 uppercase mb-1">{method.name}</h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{method.type}</p>
               </div>

               <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
                  <div>
                    <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Account Title</span>
                    <span className="font-bold text-slate-900 text-sm uppercase">{method.title}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Account Number</span>
                    <span className="font-bold text-indigo-600 text-base">{method.number}</span>
                  </div>
               </div>

               <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center space-x-2">
                     <div className={`w-2 h-2 rounded-full ${method.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Visibility</span>
                  </div>
                  <button className="text-indigo-600 font-black text-[10px] uppercase tracking-widest flex items-center hover:underline">
                    Settings <ChevronRight size={14} />
                  </button>
               </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center space-x-3">
               <button className="flex-grow py-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-indigo-600 hover:border-indigo-600 transition-all font-black text-[10px] uppercase tracking-widest shadow-sm flex items-center justify-center space-x-2">
                  <Edit3 size={14} />
                  <span>Update</span>
               </button>
               <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-red-600 hover:border-red-600 transition-all shadow-sm">
                  <Trash2 size={16} />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPayment;
