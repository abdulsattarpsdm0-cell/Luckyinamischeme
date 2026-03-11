
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User as UserIcon, Phone, Share2, ArrowRight, Star, Sparkles, UserCircle, AlertCircle } from 'lucide-react';
import { useUser } from '../context/UserContext';

const SignUpPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const location = useLocation();
  const { signUp } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    refCode: ''
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get('ref');
    if (ref) setFormData(prev => ({ ...prev, refCode: ref }));
  }, [location]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords match nahi karte!");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password kam az kam 6 characters ka hona chahiye.");
      return;
    }

    setLoading(true);
    try {
      const success = await signUp(formData);
      if (success) {
        navigate('/wallet');
      }
    } catch (err: any) {
      console.error("Registration Error:", err.code, err.message);
      if (err.code === 'auth/email-already-in-use') {
        setError("Ye email pehle se register hai. Login karein.");
      } else if (err.code === 'auth/invalid-email') {
        setError("Ghalat email address.");
      } else if (err.code === 'auth/weak-password') {
        setError("Password bohat kamzor hai.");
      } else if (err.code === 'auth/invalid-credential') {
        setError("System credential error. Dobara koshish karein.");
      } else {
        setError("Registration Error: " + (err.message || "Ek ghalati hui hai."));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-stretch bg-white">
      <div className="hidden lg:flex lg:w-[40%] bg-[#0f172a] relative overflow-hidden flex-col justify-center p-20 text-white">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-600/10 to-indigo-600/10"></div>
        <div className="relative z-10 max-w-md">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-emerald-300 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
            <Star size={12} fill="currentColor" />
            <span>Cloud Registration</span>
          </div>
          <h1 className="text-6xl font-black mb-8 leading-[0.9] tracking-tighter uppercase">Join & <br /><span className="text-emerald-400">Win Real.</span></h1>
          <p className="text-white/60 text-lg font-medium">Your data is now stored in the cloud. Access your account from any device.</p>
        </div>
      </div>

      <div className="w-full lg:w-[60%] flex items-center justify-center p-6 md:p-20 overflow-y-auto">
        <div className="w-full max-w-2xl space-y-10 py-10 animate-in fade-in slide-in-from-right-10 duration-700">
          <div className="text-center lg:text-left">
            <h2 className="text-4xl font-black text-[#1a233a] mb-2 uppercase tracking-tight">Create Account</h2>
            <p className="text-slate-500 font-medium text-lg">"Global access to Lucky Inami."</p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center space-x-3 text-red-600 animate-in slide-in-from-top-4 duration-300">
               <AlertCircle size={20} className="flex-shrink-0" />
               <p className="text-xs font-black uppercase tracking-widest leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input required type="text" placeholder="First Name" className="w-full px-6 py-5 rounded-3xl border-2 border-slate-50 focus:border-emerald-600 outline-none font-bold bg-slate-50/50" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
              <input required type="text" placeholder="Last Name" className="w-full px-6 py-5 rounded-3xl border-2 border-slate-50 focus:border-emerald-600 outline-none font-bold bg-slate-50/50" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input required type="text" placeholder="Choose Username" className="w-full px-6 py-5 rounded-3xl border-2 border-slate-50 focus:border-indigo-600 outline-none font-bold bg-slate-50/50" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value.toLowerCase().replace(/\s/g, '')})} />
              <input type="text" placeholder="Referral Code (Optional)" className="w-full px-6 py-5 rounded-3xl border-2 border-slate-50 focus:border-indigo-600 outline-none font-black text-xs uppercase tracking-widest bg-slate-50/50" value={formData.refCode} onChange={e => setFormData({...formData, refCode: e.target.value})} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input required type="email" placeholder="Email Address" className="w-full px-6 py-5 rounded-3xl border-2 border-slate-50 focus:border-emerald-600 outline-none font-bold bg-slate-50/50" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              <input required type="tel" placeholder="Mobile 03XXXXXXXXX" className="w-full px-6 py-5 rounded-3xl border-2 border-slate-50 focus:border-emerald-600 outline-none font-bold bg-slate-50/50" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative group">
                <input required type={showPassword ? 'text' : 'password'} placeholder="Create Password" title="Minimum 6 characters" className="w-full px-6 py-5 rounded-3xl border-2 border-slate-50 focus:border-indigo-600 outline-none font-bold bg-slate-50/50" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
              <input required type={showPassword ? 'text' : 'password'} placeholder="Confirm Password" className="w-full px-6 py-5 rounded-3xl border-2 border-slate-100 focus:border-indigo-600 outline-none font-bold bg-white" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} />
            </div>

            <button disabled={loading} type="submit" className="w-full py-6 bg-[#1a233a] hover:bg-slate-800 text-white font-black rounded-[2rem] shadow-2xl transition-all active:scale-95 flex items-center justify-center space-x-2 uppercase tracking-[0.2em] text-sm disabled:opacity-50">
              {loading ? <span>Syncing with Cloud...</span> : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="pt-6 text-center lg:text-left border-t border-slate-100">
            <p className="text-slate-500 font-medium">Already a member? <Link to="/login" className="text-emerald-600 font-black hover:underline ml-1">Sign In</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
