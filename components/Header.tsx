
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Wallet, User as UserIcon, LogOut, Ticket, Trophy, Share2, Home, ShieldCheck, LogIn, UserPlus } from 'lucide-react';
import { useUser } from '../context/UserContext.ts';

const Header: React.FC = () => {
  const { user, logout, isLoggedIn } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = isLoggedIn && user.role === 'ADMIN';

  const navItems = [
    { label: 'Home', path: '/', icon: <Home size={18} /> },
    { label: 'Lotteries', path: '/lotteries', icon: <Ticket size={18} /> },
    { label: 'Winners', path: '/winners', icon: <Trophy size={18} /> },
  ];

  const authNavItems = isLoggedIn ? [
    { label: 'My Tokens', path: '/my-tokens', icon: <Trophy size={18} /> },
    { label: 'Wallet', path: '/wallet', icon: <Wallet size={18} /> },
    { label: 'Referral', path: '/referral', icon: <Share2 size={18} /> },
    { label: 'Profile', path: '/profile', icon: <UserIcon size={18} /> },
  ] : [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              L
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-bold text-sm text-slate-900 tracking-tight leading-none">Lucky Inami</span>
              {isAdmin && <span className="text-[8px] font-black text-indigo-600 uppercase tracking-widest mt-0.5">Admin Account</span>}
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex space-x-1">
            {[...navItems, ...authNavItems].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-xs font-bold transition-all ${
                  location.pathname === item.path
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
            
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center space-x-1 px-4 py-2 rounded-md text-xs font-black bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all ml-2"
              >
                <ShieldCheck size={16} />
                <span>ADMIN PANEL</span>
              </Link>
            )}
          </nav>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <div className="hidden md:flex flex-col items-end mr-2">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Balance</span>
                  <span className="text-sm font-black text-emerald-600">Rs {user.walletBalance.toLocaleString()}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link to="/login" className="flex items-center space-x-1 px-4 py-2 text-slate-600 font-bold text-xs hover:text-indigo-600 transition-colors">
                  <LogIn size={16} />
                  <span>Login</span>
                </Link>
                <Link to="/signup" className="flex items-center space-x-1 px-5 py-2.5 bg-indigo-600 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all uppercase tracking-widest">
                  <UserPlus size={16} />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-md"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 animate-in slide-in-from-top duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {!isLoggedIn && (
              <div className="grid grid-cols-2 gap-2 mb-4 p-2">
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center space-x-2 px-4 py-3 bg-slate-50 text-slate-700 rounded-xl font-bold text-sm">
                   <LogIn size={18} />
                   <span>Login</span>
                </Link>
                <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center space-x-2 px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm">
                   <UserPlus size={18} />
                   <span>Sign Up</span>
                </Link>
              </div>
            )}

            {isAdmin && (
               <Link
                to="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-4 rounded-md text-base font-black bg-indigo-600 text-white mb-2"
              >
                <ShieldCheck size={20} />
                <span>Go to Admin Dashboard</span>
              </Link>
            )}

            {[...navItems, ...authNavItems].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium ${
                  location.pathname === item.path
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}

            {isLoggedIn && (
              <div className="mt-4 px-3 py-4 bg-slate-50 rounded-lg flex justify-between items-center">
                 <div className="flex flex-col">
                    <span className="text-xs text-slate-500">My Balance</span>
                    <span className="text-lg font-bold text-emerald-600">Rs {user.walletBalance}</span>
                 </div>
                 <Link to="/wallet" onClick={() => setIsMenuOpen(false)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                   Deposit
                 </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
