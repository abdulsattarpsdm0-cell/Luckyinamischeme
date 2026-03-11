
import React, { useState, useRef } from 'react';
import { Plus, Edit3, Trash2, Ticket, Trophy, Clock, PlayCircle, StopCircle, Eye, X, Share2, ToggleLeft, ToggleRight, CalendarDays, Calendar, Info, Image as ImageIcon, Upload, Trash, Power } from 'lucide-react';
import { useUser } from '../../context/UserContext.ts';
import { PlanType, LotteryPlan, DrawCycle } from '../../types.ts';

const AdminLottery: React.FC = () => {
  const { lotteryPlans, addLottery, deleteLottery, updateLottery, tokens: allTokens } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [drawHour, setDrawHour] = useState('04:00 PM');

  const [formData, setFormData] = useState<Partial<LotteryPlan>>({
    name: '',
    tokenPrice: 0,
    totalTokens: 200,
    totalWinners: 10,
    prizePerWinner: 0,
    prizeName: '',
    drawTime: '',
    drawDay: 'Sunday',
    drawCycle: 'WEEKLY',
    icon: '🎟️',
    image: '',
    colorClass: 'text-indigo-600',
    bgClass: 'from-indigo-100 to-indigo-300',
    referralThreshold: 10,
    referralRewardCount: 1,
    isReferralEnabled: true,
    isActive: true
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormData({
      name: '',
      tokenPrice: 0,
      totalTokens: 200,
      totalWinners: 10,
      prizePerWinner: 0,
      prizeName: '',
      drawDay: 'Sunday',
      drawCycle: 'WEEKLY',
      icon: '🎟️',
      image: '',
      colorClass: 'text-indigo-600',
      bgClass: 'from-indigo-100 to-indigo-300',
      referralThreshold: 10,
      referralRewardCount: 1,
      isReferralEnabled: true,
      isActive: true
    });
    setDrawHour('04:00 PM');
    setShowModal(true);
  };

  const handleOpenEdit = (plan: LotteryPlan) => {
    setIsEditing(true);
    setFormData(plan);
    const hourMatch = plan.drawTime.match(/\d{2}:\d{2}\s(?:AM|PM)/);
    if (hourMatch) setDrawHour(hourMatch[0]);
    setShowModal(true);
  };

  const togglePlanStatus = (plan: LotteryPlan) => {
    updateLottery({
      ...plan,
      isActive: !plan.isActive
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalDrawTime = formData.drawCycle === 'WEEKLY' 
      ? `Every ${formData.drawDay} at ${drawHour}` 
      : `Every ${formData.drawDay} of Month at ${drawHour}`;

    const submissionData = {
      ...formData,
      drawTime: finalDrawTime
    } as LotteryPlan;

    if (isEditing) {
      updateLottery(submissionData);
    } else {
      const newPlan: LotteryPlan = {
        ...submissionData,
        id: (formData.name?.toUpperCase().replace(/\s+/g, '_') || Math.random().toString())
      };
      addLottery(newPlan);
    }
    setShowModal(false);
  };

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const monthDates = Array.from({ length: 31 }, (_, i) => {
    const d = i + 1;
    if (d === 1) return '1st';
    if (d === 2) return '2nd';
    if (d === 3) return '3rd';
    return `${d}th`;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Lottery Management</h1>
          <p className="text-slate-500 font-medium">Add plans, set pricing, and control real-time visibility.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center space-x-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/20 transition-all uppercase tracking-widest text-xs active:scale-95"
        >
          <Plus size={18} />
          <span>Add New Lottery</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {lotteryPlans.map((lottery) => {
          const soldCount = allTokens.filter(t => t.planId === lottery.id).length;
          const soldPercentage = Math.round((soldCount / lottery.totalTokens) * 100);

          return (
            <div key={lottery.id} className={`bg-white rounded-[2.5rem] border-2 transition-all relative overflow-hidden flex flex-col group ${lottery.isActive ? 'border-slate-100 shadow-sm hover:shadow-2xl' : 'border-dashed border-slate-300 opacity-75 grayscale-[0.5]'}`}>
              
              {/* Header Visual */}
              <div className="relative h-56 bg-slate-100 overflow-hidden">
                 {lottery.image ? (
                   <img src={lottery.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={lottery.name} />
                 ) : (
                   <div className="absolute inset-0 flex items-center justify-center text-7xl group-hover:scale-110 transition-transform duration-500 bg-gradient-to-br from-slate-50 to-slate-200">
                      {lottery.icon}
                   </div>
                 )}
                 <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 
                 <div className="absolute top-6 left-6 flex flex-col space-y-2">
                    <span className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg ${lottery.drawCycle === 'WEEKLY' ? 'bg-indigo-600' : 'bg-pink-600'} text-white`}>
                      <CalendarDays size={10} />
                      <span>{lottery.drawCycle}</span>
                    </span>
                    {!lottery.isActive && (
                      <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-slate-900 text-white shadow-lg">
                        <StopCircle size={10} />
                        <span>Paused</span>
                      </span>
                    )}
                 </div>

                 {/* Status Toggle Switch Overlay */}
                 <div className="absolute top-6 right-6 z-20">
                    <button 
                      onClick={() => togglePlanStatus(lottery)}
                      className={`p-3 rounded-2xl shadow-xl transition-all flex items-center space-x-2 ${lottery.isActive ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'}`}
                      title={lottery.isActive ? 'Disable Plan' : 'Enable Plan'}
                    >
                       <Power size={18} />
                       <span className="text-[10px] font-black uppercase tracking-widest">{lottery.isActive ? 'Active' : 'Offline'}</span>
                    </button>
                 </div>
              </div>

              <div className="p-8 flex-grow space-y-6">
                 <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 uppercase leading-none">{lottery.name}</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">PKR {lottery.tokenPrice} / Token</p>
                    </div>
                    <div className="text-right">
                      <span className="block text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">Prize</span>
                      <span className="text-sm font-black text-emerald-600">{lottery.prizeName || `PKR ${lottery.prizePerWinner.toLocaleString()}`}</span>
                    </div>
                 </div>

                 {/* Sales Progress */}
                 <div className="space-y-2">
                    <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                       <span>Sales: {soldCount} / {lottery.totalTokens}</span>
                       <span className="text-indigo-600">{soldPercentage}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                       <div className="h-full bg-indigo-600 rounded-full transition-all duration-1000" style={{ width: `${soldPercentage}%` }}></div>
                    </div>
                 </div>

                 <div className="space-y-4 pt-4 border-t border-slate-50">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                      <div className="flex items-center space-x-2">
                         <Clock size={14} className="text-slate-300" />
                         <span className="uppercase tracking-widest text-[9px]">Next Schedule</span>
                      </div>
                      <span className="text-slate-900 font-black">{lottery.drawTime}</span>
                    </div>
                 </div>
              </div>

              <div className="p-6 bg-slate-50 flex items-center space-x-3">
                 <button 
                  onClick={() => handleOpenEdit(lottery)}
                  className="flex-grow flex items-center justify-center space-x-2 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-indigo-600 transition-all font-bold text-xs uppercase shadow-sm"
                 >
                    <Edit3 size={16} />
                    <span>Config</span>
                 </button>
                 <button 
                  onClick={() => deleteLottery(lottery.id)}
                  className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-red-600 transition-all shadow-sm"
                 >
                    <Trash2 size={18} />
                 </button>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300 max-h-[95vh] flex flex-col">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{isEditing ? 'Update Lottery' : 'Add New Lottery'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"><X size={24}/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
              
              {/* Image Upload Section */}
              <div className="space-y-4">
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Plan Visual</h3>
                 <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50/50 group hover:border-indigo-300 transition-all relative overflow-hidden">
                    {formData.image ? (
                      <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg">
                        <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                        <button 
                          type="button" 
                          onClick={removeImage}
                          className="absolute top-4 right-4 p-2 bg-red-600 text-white rounded-xl shadow-lg hover:bg-red-700 transition-all"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    ) : (
                      <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center space-y-4 text-slate-400 group-hover:text-indigo-600 transition-colors"
                      >
                         <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
                           <Upload size={32} />
                         </div>
                         <div className="text-center">
                            <p className="text-xs font-black uppercase tracking-widest">Click to Upload Image</p>
                            <p className="text-[10px] font-medium mt-1">Recommended: 1200 x 600px (JPG/PNG)</p>
                         </div>
                      </button>
                    )}
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                    />
                 </div>
              </div>

              <div className="space-y-6">
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">1. Name & Visibility</h3>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Lottery Name</label>
                      <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-600 outline-none font-bold" placeholder="e.g. Diamond Weekly" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Visibility Status</label>
                      <select 
                        required 
                        value={formData.isActive ? 'ACTIVE' : 'OFFLINE'} 
                        onChange={e => setFormData({...formData, isActive: e.target.value === 'ACTIVE'})}
                        className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-600 outline-none font-bold bg-white"
                      >
                         <option value="ACTIVE">Visible to Users</option>
                         <option value="OFFLINE">Paused / Hidden</option>
                      </select>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Draw Cycle</label>
                      <select 
                        required 
                        value={formData.drawCycle} 
                        onChange={e => {
                          const cycle = e.target.value as DrawCycle;
                          setFormData({
                            ...formData, 
                            drawCycle: cycle, 
                            drawDay: cycle === 'WEEKLY' ? 'Sunday' : '1st'
                          });
                        }}
                        className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-600 outline-none font-bold bg-white"
                      >
                         <option value="WEEKLY">Weekly (Haftawar)</option>
                         <option value="MONTHLY">Monthly (Mahana)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Total Winner Spots</label>
                      <input type="number" required value={formData.totalWinners} onChange={e => setFormData({...formData, totalWinners: Number(e.target.value)})} className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-600 outline-none font-bold" />
                    </div>
                 </div>

                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 pt-4">2. Draw Date & Time</h3>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">
                        {formData.drawCycle === 'WEEKLY' ? 'Select Day of Week' : 'Select Date of Month'}
                      </label>
                      <div className="relative">
                        {formData.drawCycle === 'WEEKLY' ? (
                          <select 
                            value={formData.drawDay} 
                            onChange={e => setFormData({...formData, drawDay: e.target.value})}
                            className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-600 outline-none font-bold bg-white appearance-none"
                          >
                             {weekDays.map(day => <option key={day} value={day}>{day}</option>)}
                          </select>
                        ) : (
                          <select 
                            value={formData.drawDay} 
                            onChange={e => setFormData({...formData, drawDay: e.target.value})}
                            className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-600 outline-none font-bold bg-white appearance-none"
                          >
                             {monthDates.map(date => <option key={date} value={date}>{date}</option>)}
                          </select>
                        )}
                        <Calendar className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={20} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Draw Time</label>
                      <div className="relative">
                        <select 
                          value={drawHour}
                          onChange={e => setDrawHour(e.target.value)}
                          className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-600 outline-none font-bold bg-white appearance-none"
                        >
                           <option value="09:00 AM">09:00 AM</option>
                           <option value="12:00 PM">12:00 PM</option>
                           <option value="04:00 PM">04:00 PM</option>
                           <option value="08:00 PM">08:00 PM</option>
                           <option value="11:00 PM">11:00 PM</option>
                        </select>
                        <Clock className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={20} />
                      </div>
                    </div>
                 </div>

                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 pt-4">3. Finance & Rewards</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Token Price (PKR)</label>
                      <input type="number" required value={formData.tokenPrice} onChange={e => setFormData({...formData, tokenPrice: Number(e.target.value)})} className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-600 outline-none font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Prize Name (Item/Cash)</label>
                      <input type="text" required value={formData.prizeName} onChange={e => setFormData({...formData, prizeName: e.target.value})} className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-600 outline-none font-bold" placeholder="e.g. 125 Motorcycle" />
                    </div>
                 </div>
              </div>

              <div className="space-y-6 bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                 <div className="flex justify-between items-center">
                    <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center space-x-2">
                       <Share2 size={14} />
                       <span>Referral Rewards</span>
                    </h3>
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, isReferralEnabled: !formData.isReferralEnabled})}
                    >
                       {formData.isReferralEnabled ? <ToggleRight className="text-indigo-600" size={36} /> : <ToggleLeft className="text-slate-300" size={36} />}
                    </button>
                 </div>
                 
                 {formData.isReferralEnabled && (
                   <div className="grid grid-cols-2 gap-6 animate-in slide-in-from-top-2">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Invites Goal</label>
                        <input type="number" value={formData.referralThreshold} onChange={e => setFormData({...formData, referralThreshold: Number(e.target.value)})} className="w-full px-6 py-4 rounded-2xl border-2 border-white bg-white focus:border-indigo-600 outline-none font-black" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Reward Tokens</label>
                        <input type="number" value={formData.referralRewardCount} onChange={e => setFormData({...formData, referralRewardCount: Number(e.target.value)})} className="w-full px-6 py-4 rounded-2xl border-2 border-white bg-white focus:border-indigo-600 outline-none font-black" />
                      </div>
                   </div>
                 )}
              </div>

              <button type="submit" className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl uppercase tracking-[0.2em] text-xs shadow-xl shadow-indigo-200 transition-all active:scale-95">
                {isEditing ? 'Save All Changes' : 'Launch New Lottery'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLottery;
