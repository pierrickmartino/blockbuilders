import { fetcher_blob } from "./fetcher";

export async function exportTransactions(id: string) {
    try {
      const response = await fetcher_blob(`/api/positions/${id}/export/csv/`);
      return response;
    } catch (error) {
      console.error("Error during export transactions request:", error);
      throw error; // Ensure the error propagates
    }
  }

export async function exportAllTransactions() {
    try {
      const response = await fetcher_blob(`/api/transactions/export/csv/`);
      return response;
    } catch (error) {
      console.error("Error during export transactions request:", error);
      throw error; // Ensure the error propagates
    }
  }

export async function exportAllPositions() {
    try {
      const response = await fetcher_blob(`/api/positions/export/csv/`);
      return response;
    } catch (error) {
      console.error("Error during export positions request:", error);
      throw error; // Ensure the error propagates
    }
  }