
import React, { useState } from 'react';
import { Search, Filter, MoreVertical, ShieldAlert, CheckCircle2, XCircle, CreditCard, Ticket, Share2, Wallet, Plus, Minus } from 'lucide-react';

const AdminUsers: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [search, setSearch] = useState('');

  const users = [
    { id: '1', name: 'Dilbar Ali', username: 'dilbar_lucky', email: 'dilbar@lucky.com', phone: '03177730425', balance: 2500, tokens: 12, referrals: 8, status: 'ACTIVE', joinDate: '2024-01-12' },
    { id: '2', name: 'Zaid Ahmed', username: 'zaid_king', email: 'zaid@gmail.com', phone: '03001234567', balance: 500, tokens: 3, referrals: 2, status: 'ACTIVE', joinDate: '2024-02-05' },
    { id: '3', name: 'Sara Khan', username: 'sara_win', email: 'sara@outlook.com', phone: '03459876543', balance: 12000, tokens: 45, referrals: 24, status: 'ACTIVE', joinDate: '2024-01-15' },
    { id: '4', name: 'Irfan Malik', username: 'irfan_m', email: 'irfan@malik.com', phone: '03211122334', balance: 0, tokens: 0, referrals: 0, status: 'BANNED', joinDate: '2024-03-01' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">User Management</h1>
          <p className="text-slate-500 font-medium">Control accounts, adjust balances, and track activity.</p>
        </div>
        
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, email..." 
              className="w-full md:w-80 pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="p-3.5 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:bg-slate-50 transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                <th className="py-5 px-8">User Profile</th>
                <th className="py-5 px-6">Account Details</th>
                <th className="py-5 px-6">Balance</th>
                <th className="py-5 px-6">Stats</th>
                <th className="py-5 px-6 text-right">Status</th>
                <th className="py-5 px-8 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => setSelectedUser(user)}>
                  <td className="py-6 px-8">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-lg border border-indigo-100">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <span className="block font-black text-slate-900 text-sm uppercase">{user.name}</span>
                        <span className="text-[10px] text-indigo-600 font-black uppercase">@{user.username}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-xs font-bold text-slate-600">
                        <ShieldAlert size={12} className="text-slate-300" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-[10px] font-black text-slate-400">
                        <CreditCard size={12} />
                        <span>{user.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-6">
                    <span className="block font-black text-slate-900 text-base">PKR {user.balance.toLocaleString()}</span>
                  </td>
                  <td className="py-6 px-6">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <span className="block text-xs font-black text-slate-900">{user.tokens}</span>
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Tokens</span>
                      </div>
                      <div className="text-center">
                        <span className="block text-xs font-black text-slate-900">{user.referrals}</span>
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Refs</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-6 text-right">
                    <span className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      user.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {user.status === 'ACTIVE' ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                      <span>{user.status}</span>
                    </span>
                  </td>
                  <td className="py-6 px-8 text-right">
                    <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-all">
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
           <div className="bg-white w-full max-w-4xl rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300 max-h-[90vh] flex flex-col">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                 <div className="flex items-center space-x-5">
                    <div className="w-16 h-16 bg-indigo-600 text-white rounded-[1.5rem] flex items-center justify-center font-black text-2xl">
                      {selectedUser.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 uppercase">{selectedUser.name}</h3>
                      <p className="text-xs font-black text-indigo-600 uppercase tracking-widest">User Details Control</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedUser(null)} className="p-3 text-slate-400 hover:bg-slate-100 rounded-2xl transition-all">
                   <XCircle size={24} />
                 </button>
              </div>

              <div className="flex-grow overflow-y-auto p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                 {/* Left Column: Personal & Stats */}
                 <div className="space-y-8">
                    <section className="space-y-4">
                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">Profile Info</h4>
                       <div className="grid grid-cols-2 gap-6">
                          <div>
                             <span className="block text-[9px] font-black text-slate-400 uppercase mb-1">Username</span>
                             <span className="font-bold text-slate-900">@{selectedUser.username}</span>
                          </div>
                          <div>
                             <span className="block text-[9px] font-black text-slate-400 uppercase mb-1">Join Date</span>
                             <span className="font-bold text-slate-900">{selectedUser.joinDate}</span>
                          </div>
                       </div>
                    </section>

                    <section className="space-y-4">
                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">Summary Statistics</h4>
                       <div className="grid grid-cols-3 gap-4">
                          <div className="bg-slate-50 p-4 rounded-2xl text-center">
                             <Ticket size={20} className="mx-auto text-indigo-500 mb-2" />
                             <span className="block text-lg font-black text-slate-900">{selectedUser.tokens}</span>
                             <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Tokens</span>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-2xl text-center">
                             <Share2 size={20} className="mx-auto text-emerald-500 mb-2" />
                             <span className="block text-lg font-black text-slate-900">{selectedUser.referrals}</span>
                             <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Refs</span>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-2xl text-center">
                             <CreditCard size={20} className="mx-auto text-amber-500 mb-2" />
                             <span className="block text-lg font-black text-slate-900">14</span>
                             <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Draws</span>
                          </div>
                       </div>
                    </section>
                 </div>

                 {/* Right Column: Wallet Actions */}
                 <div className="space-y-8">
                    <section className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl">
                       <div className="flex justify-between items-center mb-6">
                          <div>
                             <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Available Balance</p>
                             <h4 className="text-3xl font-black">PKR {selectedUser.balance.toLocaleString()}</h4>
                          </div>
                          <Wallet size={32} className="text-white/20" />
                       </div>

                       <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-3">
                             <button className="flex items-center justify-center space-x-2 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-xs font-black uppercase transition-all">
                                <Plus size={16} />
                                <span>Add Fund</span>
                             </button>
                             <button className="flex items-center justify-center space-x-2 py-3 bg-red-600 hover:bg-red-700 rounded-xl text-xs font-black uppercase transition-all">
                                <Minus size={16} />
                                <span>Deduct</span>
                             </button>
                          </div>
                          <input 
                            type="number" 
                            placeholder="Enter amount to adjust..." 
                            className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-white/20 text-sm font-bold placeholder:text-white/20"
                          />
                       </div>
                    </section>

                    <section className="space-y-4">
                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">Account Status</h4>
                       <div className="flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100">
                          <div className="flex items-center space-x-3 text-red-700">
                             <ShieldAlert size={20} />
                             <span className="text-xs font-black uppercase tracking-tight">Access Suspension</span>
                          </div>
                          <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-[10px] font-black uppercase rounded-xl transition-all shadow-lg shadow-red-600/20">
                             Block User
                          </button>
                       </div>
                    </section>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
