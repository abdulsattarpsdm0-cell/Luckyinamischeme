
import { createContext, useContext } from 'react';
import { User, Token, Transaction, LotteryPlan, Draw } from '../types';

export interface PaymentMethod {
  id: string;
  name: string;
  title: string;
  number: string;
  status: 'ACTIVE' | 'INACTIVE';
  type: string;
  logoUrl?: string;
  qrCodeUrl?: string;
}

interface UserContextType {
  user: User;
  users: User[]; 
  isLoggedIn: boolean;
  tokens: Token[];
  allTokens: Token[];
  transactions: Transaction[];
  lotteryPlans: LotteryPlan[];
  paymentMethods: PaymentMethod[];
  draws: Draw[];
  whatsappContact: string;
  login: (email?: string, password?: string) => Promise<string | boolean>;
  signUp: (userData: any) => Promise<boolean>;
  logout: () => Promise<void>;
  deleteAccount: (userId: string) => Promise<void>;
  addTokens: (tokens: Token[]) => Promise<void>;
  updateBalance: (amount: number) => Promise<void>;
  updateUserBalance: (userId: string, amount: number) => Promise<void>;
  addTransaction: (tx: Transaction) => Promise<void>;
  updateTransactionStatus: (id: string, status: 'APPROVED' | 'REJECTED') => Promise<void>;
  addLottery: (plan: LotteryPlan) => Promise<void>;
  updateLottery: (plan: LotteryPlan) => Promise<void>;
  deleteLottery: (id: string) => Promise<void>;
  addPaymentMethod: (method: PaymentMethod) => Promise<void>;
  updatePaymentMethod: (method: PaymentMethod) => Promise<void>;
  deletePaymentMethod: (id: string) => Promise<void>;
  updateWhatsappContact: (link: string) => Promise<void>;
  announceWinner: (planId: string, winningNumbers: number[]) => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};
