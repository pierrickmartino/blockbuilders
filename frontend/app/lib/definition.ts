export type Wallet = {
  id: string;
  name: string;
  address: string;
  description: string;
  balance: string;
  positions: any[];
};

export type Position = {
  id: string;
  perf_daily: string;
  perf_weekly: string;
  perf_monthly: string;
  price: string;
  quantity: string;
  amount: string;
  capital_gain: string;
  unrealized_gain: string;
  // contract: string;
  average_cost: string;
  contract: any;
  wallet: any;
  // transactions: any[];
};

export type Transaction = {
  id: string;
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