
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Wallet, AlertCircle, CheckCircle2, Ticket, CalendarDays, Clock, Info } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { Token } from '../types';

const TokenPurchasePage: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const { user, updateBalance, addTokens, lotteryPlans, tokens } = useUser();
  
  const plan = useMemo(() => lotteryPlans.find(p => p.id === planId), [lotteryPlans, planId]);
  const [selectedTokens, setSelectedTokens] = useState<number[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  // REAL-TIME SOLD TOKENS: Filter from global tokens list
  const soldTokens = useMemo(() => {
    return tokens
      .filter(t => t.planId === planId)
      .map(t => t.number);
  }, [tokens, planId]);

  if (!plan) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm inline-block">
          <AlertCircle size={48} className="text-amber-500 mx-auto mb-6" />
          <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase mb-4">Plan Not Found</h2>
          <Link to="/lotteries" className="inline-block px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs">
            Back to Lotteries
          </Link>
        </div>
      </div>
    );
  }

  const toggleToken = (num: number) => {
    if (soldTokens.includes(num)) return;
    setSelectedTokens(prev => 
      prev.includes(num) ? prev.filter(t => t !== num) : [...prev, num]
    );
  };

  const totalCost = selectedTokens.length * plan.tokenPrice;
  const canAfford = user.walletBalance >= totalCost;

  const handlePurchase = async () => {
    if (!canAfford || selectedTokens.length === 0) return;
    
    // Check again if any selected token was sold while user was deciding
    const doubleCheck = selectedTokens.some(num => soldTokens.includes(num));
    if (doubleCheck) {
      alert("Some selected tokens were just sold to another user. Please refresh your selection.");
      return;
    }

    const newTokens: Token[] = selectedTokens.map(num => ({
      id: '', // Will be set in addTokens (Firebase)
      number: num,
      planId: plan.id,
      purchaseDate: new Date().toLocaleString(),
      drawDate: plan.drawTime,
      status: 'WAITING'
    }));

    try {
      await updateBalance(-totalCost);
      await addTokens(newTokens);
      setShowSuccess(true);
      
      setTimeout(() => {
        navigate('/my-tokens');
      }, 2000);
    } catch (e) {
      alert("Purchase failed. Please try again.");
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 animate-in fade-in duration-500">
        
        {/* Navigation */}
        <Link to="/lotteries" className="inline-flex items-center text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em] mb-6 hover:underline group bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm">
          <ChevronLeft size={14} className="mr-1 group-hover:-translate-x-1 transition-transform" /> 
          Lottery List Pe Jayein
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
          
          {/* Left: Token Selection Area */}
          <div className="lg:col-span-8 order-2 lg:order-1">
            <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 border border-slate-100 shadow-sm">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 md:mb-12">
                <div>
                   <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight">Lucky Number Chunein</h2>
                   <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Available numbers are white. Sold are gray.</p>
                </div>
                
                <div className="flex gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100 w-full sm:w-auto justify-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-white border border-slate-200 rounded-sm"></div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Available</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-indigo-600 rounded-sm"></div>
                    <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">Your Selection</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-slate-200 rounded-sm"></div>
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Sold Out</span>
                  </div>
                </div>
              </div>

              {/* Responsive Token Grid */}
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 md:gap-3">
                {Array.from({ length: plan.totalTokens }, (_, i) => i + 1).map((num) => {
                  const isSold = soldTokens.includes(num);
                  const isSelected = selectedTokens.includes(num);
                  return (
                    <button
                      key={num}
                      disabled={isSold}
                      onClick={() => toggleToken(num)}
                      className={`aspect-square text-[10px] md:text-sm font-black rounded-lg md:rounded-xl transition-all border-2 flex items-center justify-center ${
                        isSold 
                          ? 'bg-slate-50 border-slate-50 text-slate-200 cursor-not-allowed opacity-40'
                          : isSelected
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg scale-105 z-10'
                            : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-400 active:scale-90 shadow-sm'
                      }`}
                    >
                      {isSold ? '✕' : num}
                    </button>
                  );
                })}
              </div>

              {/* Mobile Info Alert */}
              <div className="mt-8 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-start space-x-3 lg:hidden">
                 <Info size={16} className="text-indigo-400 flex-shrink-0 mt-0.5" />
                 <p className="text-[10px] font-bold text-indigo-700 uppercase tracking-wide leading-relaxed">
                   Real-time selection: Tokens you see available are ready to be claimed!
                 </p>
              </div>
            </div>
          </div>

          {/* Right: Plan Details & Checkout */}
          <div className="lg:col-span-4 order-1 lg:order-2 lg:sticky lg:top-24 h-fit">
            <div className="space-y-6">
              
              {/* Lottery Detail Card */}
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden group">
                {/* Image Section */}
                <div className="relative h-48 sm:h-56 lg:h-48 overflow-hidden bg-slate-100">
                  {plan.image ? (
                    <img src={plan.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={plan.name} />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-7xl bg-gradient-to-br from-indigo-50 to-slate-200">
                      {plan.icon}
                    </div>
                  )}
                  <div className={`absolute top-4 right-4 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-lg ${plan.drawCycle === 'WEEKLY' ? 'bg-indigo-600' : 'bg-pink-600'}`}>
                    {plan.drawCycle}
                  </div>
                </div>

                <div className="p-6 md:p-8 space-y-6">
                  <div>
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight leading-none mb-2">{plan.name}</h3>
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Entry Fee: Rs {plan.tokenPrice}</p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-50">
                    <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <div className="flex items-center space-x-2">
                          <Clock size={14} className="text-slate-300" />
                          <span>Draw Waqt</span>
                       </div>
                       <span className="text-slate-900">{plan.drawTime}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <div className="flex items-center space-x-2">
                          <CalendarDays size={14} className="text-slate-300" />
                          <span>Draw Din</span>
                       </div>
                       <span className="text-slate-900">{plan.drawDay}</span>
                    </div>
                  </div>

                  {/* Pricing Summary */}
                  <div className="bg-slate-50 rounded-[1.5rem] p-5 space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <span>Numbers Selected</span>
                       <span className="text-slate-900">{selectedTokens.length}</span>
                    </div>
                    <div className="h-px bg-slate-200/50"></div>
                    <div className="flex justify-between items-end">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Bill</span>
                       <span className="text-2xl md:text-3xl font-black text-indigo-600 leading-none">Rs {totalCost.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Wallet & Button Card */}
              <div className="bg-[#1a233a] rounded-[2.5rem] p-6 md:p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/10">
                    <div className="flex items-center space-x-3">
                      <Wallet size={20} className="text-emerald-400" />
                      <div>
                         <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">My Wallet</span>
                         <span className="font-black text-base">Rs {user.walletBalance.toLocaleString()}</span>
                      </div>
                    </div>
                    <Link to="/wallet" className="text-[8px] font-black bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg uppercase tracking-widest transition-all">Deposit</Link>
                  </div>

                  {!canAfford && selectedTokens.length > 0 && (
                    <div className="flex items-start space-x-3 p-4 bg-red-500/10 rounded-2xl border border-red-500/20">
                      <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="font-black text-[9px] text-red-400 uppercase tracking-widest leading-relaxed">Paisa kam hai! Please wallet recharge karein.</p>
                    </div>
                  )}

                  <button
                    onClick={handlePurchase}
                    disabled={selectedTokens.length === 0 || !canAfford || showSuccess}
                    className={`w-full py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[11px] transition-all flex items-center justify-center space-x-3 shadow-xl active:scale-95 ${
                      selectedTokens.length === 0 || !canAfford
                        ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
                    }`}
                  >
                    {showSuccess ? (
                      <>
                        <CheckCircle2 size={18} />
                        <span>Confirming...</span>
                      </>
                    ) : (
                      <>
                        <Ticket size={18} />
                        <span>Kharidein Abhi</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2"></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TokenPurchasePage;
