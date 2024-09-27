import axios from "axios";
import { Position, Wallet } from "./definition";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4000";

export const fetchWallets = async (
  setWallets: React.Dispatch<React.SetStateAction<Wallet[]>>
): Promise<void> => {
  try {
    const response = await axios.get(`${apiUrl}/api/wallets/`, {
      headers: {
        Authorization: "Token c40feb748f0e17b3d7472ed387a566e9d632d4c8",
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
  wallet_id: number,
  setPositions: React.Dispatch<React.SetStateAction<Position[]>>
): Promise<void> => {
  try {
    const response = await axios.get(
      `${apiUrl}/api/wallets/${wallet_id}/positions`,
      {
        headers: {
          Authorization: "Token c40feb748f0e17b3d7472ed387a566e9d632d4c8",
        },
      }
    );

    const positions: Position[] = response.data.results || [];
    setPositions(positions.reverse());
  } catch (err) {
    console.error("Error fetching data from position API:", err);
    throw new Error("Failed to fetch all positions.");
  }
};
