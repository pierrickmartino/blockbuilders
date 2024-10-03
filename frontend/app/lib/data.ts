import axios from "axios";
import { Position, Wallet, Transaction } from "./definition";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4000";
const userToken = process.env.NEXT_PUBLIC_USER_TOKEN || "";

export const fetchWallets = async (
  setWallets: React.Dispatch<React.SetStateAction<Wallet[]>>,
  setTotalCount: React.Dispatch<React.SetStateAction<number>>,
  page: number,
  rowsPerPage: number,
): Promise<void> => {
  try {
    console.log("User Token:", process.env.NEXT_PUBLIC_USER_TOKEN);
    const response = await axios.get(`${apiUrl}/api/wallets?page=${page + 1}&limit=${rowsPerPage}`, {
      headers: {
        Authorization: `Token ${userToken}`,
      },
    });

    const wallets: Wallet[] = response.data.results || [];
    setWallets(wallets.reverse());

    const count = response.data.count || 0;
    setTotalCount(count);
  } catch (err) {
    console.error("Error fetching data from wallet API:", err);
    throw new Error("Failed to fetch all wallets.");
  }
};

export const fetchPositions = async (
  wallet_id: string,
  setPositions: React.Dispatch<React.SetStateAction<Position[]>>,
  setTotalCount: React.Dispatch<React.SetStateAction<number>>,
  page: number,
  rowsPerPage: number,
): Promise<void> => {
  try {
    const response = await axios.get(
      `${apiUrl}/api/wallets/${wallet_id}/positions?page=${page + 1}&limit=${rowsPerPage}`,
      {
        headers: {
          Authorization: `Token ${userToken}`,
        },
      }
    );

    const positions: Position[] = response.data.results || [];
    setPositions(positions.reverse());

    const count = response.data.count || 0;
    setTotalCount(count);
  } catch (err) {
    console.error("Error fetching data from position API:", err);
    throw new Error("Failed to fetch all positions.");
  }
};

export const fetchTransactions = async (
  position_id: string,
  wallet_id: string,
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>,
  setTotalCount: React.Dispatch<React.SetStateAction<number>>,
  page: number,
  rowsPerPage: number,
): Promise<void> => {
  try {
    const response = await axios.get(
      `${apiUrl}/api/wallets/${wallet_id}/positions/${position_id}/transactions?page=${page + 1}&limit=${rowsPerPage}`,
      {
        headers: {
          Authorization: `Token ${userToken}`,
        },
      }
    );

    const transactions: Transaction[] = response.data.results || [];
    setTransactions(transactions.reverse());

    const count = response.data.count || 0;
    setTotalCount(count);
  } catch (err) {
    console.error("Error fetching data from transaction API:", err);
    throw new Error("Failed to fetch all transactions.");
  }
};

