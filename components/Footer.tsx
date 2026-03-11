
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MessageCircle } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 mb-16 text-center sm:text-left">
          {/* Logo & About */}
          <div className="space-y-6">
            <div className="flex items-center justify-center sm:justify-start space-x-3">
              <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">L</div>
              <span className="text-2xl font-black text-white tracking-tight">Lucky Inami</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 max-w-md mx-auto sm:mx-0">
              Lucky Inami Scheme ek bharosemand aur transparent lottery platform hai. Hum aapko real-time token purchase aur instant notifications provide karte hain.
            </p>
          </div>

          {/* Quick Links */}
          <div className="sm:pl-12 flex flex-col items-center sm:items-start">
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Quick Links</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/" className="hover:text-indigo-400 transition-colors flex items-center justify-center sm:justify-start space-x-2"><span>Home</span></Link></li>
              <li><Link to="/lotteries" className="hover:text-indigo-400 transition-colors flex items-center justify-center sm:justify-start space-x-2"><span>Lotteries</span></Link></li>
              <li><Link to="/winners" className="hover:text-indigo-400 transition-colors flex items-center justify-center sm:justify-start space-x-2"><span>Winners</span></Link></li>
              <li><Link to="/wallet" className="hover:text-indigo-400 transition-colors flex items-center justify-center sm:justify-start space-x-2"><span>My Wallet</span></Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col justify-center items-center text-center text-xs font-bold text-slate-500 uppercase tracking-widest">
          <p>© 2024 Lucky Inami Scheme. Made with ❤️ for Winners.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
