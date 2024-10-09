export type Fiat = {
  id: string;
  name:string;
  symbol: string;
  short_symbol: string;
  exchange_rate: number;
};

export type Blockchain = {
  id: string;
  name: string;
  icon: string;
  transaction_link: string;
};

export type Wallet = {
  id: string;
  user:string;
  name: string;
  address: string;
  description: string;
  balance: number;
  capital_gain: number;
  unrealized_gain: number;
};

export type Contract = {
  id: string;
  name: string;
  symbol: string;
  relative_symbol: string;
  address: string;
  logo_uri: string;
  decimals: number;
  price: number;
  previous_day_price: number;
  previous_week_price: number;
  previous_month_price: number;
  previous_day: string;
  previous_week: string;
  previous_month: string;
  category: string;
  blockchain: Blockchain;
};

export type Position = {
  id: string;
  daily_price_delta: number;
  weekly_price_delta: number;
  monthly_price_delta: number;
  price: number;
  quantity: number;
  amount: number;
  capital_gain: number;
  unrealized_gain: number;
  average_cost: number;
  contract: Contract;
  wallet: Wallet;
};

export type Transaction = {
  id: string;
  position: Position;
  type: string;
  quantity: number;
  date: string;
  comment: string;
  hash: string;
  price: number;
  running_quantity: number;
  buy_quantity: number;
  sell_quantity: number;
  cost: number;
  average_cost: number;
  total_cost: number;
  capital_gain: number;
  against_contract: Contract;
  against_fiat: Fiat;
};