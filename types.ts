
export enum PlanType {
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM'
}

export type DrawCycle = 'WEEKLY' | 'MONTHLY';

export interface LotteryPlan {
  id: string;
  name: string;
  tokenPrice: number;
  totalTokens: number;
  totalWinners: number;
  prizePerWinner: number; 
  prizeName?: string;    
  drawTime: string; 
  drawDay: string;  
  drawCycle: DrawCycle; 
  colorClass: string;
  bgClass: string;
  icon: string;
  image?: string;   
  referralThreshold: number; 
  referralRewardCount: number; 
  isReferralEnabled: boolean; 
  isActive: boolean; 
}

export interface Token {
  id: string; // Changed from number to string for Firebase compatibility
  number: number;
  planId: string;
  purchaseDate: string;
  drawDate: string;
  status: 'WAITING' | 'WINNER' | 'NOT_SELECTED';
  prizeAmount?: number;
  username?: string;
}

export interface Transaction {
  id: string;
  date: string;
  type: 'DEPOSIT' | 'WITHDRAWAL';
  amount: number;
  charges: number;
  netAmount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  method: 'EasyPaisa' | 'JazzCash';
  accountNumber?: string; 
  accountName?: string;   
  proofImage?: string;    
  username: string;       
  txId?: string;          
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  mobile: string;
  role: 'ADMIN' | 'USER';
  password?: string; 
  joinDate?: string; 
  walletBalance: number;
  referralCode: string;
  referralsCount: number; 
  activeReferrals: number; 
  totalWinnings: number;
  planReferralStats: Record<string, number>;
}
