export type Wallet = {
    id: number;
    name: string;
    address: string;
    description: string;
    balance: string;
    positions: any[];
  };

export type Position = {
  id : number;
  quantity : string;
  contract : string;
  average_cost : string;
  transactions: any[];
}