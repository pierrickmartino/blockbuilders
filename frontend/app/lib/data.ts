import {
  Position,
  Wallet,
  Transaction,
  Blockchain,
  Contract,
  MarketData,
  CapitalGainHisto,
} from "./definition";
import { fetcher } from "./fetcher";

export const fetchWallets = async (
  setWallets: React.Dispatch<React.SetStateAction<Wallet[]>>,
  setTotalCount: React.Dispatch<React.SetStateAction<number>>,
  page: number,
  rowsPerPage: number
): Promise<void> => {

  try {
    const response = await fetcher(`/api/wallets/?page=${page+1}&limit=${rowsPerPage}`);

    if (response) {
      setWallets(response.results); // Ensure the wallets are correctly set
      setTotalCount(response.count); // Update total count if pagination is enabled
    }
  } catch (err) {
    console.error("Error fetching data from wallet API:", err);
    setWallets([]); // Set empty wallets if fetching fails
    throw new Error("Failed to fetch all wallets.");
  }
};

export const fetchPositionsWithSearch = async (
  wallet_id: string,
  searchTerm: string,
  setPositions: React.Dispatch<React.SetStateAction<Position[]>>,
  setTotalCount: React.Dispatch<React.SetStateAction<number>>,
  page: number,
  rowsPerPage: number
): Promise<void> => {

  try {
    const response = await fetcher(`/api/wallets/${wallet_id}/positions/?search=${searchTerm}&page=${page+1}&limit=${rowsPerPage}`);

    if (response.results) {
      setPositions(response.results); // Ensure the positions are correctly set
      setTotalCount(response.count); // Update total count if pagination is enabled
    }
  } catch (err) {
    console.error("Error fetching data from position API:", err);
    setPositions([]); // Set empty positions if fetching fails
    throw new Error("Failed to fetch all positions.");
  }
};

export const fetchPositionsAllWithSearch = async (
  searchTerm: string,
  setPositions: React.Dispatch<React.SetStateAction<Position[]>>,
  setTotalCount: React.Dispatch<React.SetStateAction<number>>,
  page: number,
  rowsPerPage: number
): Promise<void> => {

  try {
    const response = await fetcher(`/api/positions/?search=${searchTerm}&page=${page+1}&limit=${rowsPerPage}`);
    
    if (response.results) {
      setPositions(response.results); // Ensure the positions are correctly set
      setTotalCount(response.count); // Update total count if pagination is enabled
    }
  } catch (err) {
    console.error("Error fetching data from position API:", err);
    setPositions([]); // Set empty positions if fetching fails
    throw new Error("Failed to fetch all positions.");
  }
};

export const fetchPositions = async (
  wallet_id: string,
  setPositions: React.Dispatch<React.SetStateAction<Position[]>>,
  setTotalCount: React.Dispatch<React.SetStateAction<number>>,
  page: number,
  rowsPerPage: number
): Promise<void> => {

  try {
    const response = await fetcher(`/api/wallets/${wallet_id}/positions/?page=${page+1}&limit=${rowsPerPage}`);

    if (response.results) {
      setPositions(response.results); // Ensure the positions are correctly set
      setTotalCount(response.count); // Update total count if pagination is enabled
    }
  } catch (err) {
    console.error("Error fetching data from position API:", err);
    setPositions([]); // Set empty positions if fetching fails
    throw new Error("Failed to fetch all positions.");
  }
};

export const fetchPositionsAll = async (
  setPositions: React.Dispatch<React.SetStateAction<Position[]>>,
  setTotalCount: React.Dispatch<React.SetStateAction<number>>,
  page: number,
  rowsPerPage: number
): Promise<void> => {

 
  try {
    const response = await fetcher(`/api/positions/?page=${page+1}&limit=${rowsPerPage}`);

    if (response.results) {
      setPositions(response.results); // Ensure the positions are correctly set
      setTotalCount(response.count); // Update total count if pagination is enabled
    }
  } catch (err) {
    console.error("Error fetching data from position API:", err);
    setPositions([]); // Set empty positions if fetching fails
    throw new Error("Failed to fetch all positions.");
  }
};

export const fetchTopPositions = async (
  max: number,
  setTopPositions: React.Dispatch<React.SetStateAction<Position[]>>
): Promise<void> => {

 
  try {
    const response = await fetcher(`/api/positions/top/${max}`);
    
    if (response.results) {
      setTopPositions(response.results); // Ensure the positions are correctly set
    }
  } catch (err) {
    console.error("Error fetching data from top position API:", err);
    setTopPositions([]); // Set empty positions if fetching fails
    throw new Error("Failed to fetch all positions.");
  }
};

export const fetchTopBlockchains = async (
  max: number,
  setTopBlockchains: React.Dispatch<React.SetStateAction<Blockchain[]>>
): Promise<void> => {

  

  try {
    const response = await fetcher(`/api/blockchains/top/${max}`);

    if (response.results) {
      setTopBlockchains(response.results); // Ensure the blockchains are correctly set
    }
  } catch (err) {
    console.error("Error fetching data from top blockchain API:", err);
    setTopBlockchains([]); // Set empty blockchains if fetching fails
    throw new Error("Failed to fetch all blockchains.");
  }
};

export const fetchLastTransactions = async (
  max: number,
  setLastTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>
): Promise<void> => {

  try {
    const response = await fetcher(`/api/transactions/last/${max}`);    

    if (response.results) {
      setLastTransactions(response.results); // Ensure the transactions are correctly set
    }
  } catch (err) {
    console.error("Error fetching data from last transactions API:", err);
    setLastTransactions([]); // Set empty transactions if fetching fails
    throw new Error("Failed to fetch all transactions.");
  }
};

export const fetchCountTransactions = async (
  setCountTransactions: React.Dispatch<React.SetStateAction<number>>
): Promise<void> => {

  try {
    const response = await fetcher(`/api/transactions/count`);    
    
    if (response) {
      setCountTransactions(response.counter); // Ensure the transactions are correctly set
    }
  } catch (err) {
    console.error("Error fetching data from last transactions API:", err);
    setCountTransactions(0); // Set empty transactions if fetching fails
    throw new Error("Failed to fetch all transactions.");
  }
};

export const fetchTransactions = async (
  position_id: string,
  wallet_id: string,
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>,
  setTotalCount: React.Dispatch<React.SetStateAction<number>>,
  page: number,
  rowsPerPage: number
): Promise<void> => {

  try {
    const response = await fetcher(`/api/wallets/${wallet_id}/positions/${position_id}/transactions/?page=${page+1}&limit=${rowsPerPage}`);

    if (response.results) {
      setTransactions(response.results); // Ensure the transactions are correctly set
      setTotalCount(response.count); // Update total count if pagination is enabled
    }
  } catch (err) {
    console.error("Error fetching data from transaction API:", err);
    setTransactions([]); // Set empty transactions if fetching fails
    throw new Error("Failed to fetch all transactions.");
  }
};

export const fetchPositionCapitalGainHisto = async (
  offset: number,
  position_id: string,
  setPositionCapitalGainHisto: React.Dispatch<React.SetStateAction<CapitalGainHisto[]>>,
): Promise<void> => {

  try {
    const response = await fetcher(`/api/positions/${position_id}/capitalgains/${offset}`);

    if (response) {
      setPositionCapitalGainHisto(response);
    }
  } catch (err) {
    console.error("Error fetching data from capital gain API:", err);
    setPositionCapitalGainHisto([]); // Set empty transactions if fetching fails
    throw new Error("Failed to fetch capital gains.");
  }
};

export const fetchTransactionsAll = async (
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>,
  setTotalCount: React.Dispatch<React.SetStateAction<number>>,
  page: number,
  rowsPerPage: number
): Promise<void> => {

  try {
    const response = await fetcher(`/api/transactions/?page=${page+1}&limit=${rowsPerPage}`);
    
    if (response.results) {
      setTransactions(response.results); // Ensure the transactions are correctly set
      setTotalCount(response.count); // Update total count if pagination is enabled
    }
  } catch (err) {
    console.error("Error fetching data from transaction API:", err);
    setTransactions([]); // Set empty transactions if fetching fails
    throw new Error("Failed to fetch all transactions.");
  }
};

export const fetchTransactionsWithSearch = async (
  position_id: string,
  wallet_id: string,
  searchTerm: string,
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>,
  setTotalCount: React.Dispatch<React.SetStateAction<number>>,
  page: number,
  rowsPerPage: number
): Promise<void> => {

  try {
    const response = await fetcher(`/api/wallets/${wallet_id}/positions/${position_id}/transactions/?search=${searchTerm}&page=${page+1}&limit=${rowsPerPage}`);
    
    if (response.results) {
      setTransactions(response.results); // Ensure the transactions are correctly set
      setTotalCount(response.count); // Update total count if pagination is enabled
    }
  } catch (err) {
    console.error("Error fetching data from transaction API:", err);
    setTransactions([]); // Set empty transactions if fetching fails
    throw new Error("Failed to fetch all transactions.");
  }
};

export const fetchTransactionsAllWithSearch = async (
  searchTerm: string,
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>,
  setTotalCount: React.Dispatch<React.SetStateAction<number>>,
  page: number,
  rowsPerPage: number
): Promise<void> => {
  
  try {
    const response = await fetcher(`/api/transactions/?search=${searchTerm}&page=${page+1}&limit=${rowsPerPage}`);
  
    if (response.results) {
      setTransactions(response.results); // Ensure the transactions are correctly set
      setTotalCount(response.count); // Update total count if pagination is enabled
    }
  } catch (err) {
    console.error("Error fetching data from transaction API:", err);
    setTransactions([]); // Set empty transactions if fetching fails
    throw new Error("Failed to fetch all transactions.");
  }
};

export const fetchContractsAll = async (
  setContracts: React.Dispatch<React.SetStateAction<Contract[]>>,
  setTotalCount: React.Dispatch<React.SetStateAction<number>>,
  page: number,
  rowsPerPage: number
): Promise<void> => {

  try {
    const response = await fetcher(`/api/contracts/?page=${page+1}&limit=${rowsPerPage}`);
    
    if (response.results) {
      setContracts(response.results); // Ensure the transactions are correctly set
      setTotalCount(response.count); // Update total count if pagination is enabled
    }
  } catch (err) {
    console.error("Error fetching data from transaction API:", err);
    setContracts([]); // Set empty transactions if fetching fails
    throw new Error("Failed to fetch all transactions.");
  }
};

export const fetchContractMarketPriceHisto = async (
  offset: number,
  symbol: string,
  reference: string,
  setMarketDataHisto: React.Dispatch<React.SetStateAction<MarketData[]>>,
): Promise<void> => {

  try {
    const response = await fetcher(`/api/marketdatas/${symbol}/${reference}/${offset}`);
    
    if (response.results) {
      setMarketDataHisto(response.results);
    }
  } catch (err) {
    console.error("Error fetching data from market data API:", err);
    setMarketDataHisto([]); // Set empty transactions if fetching fails
    throw new Error("Failed to fetch market data.");
  }
};

export const fetchContractsAllWithSearch = async (
  searchTerm: string,
  setContracts: React.Dispatch<React.SetStateAction<Contract[]>>,
  setTotalCount: React.Dispatch<React.SetStateAction<number>>,
  page: number,
  rowsPerPage: number
): Promise<void> => {

  try {
    const response = await fetcher(`/api/contracts/?search=${searchTerm}&page=${page+1}&limit=${rowsPerPage}`);
    
    if (response.results) {
      setContracts(response.results); // Ensure the transactions are correctly set
      setTotalCount(response.count); // Update total count if pagination is enabled
    }
  } catch (err) {
    console.error("Error fetching data from transaction API:", err);
    setContracts([]); // Set empty transactions if fetching fails
    throw new Error("Failed to fetch all transactions.");
  }
};

export const fetchTaskStatus = async (task_id: string): Promise<string> => {
  
  try {
    const response = await fetcher(`/api/tasks/${task_id}/status`);
    
    if (response) {
      return response.status;
    } else {
      throw new Error("Task status not found in response.");
    }
  } catch (err) {
    console.error("Error fetching task status:", err);
    throw new Error("Failed to fetch task status.");
  }
};
