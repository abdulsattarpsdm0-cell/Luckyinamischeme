
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { UserContext, PaymentMethod } from './context/UserContext.ts';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import HomePage from './pages/HomePage.tsx';
import LotteriesPage from './pages/LotteriesPage.tsx';
import TokenPurchasePage from './pages/TokenPurchasePage.tsx';
import MyTokensPage from './pages/MyTokensPage.tsx';
import WinnersPage from './pages/WinnersPage.tsx';
import WalletPage from './pages/WalletPage.tsx';
import ReferralPage from './pages/ReferralPage.tsx';
import ProfilePage from './pages/ProfilePage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import SignUpPage from './pages/SignUpPage.tsx';
import WhatsAppButton from './components/WhatsAppButton.tsx';

// Admin Pages
import AdminLayout from './components/admin/AdminLayout.tsx';
import AdminDashboard from './pages/admin/AdminDashboard.tsx';
import AdminLottery from './pages/admin/AdminLottery.tsx';
import AdminUsers from './pages/admin/AdminUsers.tsx';
import AdminDeposit from './pages/admin/AdminDeposit.tsx';
import AdminWithdraw from './pages/admin/AdminWithdraw.tsx';
import AdminWinner from './pages/admin/AdminWinner.tsx';
import AdminPayment from './pages/admin/AdminPayment.tsx';
import AdminSoldTokens from './pages/admin/AdminSoldTokens.tsx';
import AdminReferrals from './pages/admin/AdminReferrals.tsx';
import AdminSettings from './pages/admin/AdminSettings.tsx';

import { LOTTERY_PLANS } from './constants.ts';
import { Token, Transaction, LotteryPlan, User } from './types.ts';
import { auth, db } from './firebase.ts';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot, 
  collection, 
  updateDoc, 
  increment, 
  query, 
  orderBy,
  where,
  deleteDoc
} from 'firebase/firestore';

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  const userCtx = React.useContext(UserContext);
  const isLoggedIn = userCtx?.isLoggedIn;
  const isAdmin = userCtx?.user.role === 'ADMIN';

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminPath && <Header />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lotteries" element={<LotteriesPage />} />
          <Route path="/winners" element={<WinnersPage />} />
          <Route path="/login" element={!isLoggedIn ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/signup" element={!isLoggedIn ? <SignUpPage /> : <Navigate to="/" />} />
          <Route path="/buy/:planId" element={isLoggedIn ? <TokenPurchasePage /> : <Navigate to="/login" />} />
          <Route path="/my-tokens" element={isLoggedIn ? <MyTokensPage /> : <Navigate to="/login" />} />
          <Route path="/wallet" element={isLoggedIn ? <WalletPage /> : <Navigate to="/login" />} />
          <Route path="/referral" element={isLoggedIn ? <ReferralPage /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isLoggedIn ? <ProfilePage /> : <Navigate to="/login" />} />
          <Route path="/admin" element={isAdmin ? <AdminLayout /> : (isLoggedIn ? <Navigate to="/" /> : <Navigate to="/login" />)}>
            <Route index element={<AdminDashboard />} />
            <Route path="lottery" element={<AdminLottery />} />
            <Route path="sold-tokens" element={<AdminSoldTokens />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="deposits" element={<AdminDeposit />} />
            <Route path="withdrawals" element={<AdminWithdraw />} />
            <Route path="winners" element={<AdminWinner />} />
            <Route path="payments" element={<AdminPayment />} />
            <Route path="referrals" element={<AdminReferrals />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </main>
      {!isAdminPath && <Footer />}
      {!isAdminPath && <WhatsAppButton />}
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User>({} as User);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [allTokens, setAllTokens] = useState<Token[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [lotteryPlans, setLotteryPlans] = useState<LotteryPlan[]>(LOTTERY_PLANS);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [whatsappContact, setWhatsappContact] = useState('923177730425');
  const [fbUser, setFbUser] = useState<FirebaseUser | null>(null);

  // 1. Listen for Auth changes
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setFbUser(firebaseUser);
      if (!firebaseUser) {
        setIsLoggedIn(false);
        setUser({} as User);
        setTokens([]);
        setTransactions([]);
      }
    });
    return () => unsub();
  }, []);

  // 2. Sync User Profile
  useEffect(() => {
    if (!fbUser) return;

    const unsub = onSnapshot(doc(db, 'users', fbUser.uid), (snap) => {
      if (snap.exists()) {
        setUser(snap.data() as User);
        setIsLoggedIn(true);
      }
    }, (err) => {
      console.warn("Firestore profile sync waiting for permissions...");
    });

    return () => unsub();
  }, [fbUser]);

  // 3. Real-time Data Listeners (Scoped by Permissions)
  useEffect(() => {
    const unsubs: (() => void)[] = [];

    // Global Settings (Always accessible)
    unsubs.push(onSnapshot(doc(db, 'settings', 'global'), (snap) => {
      if (snap.exists()) {
        setWhatsappContact(snap.data().whatsapp);
      }
    }, () => {}));

    // Payment Methods (Always accessible)
    unsubs.push(onSnapshot(collection(db, 'paymentMethods'), (snap) => {
      setPaymentMethods(snap.docs.map(d => d.data() as PaymentMethod));
    }, () => {}));

    // Fetch ALL tokens globally so everyone can see sold tokens in real-time
    unsubs.push(onSnapshot(collection(db, 'tokens'), (snap) => {
      const allT = snap.docs.map(d => ({ ...d.data(), id: d.id } as any as Token));
      setAllTokens(allT);
      if (isLoggedIn && user.username) {
        setTokens(user.role === 'ADMIN' ? allT : allT.filter(t => t.username === user.username));
      } else {
        setTokens([]);
      }
    }, (err) => console.error("Token Listener Error:", err)));

    // Data that depends on login and user identity
    if (isLoggedIn && user.username) {
      
      // Admin View vs User View for Transactions
      // FIX: Remove orderBy from query to avoid composite index requirement
      const txQuery = user.role === 'ADMIN' 
        ? collection(db, 'transactions')
        : query(collection(db, 'transactions'), where('username', '==', user.username));

      unsubs.push(onSnapshot(txQuery, (snap) => {
        const txs = snap.docs.map(d => ({ ...d.data(), id: d.id } as Transaction));
        // Client-side sort to fix "The query requires an index" error
        txs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setTransactions(txs);
      }, (err) => console.error("Tx Listener Error:", err)));

      // Admin-only User List
      if (user.role === 'ADMIN') {
        unsubs.push(onSnapshot(collection(db, 'users'), (snap) => {
          setUsers(snap.docs.map(d => ({ ...d.data(), id: d.id } as User)));
        }, (err) => console.error("User List Listener Error:", err)));
      }
    }

    return () => unsubs.forEach(unsub => unsub());
  }, [isLoggedIn, user.role, user.username]);

  const login = async (email?: string, password?: string) => {
    if (!email || !password) return false;
    await signInWithEmailAndPassword(auth, email, password);
    return true;
  };

  const signUp = async (userData: any) => {
    const res = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
    const newUser: User = {
      id: res.user.uid,
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      username: userData.username || userData.email.split('@')[0],
      email: userData.email,
      mobile: userData.mobile || '',
      role: 'USER',
      password: userData.password,
      walletBalance: 0,
      referralCode: 'LUCKY' + Math.floor(1000 + Math.random() * 9000),
      referralsCount: 0,
      activeReferrals: 0,
      totalWinnings: 0,
      planReferralStats: {},
      joinDate: new Date().toLocaleDateString()
    };
    await setDoc(doc(db, 'users', res.user.uid), newUser);
    return true;
  };

  const logout = () => signOut(auth);

  const deleteAccount = async (userId: string) => {
    await deleteDoc(doc(db, 'users', userId));
    if (user.id === userId) logout();
  };

  const addTokens = async (newTokens: Token[]) => {
    for (const t of newTokens) {
      await setDoc(doc(db, 'tokens', Math.random().toString(36).substr(2, 9)), { ...t, username: user.username });
    }
  };

  const updateBalance = async (amount: number) => {
    if (!user.id) return;
    await updateDoc(doc(db, 'users', user.id), { walletBalance: increment(amount) });
  };

  const updateUserBalance = async (userId: string, amount: number) => {
    await updateDoc(doc(db, 'users', userId), { walletBalance: increment(amount) });
  };

  const addTransaction = async (tx: Transaction) => {
    await setDoc(doc(db, 'transactions', tx.id), tx);
  };

  const updateTransactionStatus = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    const txRef = doc(db, 'transactions', id);
    const txSnap = await getDoc(txRef);
    if (txSnap.exists()) {
      const txData = txSnap.data() as Transaction;
      if (txData.status === 'PENDING') {
        const targetUser = users.find(u => u.username === txData.username);
        if (targetUser) {
          if (txData.type === 'DEPOSIT' && status === 'APPROVED') {
            await updateUserBalance(targetUser.id, txData.netAmount);
          } else if (txData.type === 'WITHDRAWAL' && status === 'REJECTED') {
            await updateUserBalance(targetUser.id, txData.amount);
          }
        }
      }
      await updateDoc(txRef, { status });
    }
  };

  const addLottery = async (plan: LotteryPlan) => {
    await setDoc(doc(db, 'lotteryPlans', plan.id), plan);
  };
  const updateLottery = async (plan: LotteryPlan) => {
    await updateDoc(doc(db, 'lotteryPlans', plan.id), { ...plan });
  };
  const deleteLottery = async (id: string) => {
    await deleteDoc(doc(db, 'lotteryPlans', id));
  };

  const addPaymentMethod = async (method: PaymentMethod) => {
    await setDoc(doc(db, 'paymentMethods', method.id), method);
  };
  const updatePaymentMethod = async (method: PaymentMethod) => {
    await setDoc(doc(db, 'paymentMethods', method.id), method);
  };
  const deletePaymentMethod = async (id: string) => {
    await deleteDoc(doc(db, 'paymentMethods', id));
  };

  const updateWhatsappContact = async (link: string) => {
    await updateDoc(doc(db, 'settings', 'global'), { whatsapp: link });
  };

  return (
    <UserContext.Provider value={{ 
      user, users, isLoggedIn, tokens, allTokens, transactions, lotteryPlans, paymentMethods, whatsappContact,
      login, signUp, logout, deleteAccount, addTokens, updateBalance, updateUserBalance, addTransaction, 
      updateTransactionStatus, addLottery, updateLottery, deleteLottery, addPaymentMethod, updatePaymentMethod, 
      deletePaymentMethod, updateWhatsappContact
    }}>
      <Router>
        <AppContent />
      </Router>
    </UserContext.Provider>
  );
};

export default App;
