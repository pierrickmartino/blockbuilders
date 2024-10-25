import axios from "axios";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://backend:4000";
const userToken = process.env.NEXT_PUBLIC_USER_TOKEN || "";

export async function exportTransactions(id: string) {
    try {
      const response = await axios.get(
        `${backendUrl}/api/positions/${id}/export/csv/`,
        {
          headers: {
            Authorization: `Token ${userToken}`,
          },
          responseType: "blob", // Set responseType to blob to handle file downloads
        }
      );
      console.log("Received response from exportTransactions:", response);
      return response;
    } catch (error) {
      console.error("Error during export transactions request:", error);
      throw error; // Ensure the error propagates
    }
  }