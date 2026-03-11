
import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../context/UserContext';
import { Wallet, History, Filter, AlertCircle, X, Plus, Minus, CreditCard, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, XCircle, Upload, Image as ImageIcon } from 'lucide-react';
import { Transaction } from '../types';

const WalletPage: React.FC = () => {
  const { user, transactions, addTransaction, updateBalance, paymentMethods } = useUser();
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [selectedMethodId, setSelectedMethodId] = useState<string>(paymentMethods[0]?.id || '');
  const [amount, setAmount] = useState('');
  const [txId, setTxId] = useState('');
  const [accNum, setAccNum] = useState('');
  const [accName, setAccName] = useState('');
  const [proofImage, setProofImage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeMethods = paymentMethods.filter(m => m.status === 'ACTIVE');
  const currentMethod = paymentMethods.find(m => m.id === selectedMethodId);

  useEffect(() => {
    if (showDeposit || showWithdraw) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [showDeposit, showWithdraw]);

  useEffect(() => {
    if (activeMethods.length > 0 && !selectedMethodId) {
      setSelectedMethodId(activeMethods[0].id);
    }
  }, [activeMethods]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const processingFee = amount ? parseFloat(amount) * 0.1 : 0;
  const receiveAmount = amount ? parseFloat(amount) - processingFee : 0;

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMethod) return;
    if (!proofImage) return alert("Please upload payment screenshot/proof!");

    const newTx: Transaction = {
      id: 'tx_' + Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleString(),
      type: 'DEPOSIT',
      amount: parseFloat(amount),
      charges: processingFee,
      netAmount: receiveAmount,
      status: 'PENDING',
      method: currentMethod.name as any,
      proofImage: proofImage,
      username: user.username,
      txId: txId
    };
    addTransaction(newTx);
    setShowDeposit(false);
    setAmount('');
    setTxId('');
    setProofImage('');
    alert("Deposit request sent! Admin will verify and approve your funds soon.");
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMethod) return;

    const val = parseFloat(amount);
    if (val > user.walletBalance) return alert("Insufficient balance");
    
    const newTx: Transaction = {
      id: 'tx_' + Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleString(),
      type: 'WITHDRAWAL',
      amount: val,
      charges: processingFee,
      netAmount: receiveAmount,
      status: 'PENDING',
      method: currentMethod.name as any,
      accountNumber: accNum,
      accountName: accName,
      username: user.username
    };
    addTransaction(newTx);
    updateBalance(-val);
    setShowWithdraw(false);
    setAmount('');
    setAccNum('');
    setAccName('');
    alert("Withdrawal request submitted! Payout will be processed within 24 hours.");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-black text-[#1a233a] mb-3 uppercase tracking-tight">My Wallet</h1>
          <p className="text-slate-500 font-medium text-sm md:text-lg">Manage your funds and track every transaction with precision.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gradient-to-br from-[#1a233a] to-[#2d3748] rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden group transition-all hover:scale-[1.02]">
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-10">
                  <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 shadow-inner">
                    <Wallet size={28} className="text-indigo-300" />
                  </div>
                  <div className="flex items-center space-x-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                    <span>Live Balance</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 text-[11px] font-black uppercase tracking-[0.25em] block">Available Funds</span>
                  <div className="text-4xl md:text-6xl font-black tracking-tighter">Rs {user.walletBalance.toLocaleString()}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              <button onClick={() => setShowDeposit(true)} className="flex flex-col md:flex-row items-center justify-center md:justify-start md:space-x-4 bg-emerald-600 hover:bg-emerald-700 p-6 md:p-8 rounded-[2.25rem] text-white transition-all transform hover:-translate-y-1 shadow-xl shadow-emerald-600/20 active:scale-95 group">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-3 md:mb-0 group-hover:rotate-12 transition-transform"><ArrowUpRight size={24} /></div>
                <div className="text-center md:text-left">
                  <h3 className="text-lg md:text-xl font-black uppercase leading-none">Deposit</h3>
                  <p className="hidden md:block text-emerald-100/60 font-bold text-[9px] uppercase tracking-widest mt-1">Add Money Instantly</p>
                </div>
              </button>
              <button onClick={() => setShowWithdraw(true)} className="flex flex-col md:flex-row items-center justify-center md:justify-start md:space-x-4 bg-[#1a233a] hover:bg-slate-800 p-6 md:p-8 rounded-[2.25rem] text-white transition-all transform hover:-translate-y-1 shadow-xl shadow-slate-900/20 active:scale-95 group">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-3 md:mb-0 group-hover:-rotate-12 transition-transform"><ArrowDownLeft size={24} /></div>
                <div className="text-center md:text-left">
                  <h3 className="text-lg md:text-xl font-black uppercase leading-none">Withdraw</h3>
                  <p className="hidden md:block text-slate-400 font-bold text-[9px] uppercase tracking-widest mt-1">Cash Out Your Winnings</p>
                </div>
              </button>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
              <div className="p-6 md:p-10 border-b border-slate-50 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><History size={20} /></div>
                  <div>
                    <h3 className="text-xl font-black text-[#1a233a] uppercase tracking-tight">Recent Activity</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">History of your funds</p>
                  </div>
                </div>
              </div>

              <div className="flex-grow">
                {transactions.length === 0 ? (
                  <div className="text-center py-24 px-6">
                    <History className="text-slate-200 mx-auto mb-6" size={40} />
                    <h4 className="text-slate-900 font-black uppercase text-sm mb-2">No Transactions Found</h4>
                    <p className="text-slate-400 text-xs font-medium max-w-xs mx-auto">Your wallet activity will appear here.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50/50">
                        <tr className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                          <th className="py-5 px-10">Transaction</th>
                          <th className="py-5 px-6">Details</th>
                          <th className="py-5 px-6 text-right">Amount</th>
                          <th className="py-5 px-10 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {transactions.map((tx) => (
                          <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-6 px-10">
                              <div className="flex items-center space-x-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'DEPOSIT' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-900'}`}>
                                  {tx.type === 'DEPOSIT' ? <Plus size={18} /> : <Minus size={18} />}
                                </div>
                                <div>
                                  <span className="block font-black text-[#1a233a] text-sm uppercase">{tx.type}</span>
                                  <span className="text-[9px] text-slate-400 font-bold uppercase">{tx.date}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-6 px-6">
                               <div className="flex flex-col">
                                 <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{tx.method}</span>
                                 <span className="text-[9px] font-bold text-slate-400">{tx.id.slice(0, 12)}</span>
                               </div>
                            </td>
                            <td className="py-6 px-6 text-right font-black text-slate-900">
                               Rs {tx.amount.toLocaleString()}
                            </td>
                            <td className="py-6 px-10 text-right">
                              <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${tx.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : tx.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                                {tx.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDeposit && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 bg-[#0f172a]/90 backdrop-blur-md">
           <div className="bg-white w-full max-w-2xl md:rounded-[3rem] rounded-t-[3rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom md:zoom-in duration-300 max-h-[95vh] flex flex-col">
             <div className="p-8 md:p-10 border-b border-slate-50 flex justify-between items-center bg-[#f8fafc]/50">
               <div>
                 <h3 className="text-2xl md:text-3xl font-black text-[#1a233a] uppercase tracking-tight">Add Funds</h3>
                 <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-2">Fund your account instantly</p>
               </div>
               <button onClick={() => setShowDeposit(false)} className="w-12 h-12 flex items-center justify-center text-slate-400 hover:bg-slate-100 rounded-2xl transition-all"><X size={24} /></button>
             </div>
             
             <form onSubmit={handleDeposit} className="p-8 md:p-10 overflow-y-auto space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  {activeMethods.map((m) => (
                    <button key={m.id} type="button" onClick={() => setSelectedMethodId(m.id)} className={`p-6 rounded-3xl border-2 font-black transition-all flex flex-col items-center space-y-2 ${selectedMethodId === m.id ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-lg' : 'border-slate-100 text-slate-400 grayscale'}`}>
                      <CreditCard size={24} />
                      <span className="uppercase text-[10px] tracking-widest">{m.name}</span>
                    </button>
                  ))}
                </div>

                {currentMethod && (
                  <div className="bg-[#1a233a] rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl">
                    <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-3">Account Number ({currentMethod.name})</p>
                    <p className="text-3xl md:text-4xl font-black mb-1 tracking-tight">{currentMethod.number}</p>
                    <p className="text-xs font-bold text-emerald-400 uppercase">{currentMethod.title}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 block">Amount (Rs)</label>
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Min. 300" className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-600 outline-none font-black text-xl" required min="300" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 block">Transaction ID</label>
                    <input type="text" value={txId} onChange={(e) => setTxId(e.target.value)} placeholder="Enter TXID" className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-600 outline-none font-bold bg-slate-50" required />
                  </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 block">Upload Payment Screenshot</label>
                   <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer ${proofImage ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-indigo-500 hover:bg-slate-50'}`}
                   >
                     {proofImage ? (
                        <div className="flex flex-col items-center space-y-2">
                           <div className="w-20 h-20 rounded-xl overflow-hidden shadow-md">
                              <img src={proofImage} className="w-full h-full object-cover" alt="Proof" />
                           </div>
                           <span className="text-[10px] font-black text-emerald-600 uppercase">Proof Attached! Tap to change</span>
                        </div>
                     ) : (
                       <>
                         <Upload size={32} className="text-slate-300 mb-3" />
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Click to select screenshot</span>
                       </>
                     )}
                   </div>
                   <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                </div>

                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex justify-between items-center text-[11px] font-black uppercase text-slate-500 tracking-widest">
                   <div>
                     <span className="block opacity-60 text-[9px]">Fee (10%)</span>
                     <span className="text-slate-900 text-base">Rs {processingFee.toLocaleString()}</span>
                   </div>
                   <div className="text-right">
                     <span className="block opacity-60 text-[9px]">Net Added</span>
                     <span className="text-indigo-600 text-base font-black">Rs {receiveAmount.toLocaleString()}</span>
                   </div>
                </div>

                <button type="submit" className="w-full py-6 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-3xl shadow-2xl shadow-emerald-600/30 transition-all uppercase tracking-[0.2em] text-sm active:scale-95">
                  Complete Deposit
                </button>
             </form>
           </div>
        </div>
      )}

      {showWithdraw && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 bg-[#0f172a]/90 backdrop-blur-md">
           <div className="bg-white w-full max-w-xl md:rounded-[3rem] rounded-t-[3rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom md:zoom-in duration-300 max-h-[95vh] flex flex-col">
             <div className="p-8 md:p-10 border-b border-slate-50 flex justify-between items-center bg-[#f8fafc]/50">
               <div>
                 <h3 className="text-2xl md:text-3xl font-black text-[#1a233a] uppercase tracking-tight">Withdraw</h3>
                 <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-2">Payout your winnings</p>
               </div>
               <button onClick={() => setShowWithdraw(false)} className="w-12 h-12 flex items-center justify-center text-slate-400 hover:bg-slate-100 rounded-2xl transition-all"><X size={24} /></button>
             </div>

             <form onSubmit={handleWithdraw} className="p-8 md:p-10 overflow-y-auto space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  {activeMethods.map((m) => (
                    <button key={m.id} type="button" onClick={() => setSelectedMethodId(m.id)} className={`p-6 rounded-3xl border-2 font-black transition-all flex flex-col items-center space-y-2 ${selectedMethodId === m.id ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-lg' : 'border-slate-100 text-slate-400 grayscale'}`}>
                      <CreditCard size={24} />
                      <span className="uppercase text-[10px] tracking-widest">{m.name}</span>
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Withdraw Amount</label>
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Min. 500" className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-600 outline-none font-black text-xl" required min="500" max={user.walletBalance} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Receiver Account #</label>
                      <input type="text" value={accNum} onChange={(e) => setAccNum(e.target.value)} placeholder="03XXXXXXXXX" className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-600 outline-none font-bold" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Account Title</label>
                      <input type="text" value={accName} onChange={(e) => setAccName(e.target.value)} placeholder="Enter Name" className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-600 outline-none font-bold" required />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex justify-between items-center text-[11px] font-black uppercase text-slate-500 tracking-widest">
                    <div className="space-y-1">
                      <span className="block opacity-60 text-[9px]">Processing Fee</span>
                      <span className="text-slate-900 text-base">Rs {processingFee.toLocaleString()}</span>
                    </div>
                    <div className="text-right">
                      <span className="block opacity-60 text-[9px]">Will Receive</span>
                      <span className="text-indigo-600 text-base font-black">Rs {receiveAmount.toLocaleString()}</span>
                    </div>
                  </div>

                <button type="submit" className="w-full py-6 bg-[#1a233a] hover:bg-slate-800 text-white font-black rounded-3xl shadow-2xl transition-all uppercase tracking-[0.2em] text-sm active:scale-95">
                  Request Payout
                </button>
             </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default WalletPage;
