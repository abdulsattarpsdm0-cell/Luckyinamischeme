
import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { User as UserIcon, Mail, Phone, Lock, LogOut, Trash2, Camera, ShieldCheck, CreditCard, Gift, Users, AlertTriangle, LayoutDashboard } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, logout, deleteAccount, tokens, lotteryPlans } = useUser();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    mobile: user.mobile
  });

  const isAdmin = user.role === 'ADMIN';

  const handleSave = () => {
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm("Kya aap waqai apna account hamesha ke liye delete karna chahte hain? Ye amal wapis nahi ho sakega.");
    if (confirmDelete) {
      deleteAccount(user.id);
      alert("Aapka account delete kar diya gaya hai.");
      navigate('/login');
    }
  };

  // Calculate Real Stats
  const calculatedStats = useMemo(() => {
    // 1. Total Spent (Sum of token prices)
    const totalSpent = tokens.reduce((acc, token) => {
      const plan = lotteryPlans.find(p => p.id === token.planId);
      return acc + (plan?.tokenPrice || 0);
    }, 0);

    // 2. Tokens Won
    const tokensWon = tokens.filter(t => t.status === 'WINNER').length;

    // 3. Free Tokens Earned via Referrals
    let freeTokens = 0;
    if (user.planReferralStats) {
      Object.entries(user.planReferralStats).forEach(([planId, count]) => {
        const plan = lotteryPlans.find(p => p.id === planId);
        if (plan && plan.isReferralEnabled && plan.referralThreshold > 0) {
          // Fix: Explicitly treat 'count' as a number to avoid arithmetic operation errors in certain TypeScript environments.
          const cycles = Math.floor((count as any) / plan.referralThreshold);
          freeTokens += (cycles * plan.referralRewardCount);
        }
      });
    }

    return [
      { label: "Total Spent", value: `Rs ${totalSpent.toLocaleString()}`, icon: <CreditCard size={20} /> },
      { label: "Tokens Won", value: tokensWon.toString(), icon: <ShieldCheck size={20} /> },
      { label: "Free Tokens", value: freeTokens.toString(), icon: <Gift size={20} /> },
      { label: "Referrals", value: (user.referralsCount || 0).toString(), icon: <Users size={20} /> },
    ];
  }, [tokens, lotteryPlans, user]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in duration-500 pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: User Profile Brief */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 bg-indigo-50 rounded-[35px] flex items-center justify-center text-indigo-600 border-2 border-indigo-100">
                <UserIcon size={64} />
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-xl border-4 border-white shadow-lg">
                <Camera size={18} />
              </button>
            </div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{user.firstName} {user.lastName}</h2>
            <p className="text-indigo-600 font-bold text-sm mb-6">@{user.username}</p>
            <div className="flex items-center justify-center space-x-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest mx-auto w-fit border border-emerald-100">
              <ShieldCheck size={14} />
              <span>{isAdmin ? 'Admin Master Account' : 'Verified Account'}</span>
            </div>
            <p className="text-slate-400 text-[10px] mt-8 font-black uppercase tracking-widest">Joined: {user.joinDate || 'Jan 2024'}</p>
          </div>

          <div className="bg-white rounded-[40px] p-4 border border-slate-100 shadow-sm space-y-2">
             {isAdmin && (
               <Link 
                to="/admin" 
                className="w-full flex items-center space-x-4 px-6 py-4 rounded-3xl bg-indigo-600 text-white transition-all font-black uppercase text-xs tracking-widest group shadow-lg shadow-indigo-100 mb-2"
              >
                  <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                    <LayoutDashboard size={18} />
                  </div>
                  <span>Admin Dashboard</span>
               </Link>
             )}

             <button 
               onClick={handleLogout} 
               className="w-full flex items-center space-x-4 px-6 py-4 rounded-3xl text-slate-600 hover:bg-slate-50 transition-all font-black uppercase text-xs tracking-widest group"
             >
                <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <LogOut size={18} />
                </div>
                <span>Logout Session</span>
             </button>
             
             {!isAdmin && (
               <button 
                onClick={handleDeleteAccount}
                className="w-full flex items-center space-x-4 px-6 py-4 rounded-3xl text-red-600 hover:bg-red-50 transition-all font-black uppercase text-xs tracking-widest group"
              >
                  <div className="w-10 h-10 bg-red-50 rounded-2xl flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all">
                    <Trash2 size={18} />
                  </div>
                  <span>Delete Account</span>
               </button>
             )}
          </div>
        </div>

        {/* Right: Personal Info & Stats */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-white rounded-[40px] p-8 md:p-10 border border-slate-100 shadow-sm">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                <div>
                   <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Personal Information</h3>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Manage your account identity</p>
                </div>
                {!isEditing ? (
                  <button onClick={() => setIsEditing(true)} className="px-8 py-3 bg-indigo-50 text-indigo-600 font-black rounded-2xl text-[10px] uppercase tracking-widest transition-all hover:bg-indigo-100 active:scale-95">Edit Profile</button>
                ) : (
                  <div className="flex space-x-2">
                    <button onClick={() => setIsEditing(false)} className="px-6 py-3 text-slate-500 font-black rounded-2xl text-[10px] uppercase tracking-widest transition-all">Cancel</button>
                    <button onClick={handleSave} className="px-8 py-3 bg-indigo-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-indigo-100 active:scale-95">Save Changes</button>
                  </div>
                )}
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">First Name</label>
                   <div className="relative group">
                      <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                      <input 
                        type="text" 
                        readOnly={!isEditing}
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className={`w-full pl-14 pr-6 py-4 rounded-2xl border-2 transition-all font-bold ${isEditing ? 'border-indigo-100 focus:border-indigo-600 outline-none bg-white' : 'border-slate-50 text-slate-500 bg-slate-50 cursor-not-allowed'}`} 
                      />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Last Name</label>
                   <div className="relative group">
                      <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                      <input 
                        type="text" 
                        readOnly={!isEditing}
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className={`w-full pl-14 pr-6 py-4 rounded-2xl border-2 transition-all font-bold ${isEditing ? 'border-indigo-100 focus:border-indigo-600 outline-none bg-white' : 'border-slate-50 text-slate-500 bg-slate-50 cursor-not-allowed'}`} 
                      />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Email Address</label>
                   <div className="relative group">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                      <input 
                        type="email" 
                        readOnly={!isEditing}
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className={`w-full pl-14 pr-6 py-4 rounded-2xl border-2 transition-all font-bold ${isEditing ? 'border-indigo-100 focus:border-indigo-600 outline-none bg-white' : 'border-slate-50 text-slate-500 bg-slate-50 cursor-not-allowed'}`} 
                      />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Mobile Number</label>
                   <div className="relative group">
                      <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                      <input 
                        type="tel" 
                        readOnly={!isEditing}
                        value={formData.mobile}
                        onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                        className={`w-full pl-14 pr-6 py-4 rounded-2xl border-2 transition-all font-bold ${isEditing ? 'border-indigo-100 focus:border-indigo-600 outline-none bg-white' : 'border-slate-50 text-slate-500 bg-slate-50 cursor-not-allowed'}`} 
                      />
                   </div>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {calculatedStats.map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center group hover:bg-slate-50 transition-colors">
                 <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-4 group-hover:scale-110 transition-transform shadow-inner">
                    {stat.icon}
                 </div>
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</span>
                 <span className="text-lg font-black text-slate-900">{stat.value}</span>
              </div>
            ))}
          </div>

          <div className="bg-[#0f172a] rounded-[40px] p-8 md:p-10 text-white relative overflow-hidden shadow-2xl">
             <div className="relative z-10">
                <h3 className="text-xl md:text-2xl font-black mb-6 flex items-center space-x-3 uppercase tracking-tight">
                  <Lock className="text-amber-400" />
                  <span>Security & Pass-Key</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <input type="password" placeholder="Current Password" className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500 font-bold transition-all text-sm" />
                   <input type="password" placeholder="New Password" className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500 font-bold transition-all text-sm" />
                </div>
                <button className="mt-8 px-10 py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-black rounded-2xl transition-all shadow-xl shadow-amber-500/20 uppercase tracking-widest text-[10px] active:scale-95">
                  Update Password
                </button>
             </div>
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
             
             {/* Account Deletion Alert Box */}
             {!isAdmin && (
               <div className="mt-12 p-6 bg-red-500/10 border border-red-500/20 rounded-[2rem] flex items-start space-x-4">
                  <AlertTriangle className="text-red-400 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="text-xs font-black text-red-400 uppercase tracking-widest mb-1">Danger Zone</h4>
                    <p className="text-[10px] font-medium text-slate-400 leading-relaxed uppercase">Account delete karne se aapki tamaam winnings, tokens aur wallet balance hamesha ke liye khatam ho jayenge.</p>
                  </div>
               </div>
             )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
