export type Wallet = {
  id: string;
  user:string;
  name: string;
  address: string;
  description: string;
  balance: string;
};

export type Contract = {
  id: string;
  name: string;
  symbol: string;
  relative_symbol: string;
  address: string;
  logo_uri: string;
  decimals: string;
  price: string;
  previous_day_price: string;
  previous_week_price: string;
  previous_month_price: string;
  previous_day: string;
  previous_week: string;
  previous_month: string;
  category: string;
  blockchain: string;
};

export type Position = {
  id: string;
  daily_price_delta: string;
  weekly_price_delta: string;
  monthly_price_delta: string;
  price: string;
  quantity: string;
  amount: string;
  capital_gain: string;
  unrealized_gain: string;
  average_cost: string;
  contract: Contract;
  wallet: Wallet;
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