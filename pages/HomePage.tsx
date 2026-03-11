
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext.ts';
import { 
  Trophy, 
  Ticket, 
  Wallet, 
  Sparkles, 
  ChevronRight, 
  TrendingUp,
  Clock,
  LayoutDashboard,
  Zap,
  ArrowDownCircle,
  MousePointer2,
  CheckCircle2,
  Percent,
  HeartHandshake,
  ShieldCheck,
  Smartphone,
  CalendarDays,
  Hash,
  UserPlus,
  Users,
  ShieldAlert,
  Cpu,
  RefreshCw,
  HelpCircle,
  Info
} from 'lucide-react';

const HomePage: React.FC = () => {
  const { user, tokens, lotteryPlans, isLoggedIn } = useUser();
  const [currentSlide, setCurrentSlide] = useState(0);

  // ONLY SHOW ACTIVE PLANS ON USER FRONTEND
  const activePlans = useMemo(() => lotteryPlans.filter(p => p.isActive), [lotteryPlans]);

  const nextSlide = () => {
    if (activePlans.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % activePlans.length);
  };
  
  useEffect(() => {
    if (activePlans.length > 0) {
      const timer = setInterval(nextSlide, 6000);
      return () => clearInterval(timer);
    }
  }, [activePlans.length]);

  return (
    <div className="pb-20 bg-[#f8fafc]">
      {/* 1. Header Section */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100">
                  <LayoutDashboard size={28} />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Welcome, {user.firstName}! 👋</h1>
                  <p className="text-[10px] md:text-sm font-bold text-slate-400 uppercase tracking-widest">Aapka Luck aaj kahan hai?</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
                  <Sparkles size={28} />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none">Lucky Inami Scheme</h1>
                  <p className="text-[10px] md:text-sm font-bold text-indigo-600 uppercase tracking-widest mt-1">Har Dil Jeetay Ga Inam!</p>
                </div>
              </div>
            )}

            {isLoggedIn ? (
              <div className="grid grid-cols-3 gap-2 md:gap-6 bg-slate-50 p-3 md:p-4 rounded-3xl border border-slate-100">
                <div className="text-center px-1 md:px-4">
                  <span className="block text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Balance</span>
                  <span className="text-xs md:text-lg font-black text-emerald-600">Rs {user.walletBalance.toLocaleString()}</span>
                </div>
                <div className="w-px bg-slate-200 h-full"></div>
                <div className="text-center px-1 md:px-4">
                  <span className="block text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tokens</span>
                  <span className="text-xs md:text-lg font-black text-indigo-600">{tokens.length}</span>
                </div>
                <div className="w-px bg-slate-200 h-full hidden md:block"></div>
                <div className="text-center px-1 md:px-4 hidden md:block">
                  <span className="block text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Winnings</span>
                  <span className="text-xs md:text-lg font-black text-amber-500">Rs {user.totalWinnings.toLocaleString()}</span>
                </div>
              </div>
            ) : (
              <div className="flex space-x-3">
                 <Link to="/signup" className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-100 active:scale-95">
                    <UserPlus size={16} />
                    <span>Get Started</span>
                 </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. Slider */}
      <section className="mt-6 md:mt-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative min-h-[480px] md:h-[500px] bg-[#0f172a] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl group flex flex-col">
            
            {activePlans.length > 0 ? activePlans.map((plan, index) => (
              <div
                key={plan.id}
                className={`absolute inset-0 transition-all duration-700 ease-in-out flex flex-col lg:flex-row items-center justify-center lg:justify-start ${
                  index === currentSlide ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0 pointer-events-none'
                }`}
              >
                <div className="absolute inset-0 z-0">
                  {plan.image ? (
                    <img src={plan.image} className="w-full h-full object-cover opacity-30" alt={plan.name} />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${plan.bgClass} opacity-20`}></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/40 to-transparent"></div>
                </div>
                
                <div className="relative z-10 w-full h-full flex flex-col lg:flex-row items-center px-6 md:px-16 py-12 md:py-0">
                  <div className="w-full lg:w-3/5 text-center lg:text-left space-y-4 md:space-y-6">
                    <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] animate-in slide-in-from-left duration-500`}>
                      <Sparkles size={12} />
                      <span>{plan.drawCycle} SUPER DRAW</span>
                    </div>
                    
                    <div className="animate-in slide-in-from-bottom-4 duration-700 delay-100">
                      <h2 className="text-4xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter uppercase">
                        {plan.name} <br />
                        <span className="text-indigo-400">JACKPOT</span>
                      </h2>
                    </div>
                    
                    <div className="animate-in slide-in-from-bottom-4 duration-700 delay-200">
                       <p className="text-base md:text-xl text-slate-300 font-bold leading-relaxed max-w-md mx-auto lg:mx-0">
                        First Prize: <span className="text-emerald-400 font-black">{plan.prizeName || `Rs ${plan.prizePerWinner.toLocaleString()}`}</span>
                      </p>
                      <p className="text-[10px] md:text-xs text-slate-500 uppercase font-black tracking-widest mt-2">
                        Next Draw: {plan.drawTime}
                      </p>
                    </div>
                    
                    <div className="pt-6 md:pt-8 animate-in slide-in-from-bottom-4 duration-700 delay-300">
                      <Link
                        to={isLoggedIn ? `/buy/${plan.id}` : "/login"}
                        className="inline-flex items-center justify-center w-full sm:w-auto px-10 py-5 rounded-[1.5rem] md:rounded-[2rem] bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm shadow-xl shadow-indigo-600/30 transition-all transform hover:scale-105 active:scale-95 space-x-3 uppercase tracking-widest"
                      >
                        <span>{isLoggedIn ? 'Join Now' : 'Login to Play'}</span>
                        <ChevronRight size={20} />
                      </Link>
                    </div>
                  </div>

                  <div className="hidden lg:flex w-2/5 justify-center items-center animate-in zoom-in duration-1000 delay-200">
                    <div className="relative group/icon">
                      <div className="absolute inset-0 bg-indigo-600/20 blur-[100px] rounded-full"></div>
                      <div className="relative w-64 h-64 md:w-80 md:h-80 bg-white/5 backdrop-blur-xl rounded-[3rem] md:rounded-[4rem] border border-white/10 flex items-center justify-center rotate-6 transform shadow-2xl transition-transform group-hover/icon:rotate-0">
                         {plan.image ? (
                           <img src={plan.image} className="w-full h-full object-cover rounded-[inherit] -rotate-6 group-hover/icon:rotate-0 transition-transform" alt="Icon" />
                         ) : (
                           <div className="text-8xl md:text-9xl drop-shadow-2xl -rotate-6 group-hover/icon:rotate-0 transition-transform">{plan.icon}</div>
                         )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
                 <CalendarDays size={48} className="opacity-20" />
                 <p className="font-black uppercase tracking-[0.3em] text-xs">No Active Draws Found</p>
              </div>
            )}

            {activePlans.length > 1 && (
              <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center space-x-3">
                {activePlans.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i === currentSlide ? 'w-8 bg-indigo-500' : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                  ></button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. Lotteries Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pb-12">
        <div className="flex justify-between items-end mb-10 text-center md:text-left">
          <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Active Lotteries</h2>
            <p className="text-sm font-medium text-slate-500">Pick a plan and try your luck for the next big draw.</p>
          </div>
          <Link to="/lotteries" className="hidden sm:flex text-xs font-black text-indigo-600 uppercase tracking-[0.2em] items-center hover:underline">
            View All Plans <ChevronRight size={14} className="ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activePlans.map((plan) => {
            const soldCount = tokens.filter(t => t.planId === plan.id).length;
            const percentage = Math.round((soldCount / plan.totalTokens) * 100);

            return (
              <div key={plan.id} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-2xl hover:border-indigo-100 group">
                <div className="relative h-48 overflow-hidden">
                  {plan.image ? (
                    <img src={plan.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={plan.name} />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-500 bg-slate-50">
                      {plan.icon}
                    </div>
                  )}
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest text-white shadow-lg z-10 ${plan.drawCycle === 'WEEKLY' ? 'bg-indigo-600' : 'bg-pink-600'}`}>
                     {plan.drawCycle}
                  </div>
                  
                  <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-[8px] font-black uppercase tracking-widest text-white border border-white/10 shadow-lg">
                     Total {plan.totalTokens} Tokens
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{plan.name}</h3>
                    <div className="text-right">
                      <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Inami Item</span>
                      <span className="text-sm font-black text-indigo-600">{plan.prizeName || `Rs ${plan.prizePerWinner.toLocaleString()}`}</span>
                    </div>
                  </div>

                  {/* PERCENTAGE PROGRESS BAR */}
                  <div className="mb-8 space-y-2">
                    <div className="flex justify-between items-end">
                       <div className="flex items-center space-x-1.5 text-slate-400">
                          <Users size={12} />
                          <span className="text-[9px] font-black uppercase tracking-widest">Filling Fast</span>
                       </div>
                       <span className={`text-[10px] font-black uppercase tracking-widest ${percentage > 80 ? 'text-red-600' : 'text-indigo-600'}`}>
                         {percentage}% Sold
                       </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner p-0.5">
                       <div 
                        className={`h-full rounded-full transition-all duration-1000 shadow-sm ${percentage > 80 ? 'bg-red-500 shadow-red-200' : 'bg-indigo-600 shadow-indigo-200'}`} 
                        style={{ width: `${percentage}%` }}
                       ></div>
                    </div>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest text-center italic">
                       {soldCount} used / {plan.totalTokens - soldCount} spots left
                    </p>
                  </div>

                  <div className="space-y-3 mb-8">
                    <div className="flex justify-between items-center text-[11px] font-bold text-slate-500">
                      <div className="flex items-center space-x-2">
                          <Wallet size={14} className="text-slate-300" />
                          <span className="uppercase tracking-widest">Entry Fee</span>
                      </div>
                      <span className="font-black text-slate-900">PKR {plan.tokenPrice}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-[11px] font-bold text-slate-500">
                      <div className="flex items-center space-x-2">
                          <Hash size={14} className="text-slate-300" />
                          <span className="uppercase tracking-widest">Total Numbers</span>
                      </div>
                      <span className="text-indigo-600 font-black">{plan.totalTokens.toLocaleString()} Spots</span>
                    </div>

                    <div className="flex justify-between items-center text-[11px] font-bold text-slate-500">
                      <div className="flex items-center space-x-2">
                          <Clock size={14} className="text-slate-300" />
                          <span className="uppercase tracking-widest">Next Draw</span>
                      </div>
                      <span className="text-slate-900 font-black">{plan.drawTime}</span>
                    </div>
                  </div>

                  <Link
                    to={isLoggedIn ? `/buy/${plan.id}` : "/login"}
                    className="w-full py-4 bg-[#1a233a] hover:bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center space-x-2 transition-all shadow-xl shadow-slate-900/10 active:scale-95 mt-auto"
                  >
                    <Ticket size={16} />
                    <span>{isLoggedIn ? 'Buy Tickets' : 'Login to Buy'}</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* NEW: ABOUT US FEATURES SECTION */}
      <section className="bg-slate-900 py-20 mt-16 overflow-hidden relative">
         <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
         
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
               <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                  <ShieldCheck size={14} />
                  <span>Trusted Platform</span>
               </div>
               <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">Lucky Inami Khususiyat</h2>
               <p className="text-slate-400 mt-4 max-w-2xl mx-auto font-medium">Humara platform 100% transparent aur automatic hai taake har user ko barabar ka moka milay.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                  { title: 'Real-time System', urdu: 'Fouri Updates', desc: 'Har token purchase aur wallet deposit fori taur par update hota hai.', icon: <RefreshCw size={32} /> },
                  { title: 'Fair & Transparent', urdu: 'Saaf aur Shaffaf', desc: 'Winner selection automatic random system ke zariye ki jati hai.', icon: <Cpu size={32} /> },
                  { title: 'Fast Payouts', urdu: 'Asan Nikalna', desc: 'Winnings fori taur par apke wallet mein credit ki jati hain.', icon: <Zap size={32} /> }
               ].map((feature, i) => (
                  <div key={i} className="bg-white/5 backdrop-blur-xl p-10 rounded-[3rem] border border-white/10 hover:bg-white/10 transition-all group">
                     <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-8 shadow-xl group-hover:scale-110 transition-transform">
                        {feature.icon}
                     </div>
                     <h3 className="text-xl font-black text-white uppercase tracking-tight mb-1">{feature.title}</h3>
                     <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">{feature.urdu}</p>
                     <p className="text-sm text-slate-400 leading-relaxed font-medium">{feature.desc}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* NEW: CHARGES & TRANSPARENCY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
         <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row items-stretch">
            <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-center bg-slate-50">
               <div className="inline-flex items-center space-x-2 text-indigo-600 mb-6">
                  <Info size={24} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Pricing Transparency</span>
               </div>
               <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-6 leading-tight">Service Charges <br/>Aur Fee Details</h2>
               <p className="text-slate-500 font-medium leading-relaxed mb-8">Humari fees platform ko maintain karne aur real-time notifications service ke liye istimal hoti hain. Hum koi hidden charges nahi letay.</p>
               
               <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-white rounded-2xl border border-slate-100">
                     <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                        <Percent size={20} />
                     </div>
                     <div>
                        <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Deposit Fee</span>
                        <span className="font-black text-slate-900 uppercase">10% Processing Fee</span>
                     </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-white rounded-2xl border border-slate-100">
                     <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
                        <Percent size={20} />
                     </div>
                     <div>
                        <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Withdrawal Fee</span>
                        <span className="font-black text-slate-900 uppercase">10% Processing Fee</span>
                     </div>
                  </div>
               </div>
            </div>
            
            <div className="md:w-1/2 p-10 md:p-16 bg-indigo-600 text-white flex flex-col justify-center">
               <div className="bg-white/10 p-8 rounded-[2rem] border border-white/10 relative overflow-hidden">
                  <div className="relative z-10">
                     <HelpCircle size={32} className="text-indigo-200 mb-6" />
                     <h4 className="text-xl font-black uppercase tracking-tight mb-4">Ye Fees Kyun Li Jati Hai?</h4>
                     <ul className="space-y-4 text-sm font-medium text-indigo-50">
                        <li className="flex items-start space-x-3">
                           <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <CheckCircle2 size={12} />
                           </div>
                           <span>Secure Gateway payment processors ko handle karne ke liye.</span>
                        </li>
                        <li className="flex items-start space-x-3">
                           <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <CheckCircle2 size={12} />
                           </div>
                           <span>Draw notifications aur real-time database support ke liye.</span>
                        </li>
                        <li className="flex items-start space-x-3">
                           <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <CheckCircle2 size={12} />
                           </div>
                           <span>Dedicated 24/7 server hosting aur security monitoring ke liye.</span>
                        </li>
                     </ul>
                  </div>
                  <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
               </div>
            </div>
         </div>
      </section>

      {/* Guide Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 py-16 bg-white rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="relative z-10 text-center mb-16">
           <h2 className="text-2xl md:text-4xl font-black text-slate-900 uppercase tracking-tight mb-4">Kaise Start Karein?</h2>
           <p className="text-sm font-medium text-slate-500 max-w-xl mx-auto">Hamara platform istimal karna nihayat asan hai.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          {[
            { step: '01', title: 'Add Funds', urdu: 'Wallet Mein Paise Dalein', desc: 'EasyPaisa/JazzCash se payment karein aur proof upload karein.', icon: <ArrowDownCircle size={32} />, color: 'bg-indigo-600', link: '/wallet' },
            { step: '02', title: 'Select Plan', urdu: 'Apna Plan Choose Karein', desc: 'Weekly ya Monthly mein se apni pasand ka plan select karein.', icon: <MousePointer2 size={32} />, color: 'bg-emerald-500', link: '/lotteries' },
            { step: '03', title: 'Buy Tokens', urdu: 'Tokens Kharidein', desc: 'Apne pasandida numbers select karein aur confirm karein.', icon: <Ticket size={32} />, color: 'bg-amber-500', link: '/lotteries' },
            { step: '04', title: 'Live Draw', urdu: 'Result Ka Intezar', desc: 'Winners list mein apna naam check karein.', icon: <CheckCircle2 size={32} />, color: 'bg-pink-500', link: '/winners' }
          ].map((item, i) => (
            <div key={i} className="group flex flex-col items-center text-center p-8 rounded-[2rem] hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
               <div className="relative mb-8">
                  <div className={`${item.color} w-20 h-20 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl transform transition-transform group-hover:rotate-12 group-hover:scale-110`}>
                    {item.icon}
                  </div>
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-black text-xs border-2 border-white">
                    {item.step}
                  </div>
               </div>
               <h4 className="text-xl font-black text-slate-900 mb-1 uppercase tracking-tight">{item.title}</h4>
               <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-4">{item.urdu}</p>
               <p className="text-sm font-medium text-slate-500 leading-relaxed mb-6 flex-grow">{item.desc}</p>
               <Link to={item.link} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 flex items-center">
                 Explore Now <ChevronRight size={14} className="ml-1" />
               </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
