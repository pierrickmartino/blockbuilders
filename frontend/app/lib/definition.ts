export type Fiat = {
  id: string;
  name:string;
  symbol: string;
  short_symbol: string;
  exchange_rate: string;
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
  blockchain: Blockchain;
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
  position: Position;
  type: string;
  quantity: string;
  date: string;
  comment: string;
  hash: string;
  price: string;
  running_quantity: string;
  buy_quantity: string;
  sell_quantity: string;
  cost: string;
  average_cost: string;
  total_cost: string;
  capital_gain: string;
  against_contract: Contract;
  against_fiat: Fiat;
};