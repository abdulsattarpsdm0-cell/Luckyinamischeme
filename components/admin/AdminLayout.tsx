
import React, { useState, useMemo, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Ticket, 
  Users, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Trophy, 
  CreditCard, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  Search,
  Settings,
  ClipboardList,
  Share2
} from 'lucide-react';
import { useUser } from '../../context/UserContext';

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, tokens, transactions } = useUser();

  const totalTokens = tokens.length;
  const totalDeposits = useMemo(() => transactions.filter(t => t.type === 'DEPOSIT').length, [transactions]);
  const totalWithdrawals = useMemo(() => transactions.filter(t => t.type === 'WITHDRAWAL').length, [transactions]);

  const [viewedTokens, setViewedTokens] = useState(() => parseInt(localStorage.getItem('admin_viewed_tokens') || '0'));
  const [viewedDeposits, setViewedDeposits] = useState(() => parseInt(localStorage.getItem('admin_viewed_deposits') || '0'));
  const [viewedWithdrawals, setViewedWithdrawals] = useState(() => parseInt(localStorage.getItem('admin_viewed_withdrawals') || '0'));

  useEffect(() => {
    if (location.pathname === '/admin/sold-tokens' || totalTokens < viewedTokens) {
      setViewedTokens(totalTokens);
      localStorage.setItem('admin_viewed_tokens', totalTokens.toString());
    }
  }, [totalTokens, location.pathname, viewedTokens]);

  useEffect(() => {
    if (location.pathname === '/admin/deposits' || totalDeposits < viewedDeposits) {
      setViewedDeposits(totalDeposits);
      localStorage.setItem('admin_viewed_deposits', totalDeposits.toString());
    }
  }, [totalDeposits, location.pathname, viewedDeposits]);

  useEffect(() => {
    if (location.pathname === '/admin/withdrawals' || totalWithdrawals < viewedWithdrawals) {
      setViewedWithdrawals(totalWithdrawals);
      localStorage.setItem('admin_viewed_withdrawals', totalWithdrawals.toString());
    }
  }, [totalWithdrawals, location.pathname, viewedWithdrawals]);

  const newTokens = Math.max(0, totalTokens - viewedTokens);
  const newDeposits = Math.max(0, totalDeposits - viewedDeposits);
  const newWithdrawals = Math.max(0, totalWithdrawals - viewedWithdrawals);

  const menuItems = [
    { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { label: 'Lottery Plans', path: '/admin/lottery', icon: <Ticket size={20} /> },
    { 
      label: 'Sold Tokens', 
      path: '/admin/sold-tokens', 
      icon: <ClipboardList size={20} />, 
      badge: newTokens > 0 ? newTokens.toString() : null,
      badgeColor: 'bg-emerald-500'
    },
    { label: 'All Users', path: '/admin/users', icon: <Users size={20} /> },
    { label: 'Referrals', path: '/admin/referrals', icon: <Share2 size={20} /> },
    { 
      label: 'Deposits', 
      path: '/admin/deposits', 
      icon: <ArrowDownCircle size={20} />, 
      badge: newDeposits > 0 ? newDeposits.toString() : null,
      badgeColor: 'bg-amber-500'
    },
    { 
      label: 'Withdrawals', 
      path: '/admin/withdrawals', 
      icon: <ArrowUpCircle size={20} />, 
      badge: newWithdrawals > 0 ? newWithdrawals.toString() : null,
      badgeColor: 'bg-indigo-500'
    },
    { label: 'Winners', path: '/admin/winners', icon: <Trophy size={20} /> },
    { label: 'Payments', path: '/admin/payments', icon: <CreditCard size={20} /> },
    { label: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex">
      {/* Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[45] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#1e293b] text-white transition-transform duration-300 transform lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="p-8 border-b border-white/5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-xl">L</div>
              <div>
                <h1 className="font-black text-lg leading-none uppercase tracking-tight">Lucky Inami</h1>
                <span className="text-[9px] text-indigo-400 font-black uppercase tracking-widest">Admin Control</span>
              </div>
            </div>
          </div>
          <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all font-bold text-sm ${
                  location.pathname === item.path 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'text-slate-400 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`${item.badgeColor || 'bg-indigo-500'} text-white text-[10px] px-2 py-0.5 rounded-full font-black min-w-[20px] text-center`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-white/5">
            <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-bold text-sm">
              <LogOut size={20} />
              <span>Logout Admin</span>
            </button>
          </div>
        </div>
      </aside>
      <div className="flex-grow lg:ml-72 flex flex-col min-h-screen">
        <header className="h-20 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg lg:hidden">
            <Menu size={24} />
          </button>
          <div className="flex items-center space-x-3">
             <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-slate-900 leading-none">Admin Panel</p>
                <p className="text-[10px] text-emerald-500 font-bold uppercase mt-1">Super Admin</p>
             </div>
             <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 border border-slate-200">
                <Users size={20} />
             </div>
          </div>
        </header>
        <main className="p-4 md:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
