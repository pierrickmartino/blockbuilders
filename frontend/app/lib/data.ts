import axios from "axios";
import { Wallet } from "./definition";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const fetchWallets = async (setWallets: React.Dispatch<React.SetStateAction<Wallet[]>>): Promise<void> => {
  try {
    console.log('Fetching revenue data...');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const response = await axios.get(`${apiUrl}/api/wallets/`, {
      headers: {
        'Authorization': "Token c40feb748f0e17b3d7472ed387a566e9d632d4c8",
      },
    });

    console.log('Data fetch completed after 3 seconds.');

    const wallets: Wallet[] = response.data.results || [];
    setWallets(wallets.reverse());

  } catch (err) {
    console.error("Error fetching data from wallet API:", err);
    throw new Error("Failed to fetch all wallets.");
  }
}
