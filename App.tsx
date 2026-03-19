
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
import AdminWeeklyWinner from './pages/admin/AdminWeeklyWinner.tsx';
import AdminMonthlyWinner from './pages/admin/AdminMonthlyWinner.tsx';
import AdminPayment from './pages/admin/AdminPayment.tsx';
import AdminWeeklySoldTokens from './pages/admin/AdminWeeklySoldTokens.tsx';
import AdminMonthlySoldTokens from './pages/admin/AdminMonthlySoldTokens.tsx';
import AdminReferrals from './pages/admin/AdminReferrals.tsx';
import AdminSettings from './pages/admin/AdminSettings.tsx';

import { LOTTERY_PLANS } from './constants.ts';
import { Token, Transaction, LotteryPlan, User, Draw } from './types.ts';
import { auth, db } from './firebase.ts';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut,
  deleteUser,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  onSnapshot, 
  collection, 
  updateDoc, 
  increment, 
  query, 
  orderBy,
  where,
  deleteDoc,
  writeBatch,
  runTransaction
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
            <Route path="weekly-tokens" element={<AdminWeeklySoldTokens />} />
            <Route path="monthly-tokens" element={<AdminMonthlySoldTokens />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="deposits" element={<AdminDeposit />} />
            <Route path="withdrawals" element={<AdminWithdraw />} />
            <Route path="weekly-winners" element={<AdminWeeklyWinner />} />
            <Route path="monthly-winners" element={<AdminMonthlyWinner />} />
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
  const [draws, setDraws] = useState<Draw[]>([]);
  const [whatsappContact, setWhatsappContact] = useState('923177730425');
  const [fbUser, setFbUser] = useState<FirebaseUser | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // 1. Listen for Auth changes
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setFbUser(firebaseUser);
      if (!firebaseUser) {
        setIsLoggedIn(false);
        setUser({} as User);
        setTokens([]);
        setTransactions([]);
        setIsAuthReady(true);
      }
    });
    return () => unsub();
  }, []);

  // 2. Sync User Profile
  useEffect(() => {
    if (!fbUser) return;

    const unsub = onSnapshot(doc(db, 'users', fbUser.uid), async (snap) => {
      if (snap.exists()) {
        const userData = snap.data() as User;
        
        // Auto-grant ADMIN role to the specific email
        if (userData.email === 'abdulsattarpsdm0@gmail.com' && userData.role !== 'ADMIN') {
          try {
            await updateDoc(doc(db, 'users', fbUser.uid), { role: 'ADMIN' });
            userData.role = 'ADMIN';
          } catch (e) {
            console.error("Failed to auto-grant admin role:", e);
          }
        }
        
        setUser(userData);
        setIsLoggedIn(true);
        setIsAuthReady(true);
      } else {
        setIsAuthReady(true);
      }
    }, (err) => {
      console.warn("Firestore profile sync waiting for permissions...");
      setIsAuthReady(true);
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

    // Draws (Always accessible)
    unsubs.push(onSnapshot(collection(db, 'draws'), (snap) => {
      const allDraws = snap.docs.map(d => ({ ...d.data(), id: d.id } as any as Draw));
      allDraws.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setDraws(allDraws);
    }, (err) => {
      console.error("Error fetching draws:", err);
    }));

    // Lottery Plans (Always accessible)
    unsubs.push(onSnapshot(collection(db, 'lotteryPlans'), async (snap) => {
      if (snap.empty) {
        // Initialize Firestore with static LOTTERY_PLANS if empty
        try {
          if (user.role === 'ADMIN') {
            const batch = writeBatch(db);
            LOTTERY_PLANS.forEach(plan => {
              const ref = doc(db, 'lotteryPlans', plan.id);
              batch.set(ref, plan);
            });
            const migrationRef = doc(db, 'settings', 'migration');
            batch.set(migrationRef, { lotteryPlansMigrated: true }, { merge: true });
            await batch.commit();
          }
        } catch (e) {
          console.error("Error initializing lottery plans:", e);
        }
      } else {
        const plans = snap.docs.map(d => ({ ...d.data(), id: d.id } as LotteryPlan));
        
        // Sort plans based on LOTTERY_PLANS order to maintain the correct sequence
        plans.sort((a, b) => {
          const indexA = LOTTERY_PLANS.findIndex(p => p.id === a.id);
          const indexB = LOTTERY_PLANS.findIndex(p => p.id === b.id);
          
          if (indexA !== -1 && indexB !== -1) return indexA - indexB;
          if (indexA !== -1) return -1;
          if (indexB !== -1) return 1;
          return a.name.localeCompare(b.name);
        });

        // MIGRATION: Ensure static plans exist in Firestore (run once)
        try {
          if (user.role === 'ADMIN') {
            const migrationRef = doc(db, 'settings', 'migration');
            const migrationDoc = await getDoc(migrationRef);
            if (!migrationDoc.exists() || !migrationDoc.data().lotteryPlansMigrated) {
              const batch = writeBatch(db);
              let added = false;
              LOTTERY_PLANS.forEach(plan => {
                if (!plans.find(p => p.id === plan.id)) {
                  const ref = doc(db, 'lotteryPlans', plan.id);
                  batch.set(ref, plan);
                  added = true;
                }
              });
              batch.set(migrationRef, { lotteryPlansMigrated: true }, { merge: true });
              await batch.commit();
              if (added) return; // onSnapshot will trigger again
            }
          }
        } catch (e) {
          console.error("Error running lottery plans migration:", e);
        }

        setLotteryPlans(plans);
      }
    }, (err) => {
      console.error("Error fetching lottery plans:", err);
    }));

    // Data that depends on login and user identity
    if (isLoggedIn && user.username) {
      
      // Fetch ALL tokens globally so everyone can see sold tokens in real-time
      // Requires rules to allow authenticated users to read tokens
      unsubs.push(onSnapshot(collection(db, 'tokens'), (snap) => {
        const allT = snap.docs.map(d => ({ ...d.data(), id: d.id } as any as Token));
        setAllTokens(allT);
        setTokens(user.role === 'ADMIN' ? allT : allT.filter(t => t.username === user.username));
      }, (err) => console.error("Token Listener Error:", err)));

      
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
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, 'users', cred.user.uid));
    if (userDoc.exists()) {
      return userDoc.data().role === 'ADMIN' ? 'ADMIN' : 'USER';
    }
    return true;
  };

  const signUp = async (userData: any) => {
    const res = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
    const role = userData.email === 'abdulsattarpsdm0@gmail.com' ? 'ADMIN' : 'USER';
    const newUser: User = {
      id: res.user.uid,
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      username: userData.username || userData.email.split('@')[0],
      email: userData.email,
      mobile: userData.mobile || '',
      role: role,
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

  const logout = async () => {
    await signOut(auth);
  };

  const deleteAccount = async (userId: string) => {
    await deleteDoc(doc(db, 'users', userId));
    if (user.id === userId) {
      if (auth.currentUser) {
        try {
          await deleteUser(auth.currentUser);
        } catch (error) {
          console.error("Error deleting auth user:", error);
        }
      }
      await logout();
    }
  };

  const addTokens = async (newTokens: Token[]) => {
    const batch = writeBatch(db);
    for (const t of newTokens) {
      const ref = doc(db, 'tokens', Math.random().toString(36).substr(2, 9));
      batch.set(ref, { ...t, username: user.username });
    }
    await batch.commit();

    if (newTokens.length > 0) {
      const planId = newTokens[0].planId;
      const plan = lotteryPlans.find(p => p.id === planId);
      if (plan) {
        const currentSoldCount = allTokens.filter(t => t.planId === planId && t.status === 'WAITING').length;
        if (currentSoldCount + newTokens.length >= plan.totalTokens) {
          await updateDoc(doc(db, 'lotteryPlans', planId), { isActive: false });
        }
      }
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
    
    try {
      // Find the transaction first to get the username
      const txDoc = await getDoc(txRef);
      if (!txDoc.exists()) throw new Error("Transaction not found");
      const txData = txDoc.data() as Transaction;
      
      if (txData.status !== 'PENDING') {
        console.log(`Transaction ${id} is already ${txData.status}, skipping.`);
        return;
      }

      // Find the user by username
      const usersQuery = query(collection(db, 'users'), where('username', '==', txData.username));
      const userDocs = await getDocs(usersQuery);
      let userRef = null;
      if (!userDocs.empty) {
        userRef = doc(db, 'users', userDocs.docs[0].id);
      }

      await runTransaction(db, async (transaction) => {
        const txSnap = await transaction.get(txRef);
        if (!txSnap.exists()) {
          throw new Error("Transaction does not exist!");
        }
        
        const currentTxData = txSnap.data() as Transaction;
        if (currentTxData.status !== 'PENDING') {
          return;
        }

        if (userRef) {
          if (currentTxData.type === 'DEPOSIT' && status === 'APPROVED') {
            transaction.update(userRef, { walletBalance: increment(currentTxData.netAmount) });
          } else if (currentTxData.type === 'WITHDRAWAL' && status === 'REJECTED') {
            transaction.update(userRef, { walletBalance: increment(currentTxData.amount) });
          }
        }
        
        transaction.update(txRef, { status });
      });
    } catch (error) {
      console.error("Transaction failed: ", error);
      throw error;
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

  const announceWinner = async (planId: string, winningNumbers: number[]) => {
    const plan = lotteryPlans.find(p => p.id === planId);
    if (!plan) throw new Error("Plan not found");

    const waitingTokens = allTokens.filter(t => t.planId === planId && t.status === 'WAITING');
    
    // Chunk into 200s to avoid exceeding 500 writes per batch
    const chunkSize = 200;
    for (let i = 0; i < waitingTokens.length; i += chunkSize) {
      const chunk = waitingTokens.slice(i, i + chunkSize);
      const batch = writeBatch(db);
      chunk.forEach(t => {
        const ref = doc(db, 'tokens', t.id);
        if (winningNumbers.includes(Number(t.number))) {
          batch.update(ref, { status: 'WINNER', prizeAmount: plan.prizePerWinner });
          // Also update the winner's wallet balance
          if (t.username) {
            const winnerUser = users.find(u => u.username === t.username);
            if (winnerUser) {
              const userRef = doc(db, 'users', winnerUser.id);
              batch.update(userRef, { 
                walletBalance: increment(plan.prizePerWinner),
                totalWinnings: increment(plan.prizePerWinner)
              });
            }
          }
        } else {
          batch.update(ref, { status: 'NOT_SELECTED' });
        }
      });
      await batch.commit();
    }

    // Record the draw
    const drawDoc = {
      id: Math.random().toString(36).substr(2, 9),
      planId,
      planName: plan.name,
      date: new Date().toISOString(),
      winningNumbers,
      winners: waitingTokens.filter(t => winningNumbers.includes(Number(t.number))).map(t => ({
        username: t.username,
        number: Number(t.number),
        prize: plan.prizePerWinner
      }))
    };
    await setDoc(doc(db, 'draws', drawDoc.id), drawDoc);

    // Re-enable the lottery plan so it's available for the next round
    await updateDoc(doc(db, 'lotteryPlans', planId), { isActive: true });
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ 
      user, users, isLoggedIn, tokens, allTokens, transactions, lotteryPlans, paymentMethods, draws, whatsappContact,
      login, signUp, logout, deleteAccount, addTokens, updateBalance, updateUserBalance, addTransaction, 
      updateTransactionStatus, addLottery, updateLottery, deleteLottery, addPaymentMethod, updatePaymentMethod, 
      deletePaymentMethod, updateWhatsappContact, announceWinner
    }}>
      <Router>
        <AppContent />
      </Router>
    </UserContext.Provider>
  );
};

export default App;
