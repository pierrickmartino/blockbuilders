import axios from "axios";
import {
  Position,
  Wallet,
  Transaction,
  Blockchain,
  Contract,
} from "./definition";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4000";
const userToken = process.env.NEXT_PUBLIC_USER_TOKEN || "";

export const fetchWallets = async (
  setWallets: React.Dispatch<React.SetStateAction<Wallet[]>>,
  setTotalCount: React.Dispatch<React.SetStateAction<number>>,
  page: number,
  rowsPerPage: number
): Promise<void> => {
  try {
    console.log("User Token:", process.env.NEXT_PUBLIC_USER_TOKEN);
    const response = await axios.get(`${apiUrl}/api/wallets`, {
      headers: {
        Authorization: `Token ${userToken}`,
      },
      params: {
        page: page + 1, // Convert 0-based page index to 1-based if needed by API
        limit: rowsPerPage,
      },
    });

    if (response.data.results) {
      setWallets(response.data.results); // Ensure the wallets are correctly set
      setTotalCount(response.data.count); // Update total count if pagination is enabled
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
    const response = await axios.get(
      `${apiUrl}/api/wallets/${wallet_id}/positions`,
      {
        headers: {
          Authorization: `Token ${userToken}`,
        },
        params: {
          search: searchTerm,
          page: page + 1, // Convert 0-based page index to 1-based if needed by API
          limit: rowsPerPage,
        },
      }
    );

    if (response.data.results) {
      setPositions(response.data.results); // Ensure the positions are correctly set
      setTotalCount(response.data.count); // Update total count if pagination is enabled
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
    const response = await axios.get(`${apiUrl}/api/positions`, {
      headers: {
        Authorization: `Token ${userToken}`,
      },
      params: {
        search: searchTerm,
        page: page + 1, // Convert 0-based page index to 1-based if needed by API
        limit: rowsPerPage,
      },
    });

    if (response.data.results) {
      setPositions(response.data.results); // Ensure the positions are correctly set
      setTotalCount(response.data.count); // Update total count if pagination is enabled
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
    const response = await axios.get(
      `${apiUrl}/api/wallets/${wallet_id}/positions`,
      {
        headers: {
          Authorization: `Token ${userToken}`,
        },
        params: {
          page: page + 1, // Convert 0-based page index to 1-based if needed by API
          limit: rowsPerPage,
        },
      }
    );

    if (response.data.results) {
      setPositions(response.data.results); // Ensure the positions are correctly set
      setTotalCount(response.data.count); // Update total count if pagination is enabled
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
    const response = await axios.get(`${apiUrl}/api/positions`, {
      headers: {
        Authorization: `Token ${userToken}`,
      },
      params: {
        page: page + 1, // Convert 0-based page index to 1-based if needed by API
        limit: rowsPerPage,
      },
    });

    if (response.data.results) {
      setPositions(response.data.results); // Ensure the positions are correctly set
      setTotalCount(response.data.count); // Update total count if pagination is enabled
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
    const response = await axios.get(`${apiUrl}/api/positions/top/${max}`, {
      headers: {
        Authorization: `Token ${userToken}`,
      },
    });

    if (response.data.results) {
      setTopPositions(response.data.results); // Ensure the positions are correctly set
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
    const response = await axios.get(`${apiUrl}/api/blockchains/top/${max}`, {
      headers: {
        Authorization: `Token ${userToken}`,
      },
    });

    if (response.data.results) {
      setTopBlockchains(response.data.results); // Ensure the blockchains are correctly set
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
    const response = await axios.get(`${apiUrl}/api/transactions/last/${max}`, {
      headers: {
        Authorization: `Token ${userToken}`,
      },
    });

    if (response.data.results) {
      setLastTransactions(response.data.results); // Ensure the transactions are correctly set
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
    const response = await axios.get(`${apiUrl}/api/transactions/count`, {
      headers: {
        Authorization: `Token ${userToken}`,
      },
    });

    if (response.data) {
      setCountTransactions(response.data.counter); // Ensure the transactions are correctly set
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
    const response = await axios.get(
      `${apiUrl}/api/wallets/${wallet_id}/positions/${position_id}/transactions`,
      {
        headers: {
          Authorization: `Token ${userToken}`,
        },
        params: {
          page: page + 1, // Convert 0-based page index to 1-based if needed by API
          limit: rowsPerPage,
        },
      }
    );

    if (response.data.results) {
      setTransactions(response.data.results); // Ensure the transactions are correctly set
      setTotalCount(response.data.count); // Update total count if pagination is enabled
    }
  } catch (err) {
    console.error("Error fetching data from transaction API:", err);
    setTransactions([]); // Set empty transactions if fetching fails
    throw new Error("Failed to fetch all transactions.");
  }
};

export const fetchTransactionsAll = async (
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>,
  setTotalCount: React.Dispatch<React.SetStateAction<number>>,
  page: number,
  rowsPerPage: number
): Promise<void> => {
  try {
    const response = await axios.get(`${apiUrl}/api/transactions`, {
      headers: {
        Authorization: `Token ${userToken}`,
      },
      params: {
        page: page + 1, // Convert 0-based page index to 1-based if needed by API
        limit: rowsPerPage,
      },
    });

    if (response.data.results) {
      setTransactions(response.data.results); // Ensure the transactions are correctly set
      setTotalCount(response.data.count); // Update total count if pagination is enabled
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
    const response = await axios.get(
      `${apiUrl}/api/wallets/${wallet_id}/positions/${position_id}/transactions`,
      {
        headers: {
          Authorization: `Token ${userToken}`,
        },
        params: {
          search: searchTerm,
          page: page + 1, // Convert 0-based page index to 1-based if needed by API
          limit: rowsPerPage,
        },
      }
    );

    if (response.data.results) {
      setTransactions(response.data.results); // Ensure the transactions are correctly set
      setTotalCount(response.data.count); // Update total count if pagination is enabled
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
    const response = await axios.get(`${apiUrl}/api/transactions`, {
      headers: {
        Authorization: `Token ${userToken}`,
      },
      params: {
        search: searchTerm,
        page: page + 1, // Convert 0-based page index to 1-based if needed by API
        limit: rowsPerPage,
      },
    });

    if (response.data.results) {
      setTransactions(response.data.results); // Ensure the transactions are correctly set
      setTotalCount(response.data.count); // Update total count if pagination is enabled
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
    const response = await axios.get(`${apiUrl}/api/contracts`, {
      headers: {
        Authorization: `Token ${userToken}`,
      },
      params: {
        page: page + 1, // Convert 0-based page index to 1-based if needed by API
        limit: rowsPerPage,
      },
    });

    if (response.data.results) {
      setContracts(response.data.results); // Ensure the transactions are correctly set
      setTotalCount(response.data.count); // Update total count if pagination is enabled
    }
  } catch (err) {
    console.error("Error fetching data from transaction API:", err);
    setContracts([]); // Set empty transactions if fetching fails
    throw new Error("Failed to fetch all transactions.");
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
    const response = await axios.get(`${apiUrl}/api/contracts`, {
      headers: {
        Authorization: `Token ${userToken}`,
      },
      params: {
        search: searchTerm,
        page: page + 1, // Convert 0-based page index to 1-based if needed by API
        limit: rowsPerPage,
      },
    });

    if (response.data.results) {
      setContracts(response.data.results); // Ensure the transactions are correctly set
      setTotalCount(response.data.count); // Update total count if pagination is enabled
    }
  } catch (err) {
    console.error("Error fetching data from transaction API:", err);
    setContracts([]); // Set empty transactions if fetching fails
    throw new Error("Failed to fetch all transactions.");
  }
};

export const fetchTaskStatus = async (task_id: string): Promise<string> => {
  try {
    const response = await axios.get(`${apiUrl}/api/tasks/${task_id}/status`, {
      headers: {
        Authorization: `Token ${userToken}`,
      },
    });

    if (response.data) {
      return response.data.status;
    } else {
      throw new Error("Task status not found in response.");
    }
  } catch (err) {
    console.error("Error fetching task status:", err);
    throw new Error("Failed to fetch task status.");
  }
};
