export type Wallet = {
  id: number;
  name: string;
  address: string;
  description: string;
  balance: string;
  positions: any[];
};

export type Position = {
  id: number;
  perf_daily: string;
  perf_weekly: string;
  perf_monthly: string;
  price: string;
  quantity: string;
  amount: string;
  realized_gain: string;
  unrealized_gain: string;
  contract: string;
  average_cost: string;
  transactions: any[];
};

export type Transaction = {
  id: number;
  perf_daily: string;
  perf_weekly: string;
  perf_monthly: string;
  price: string;
  quantity: string;
  amount: string;
  realized_gain: string;
  unrealized_gain: string;
  contract: string;
  average_cost: string;
};