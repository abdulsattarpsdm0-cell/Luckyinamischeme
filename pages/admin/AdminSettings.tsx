
import React, { useState } from 'react';
import { Settings, MessageCircle, Save, Info, Globe, ShieldCheck } from 'lucide-react';
import { useUser } from '../../context/UserContext.ts';

const AdminSettings: React.FC = () => {
  const { whatsappContact, updateWhatsappContact } = useUser();
  const [tempLink, setTempLink] = useState(whatsappContact);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateWhatsappContact(tempLink);
    alert('System Settings Updated Successfully!');
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight leading-none">System Settings</h1>
        <p className="text-sm text-slate-500 font-medium mt-2">Control global platform configurations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7">
          <form onSubmit={handleSave} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden p-8 md:p-12 space-y-10">
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                  <MessageCircle size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 uppercase">Support Contact</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Floating WhatsApp Button Link</p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">WhatsApp Number or Group Link</label>
                <input 
                  type="text" 
                  value={tempLink}
                  onChange={(e) => setTempLink(e.target.value)}
                  placeholder="e.g. 923177730425 or https://chat.whatsapp.com/..."
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-600 outline-none font-bold text-sm transition-all"
                />
                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-start space-x-3">
                  <Info size={16} className="text-indigo-400 mt-0.5 flex-shrink-0" />
                  <p className="text-[10px] font-bold text-indigo-700 leading-relaxed uppercase tracking-tight">
                    Aap yahan sirf Number bhi likh sakty hain (bagair + ke) ya phir pura Whatsapp Group Link bhi paste kar sakty hain. Button automatically link generate kar ley ga.
                  </p>
                </div>
              </div>
            </div>

            <button type="submit" className="w-full py-5 bg-[#1a233a] hover:bg-indigo-600 text-white font-black rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center space-x-3 uppercase tracking-[0.2em] text-xs">
              <Save size={18} />
              <span>Save System Settings</span>
            </button>
          </form>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl border border-white/5">
            <div className="relative z-10">
               <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                 <Globe size={24} className="text-indigo-400" />
               </div>
               <h3 className="text-xl font-black uppercase tracking-tight mb-4">Real-time Sync</h3>
               <p className="text-slate-400 text-sm font-medium leading-relaxed">
                 Yahan settings update karte hi tamaam users ke paas naya Whatsapp link active ho jaye ga. Koi manual code update karne ki zaroorat nahi hogi.
               </p>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          </div>
          
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm flex items-center space-x-5">
             <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner">
               <ShieldCheck size={24} />
             </div>
             <div>
                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">System Version</span>
                <span className="text-lg font-black text-slate-900">v2.5.0-LIVE</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
