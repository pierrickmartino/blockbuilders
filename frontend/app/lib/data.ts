import axios from "axios";
import { Position, Wallet, Transaction } from "./definition";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4000";
const userToken = process.env.NEXT_PUBLIC_USER_TOKEN || "";

export const fetchWallets = async (
  setWallets: React.Dispatch<React.SetStateAction<Wallet[]>>
): Promise<void> => {
  try {
    console.log("User Token:", process.env.NEXT_PUBLIC_USER_TOKEN);
    const response = await axios.get(`${apiUrl}/api/wallets/`, {
      headers: {
        Authorization: `Token ${userToken}`,
      },
    });

    const wallets: Wallet[] = response.data.results || [];
    setWallets(wallets.reverse());
  } catch (err) {
    console.error("Error fetching data from wallet API:", err);
    throw new Error("Failed to fetch all wallets.");
  }
};

// export const deleteWallet = async (wallet_id: Number): Promise<void> => {
//   try {
//     const response = await axios.delete(`${apiUrl}/api/wallets/${wallet_id}`, {
//       headers: {
//         Authorization: "Token c40feb748f0e17b3d7472ed387a566e9d632d4c8",
//       },
//     });

//     const wallets: Wallet[] = response.data.results || [];
//     // setWallets(wallets.filter((wallet) => wallet.id !== wallet_id));
//   } catch (err) {
//     console.error("Error fetching data from wallet API:", err);
//     throw new Error("Failed to fetch all wallets.");
//   }
// };

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
    setTotalCount(count); // Set the total count for pagination
  } catch (err) {
    console.error("Error fetching data from position API:", err);
    throw new Error("Failed to fetch all positions.");
  }
};

export const fetchTransactions = async (
  position_id: string,
  wallet_id: string,
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>
): Promise<void> => {
  try {
    const response = await axios.get(
      `${apiUrl}/api/wallets/${wallet_id}/positions/${position_id}/transactions`,
      {
        headers: {
          Authorization: `Token ${userToken}`,
        },
      }
    );

    const transactions: Transaction[] = response.data.results || [];
    setTransactions(transactions.reverse());
  } catch (err) {
    console.error("Error fetching data from transaction API:", err);
    throw new Error("Failed to fetch all transactions.");
  }
};

