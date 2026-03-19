
import React, { useState, useMemo } from 'react';
import { 
  Search, ShieldAlert, CheckCircle2, XCircle, CreditCard, Ticket, Share2, Wallet, Plus, Minus, Mail, User, Phone, ArrowDownCircle, ArrowUpCircle, Eye, EyeOff, Users as UsersIcon, ChevronRight, X, ExternalLink
} from 'lucide-react';
import { useUser } from '../../context/UserContext.ts';

const AdminUsers: React.FC = () => {
  const { users, transactions, updateUserBalance } = useUser();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [adjustAmount, setAdjustAmount] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.firstName.toLowerCase().includes(search.toLowerCase()) || 
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  const selectedUser = useMemo(() => users.find(u => u.id === selectedUserId), [users, selectedUserId]);

  const handleAdjustBalance = (type: 'ADD' | 'DEDUCT') => {
    if (!selectedUser || !adjustAmount) return;
    const amount = parseFloat(adjustAmount);
    if (isNaN(amount)) return;
    updateUserBalance(selectedUser.id, type === 'ADD' ? amount : -amount);
    setAdjustAmount('');
    alert(`Wallet Balance ${type === 'ADD' ? 'Credited' : 'Deducted'} Successfully!`);
  };

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-500 pb-20">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-1">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight leading-none">Registered Members</h1>
          <p className="text-[10px] md:text-sm text-slate-500 font-bold uppercase tracking-widest mt-2">Manage all registered accounts</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text" 
            placeholder="Search Members..." 
            className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl text-[11px] md:text-xs font-bold outline-none shadow-sm focus:ring-4 focus:ring-indigo-600/5 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* MOBILE CARD VIEW (Shown only on small screens) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredUsers.map((u) => (
          <div 
            key={u.id} 
            onClick={() => setSelectedUserId(u.id)}
            className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm active:scale-[0.98] transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black text-sm shadow-md">
                  {u.firstName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 uppercase truncate max-w-[150px]">{u.firstName} {u.lastName}</h4>
                  <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">@{u.username}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Balance</p>
                <p className="text-sm font-black text-emerald-600 leading-none">Rs {(u.walletBalance || 0).toLocaleString()}</p>
              </div>
            </div>
            
            <div className="bg-slate-50 p-3 rounded-2xl flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-slate-500 flex items-center gap-1.5 truncate max-w-[180px]">
                  <Mail size={10} /> {u.email}
                </p>
                <p className="text-[9px] font-bold text-slate-500 flex items-center gap-1.5">
                  <Phone size={10} /> {u.mobile}
                </p>
              </div>
              <button className="p-2 bg-indigo-600 text-white rounded-lg shadow-lg">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ))}
        {filteredUsers.length === 0 && (
          <div className="py-10 text-center text-slate-400 font-black uppercase text-[10px] tracking-widest">No Members Found</div>
        )}
      </div>

      {/* DESKTOP TABLE VIEW (Shown on md and up) */}
      <div className="hidden md:block bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                <th className="py-6 px-8">Full Name</th>
                <th className="py-6 px-6">Account Info</th>
                <th className="py-6 px-6 text-right">Wallet Balance</th>
                <th className="py-6 px-8 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors cursor-pointer group" onClick={() => setSelectedUserId(u.id)}>
                  <td className="py-6 px-8">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-lg border-4 border-white shadow-lg group-hover:scale-105 transition-transform">
                        {u.firstName.charAt(0)}
                      </div>
                      <div>
                        <span className="block font-black text-slate-900 text-sm uppercase">{u.firstName} {u.lastName}</span>
                        <span className="text-[10px] text-indigo-600 font-black uppercase tracking-widest">@{u.username}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-6">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-600">{u.email}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{u.mobile}</p>
                    </div>
                  </td>
                  <td className="py-6 px-6 text-right font-black text-emerald-600">
                    Rs {(u.walletBalance || 0).toLocaleString()}
                  </td>
                  <td className="py-6 px-8 text-right">
                    <button className="px-5 py-2.5 bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Manage Account</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Responsive Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 bg-slate-900/90 backdrop-blur-md">
           <div className="bg-white w-full max-w-4xl md:rounded-[3rem] rounded-t-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[95vh] flex flex-col">
              <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                 <div className="flex items-center space-x-3 md:space-x-5">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-lg md:text-2xl border-4 border-white shadow-xl">
                      {selectedUser.firstName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base md:text-2xl font-black text-slate-900 uppercase truncate">@{selectedUser.username}</h3>
                      <p className="text-[8px] md:text-[10px] font-black text-indigo-600 uppercase tracking-widest">Member Management Panel</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedUserId(null)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-all">
                   <X size={20}/>
                 </button>
              </div>

              <div className="flex-grow overflow-y-auto p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                 {/* Profile Details */}
                 <div className="space-y-6">
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                       <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b pb-2 flex items-center gap-2">
                         <User size={12} /> Contact Details
                       </h4>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="min-w-0">
                             <span className="block text-[8px] font-black text-slate-400 uppercase mb-1">Email Address</span>
                             <span className="font-bold text-slate-900 text-[11px] block truncate">{selectedUser.email}</span>
                          </div>
                          <div>
                             <span className="block text-[8px] font-black text-slate-400 uppercase mb-1">Access Pass</span>
                             <div className="flex items-center space-x-2">
                                <span className="font-black text-indigo-600 text-[11px] tracking-widest">
                                  {showPassword ? selectedUser.password : '••••••••'}
                                </span>
                                <button onClick={() => setShowPassword(!showPassword)} className="text-slate-400">
                                  {showPassword ? <EyeOff size={14}/> : <Eye size={14}/>}
                                </button>
                             </div>
                          </div>
                          <div>
                             <span className="block text-[8px] font-black text-slate-400 uppercase mb-1">Mobile Number</span>
                             <span className="font-bold text-slate-900 text-[11px] block">{selectedUser.mobile}</span>
                          </div>
                          <div>
                             <span className="block text-[8px] font-black text-slate-400 uppercase mb-1">Join Date</span>
                             <span className="font-bold text-slate-900 text-[11px] block">{selectedUser.joinDate || 'N/A'}</span>
                          </div>
                       </div>
                    </div>

                    <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100/50">
                        <h4 className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                           <ShieldAlert size={12} /> Account Activity
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                           <div className="bg-white p-3 rounded-xl border border-indigo-50">
                              <span className="block text-[8px] font-black text-slate-400 uppercase">Referrals</span>
                              <span className="text-sm font-black text-slate-900">{selectedUser.referralsCount}</span>
                           </div>
                           <div className="bg-white p-3 rounded-xl border border-indigo-50">
                              <span className="block text-[8px] font-black text-slate-400 uppercase">Winnings</span>
                              <span className="text-sm font-black text-emerald-600">Rs {(selectedUser.totalWinnings || 0).toLocaleString()}</span>
                           </div>
                        </div>
                    </div>
                 </div>

                 {/* Wallet Actions */}
                 <div className="space-y-6">
                    <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
                       <div className="relative z-10">
                          <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                             <Wallet size={12} /> Wallet Balance
                          </p>
                          <h4 className="text-3xl md:text-4xl font-black mb-8 leading-none">Rs {(selectedUser.walletBalance || 0).toLocaleString()}</h4>
                          
                          <div className="space-y-4">
                             <div className="relative">
                               <input 
                                 type="number" 
                                 value={adjustAmount} 
                                 onChange={e => setAdjustAmount(e.target.value)} 
                                 placeholder="0.00" 
                                 className="w-full bg-white/10 border-2 border-white/10 rounded-2xl px-6 py-4 text-center font-black text-xl md:text-2xl focus:border-indigo-500 outline-none transition-all placeholder:text-white/20" 
                               />
                             </div>
                             <div className="grid grid-cols-2 gap-3">
                                <button 
                                  onClick={() => handleAdjustBalance('ADD')} 
                                  className="py-4 bg-emerald-600 hover:bg-emerald-700 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-emerald-900/20"
                                >
                                  <Plus size={16}/> Credit
                                </button>
                                <button 
                                  onClick={() => handleAdjustBalance('DEDUCT')} 
                                  className="py-4 bg-red-600 hover:bg-red-700 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-red-900/20"
                                >
                                  <Minus size={16}/> Deduct
                                </button>
                             </div>
                          </div>
                       </div>
                       <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl"></div>
                    </div>
                    
                    <button className="w-full flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-2xl group hover:bg-slate-100 transition-all">
                       <div className="flex items-center space-x-3">
                          <ShieldAlert className="text-red-500" size={18} />
                          <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Suspend Account</span>
                       </div>
                       <ChevronRight className="text-slate-300 group-hover:translate-x-1 transition-transform" size={16} />
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
