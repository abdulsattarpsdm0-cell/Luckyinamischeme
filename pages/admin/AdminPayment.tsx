
import React, { useState } from 'react';
import { Plus, Edit3, Trash2, CreditCard, X, Smartphone, Wallet, CheckCircle2 } from 'lucide-react';
import { useUser, PaymentMethod } from '../../context/UserContext.ts';

const AdminPayment: React.FC = () => {
  const { paymentMethods, addPaymentMethod, deletePaymentMethod, updatePaymentMethod } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<PaymentMethod>>({
    name: '', title: '', number: '', status: 'ACTIVE', type: 'Mobile Wallet'
  });

  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormData({ name: '', title: '', number: '', status: 'ACTIVE', type: 'Mobile Wallet' });
    setShowModal(true);
  };

  const handleOpenEdit = (method: PaymentMethod) => {
    setIsEditing(true);
    setFormData(method);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      updatePaymentMethod(formData as PaymentMethod);
    } else {
      const newMethod: PaymentMethod = { ...formData as PaymentMethod, id: Math.random().toString(36).substr(2, 9) };
      addPaymentMethod(newMethod);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-1">
        <div>
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 uppercase tracking-tight">Payment Gateways</h1>
          <p className="text-[10px] md:text-sm text-slate-500 font-bold uppercase tracking-widest mt-2">Manage Gateway configuration.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="w-full md:w-auto flex items-center justify-center space-x-2 px-8 py-4 bg-indigo-600 text-white font-black rounded-xl md:rounded-2xl shadow-xl transition-all active:scale-95 uppercase tracking-widest text-[10px]"
        >
          <Plus size={18} />
          <span>Add Method</span>
        </button>
      </div>

      {/* Grid of Payment Methods */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paymentMethods.map((method) => (
          <div key={method.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col group transition-all hover:shadow-lg">
            <div className={`h-2 ${method.status === 'ACTIVE' ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
            <div className="p-6 md:p-8 space-y-6">
               <div className="flex justify-between items-start">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
                     <CreditCard size={28} />
                  </div>
                  <div className={`px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${method.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {method.status}
                  </div>
               </div>
               <div>
                  <h4 className="text-lg font-black text-slate-900 uppercase leading-none">{method.name}</h4>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{method.type}</p>
               </div>
               <div className="bg-slate-50 rounded-2xl p-5 space-y-4 border border-slate-100">
                  <div className="min-w-0">
                    <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Title</span>
                    <span className="font-bold text-slate-900 text-xs truncate block">{method.title}</span>
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Number</span>
                    <span className="font-black text-indigo-600 text-sm truncate block tracking-wider">{method.number}</span>
                  </div>
               </div>
            </div>
            <div className="p-5 bg-slate-50/50 border-t border-slate-100 flex items-center space-x-3">
               <button onClick={() => handleOpenEdit(method)} className="flex-grow py-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-indigo-600 transition-all font-black text-[10px] uppercase tracking-widest shadow-sm">
                  Update
               </button>
               <button onClick={() => deletePaymentMethod(method.id)} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-red-600 transition-all">
                  <Trash2 size={16} />
               </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 bg-slate-900/80 backdrop-blur-md">
          <div className="bg-white w-full max-w-xl md:rounded-[3rem] rounded-t-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{isEditing ? 'Edit Method' : 'Add Method'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl"><X size={24}/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 block">Gateway Name</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 focus:border-indigo-600 outline-none font-bold text-sm" placeholder="e.g. EasyPaisa" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 block">Account Holder</label>
                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 focus:border-indigo-600 outline-none font-bold text-sm" placeholder="Full Name" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 block">Number / Details</label>
                <input required value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 focus:border-indigo-600 outline-none font-black text-indigo-600 text-sm tracking-wider" placeholder="03XXXXXXXXX" />
              </div>
              <button type="submit" className="w-full py-5 bg-indigo-600 text-white font-black rounded-xl uppercase tracking-widest shadow-xl text-[11px] active:scale-95 transition-all mt-4">
                {isEditing ? 'Save Changes' : 'Launch Gateway'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayment;
