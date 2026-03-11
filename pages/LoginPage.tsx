
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { useUser } from '../context/UserContext';

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useUser();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/');
      } else {
        setError('Invalid credentials. Check your email and password.');
      }
    } catch (err: any) {
      console.error("Auth Error:", err.code, err.message);
      // Firebase v10+ consolidated 'user-not-found' and 'wrong-password' into 'invalid-credential'
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError("Ghalat Email ya Password. Meharbani karke check karein.");
      } else if (err.code === 'auth/too-many-requests') {
        setError("Bohat zyada koshishain! Thori der baad try karein.");
      } else if (err.code === 'auth/network-request-failed') {
        setError("Internet connection check karein.");
      } else {
        setError("Login Error: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-stretch bg-white">
      <div className="hidden lg:flex lg:w-[45%] bg-[#0f172a] relative overflow-hidden flex-col justify-center p-20 text-white">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[100px]"></div>
        <div className="relative z-10 max-w-md">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
            <Sparkles size={12} />
            <span>Cloud Secured</span>
          </div>
          <h1 className="text-5xl font-black mb-6 leading-tight tracking-tighter uppercase">
            Fortune Awaits <br />
            <span className="text-indigo-400">Log In To Win.</span>
          </h1>
          <p className="text-slate-400 text-lg font-medium mb-12 italic leading-relaxed">
            "Your profile is now synced across all your devices."
          </p>
        </div>
      </div>

      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 sm:p-12 md:p-20">
        <div className="w-full max-w-md space-y-10 animate-in fade-in slide-in-from-right-10 duration-700">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-black text-[#1a233a] mb-3 tracking-tight uppercase leading-none">Sign In</h2>
            <p className="text-slate-500 font-medium">Enter your registered email to continue.</p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center space-x-3 text-red-600 animate-in slide-in-from-top-4 duration-300">
               <AlertCircle size={20} className="flex-shrink-0" />
               <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@example.com" 
                  className="w-full pl-14 pr-6 py-5 rounded-[1.5rem] border-2 border-slate-100 focus:border-indigo-600 outline-none transition-all font-bold placeholder:text-slate-300 bg-slate-50/30" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••" 
                  className="w-full pl-14 pr-14 py-5 rounded-[1.5rem] border-2 border-slate-100 focus:border-indigo-600 outline-none transition-all font-bold placeholder:text-slate-300 bg-slate-50/30" 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button disabled={loading} type="submit" className="w-full py-5 bg-[#1a233a] hover:bg-slate-800 text-white font-black rounded-[1.5rem] shadow-2xl transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center space-x-2 uppercase tracking-widest text-[11px] disabled:opacity-50">
              {loading ? <span>Connecting...</span> : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="pt-6 text-center lg:text-left border-t border-slate-100">
            <p className="text-slate-500 font-medium">
              New here? <Link to="/signup" className="text-indigo-600 font-black hover:underline ml-1">Create Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
