"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import axios from "axios";
import { getAuthToken } from "./get-token";

// const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4000";
const webUrl = process.env.NEXT_PUBLIC_WEB_URL || "http://127.0.0.1";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://backend:4000";
const userToken = process.env.NEXT_PUBLIC_USER_TOKEN || "";

const FormSchema = z.object({
  address: z.string(),
  name: z.string(),
  description: z.string(),
});

const CreateWallet = FormSchema;
// const UpdateWallet = FormSchema.omit({ date: true, id: true });

export type State = {
  errors?: {
    address?: string[];
    name?: string[];
    description?: string[];
  };
  message?: string | null;
};

export async function createWallet(
  prevState: State,
  formData: { address: string; name: string; description: string }
) {
  // Validate form fields using Zod
  const validatedFields = CreateWallet.safeParse(formData);

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Wallet.",
    };
  }

  // Prepare data for insertion into the database
  const { address, name, description } = validatedFields.data;

  // Get the user auth token
  const authToken = await getAuthToken();
  if (!authToken) throw new Error("No auth token found");

  // Log the data being sent
  // console.log("Data being sent:", { address, name, description });
  // console.log("Request URL:", `${apiUrl}/api/wallets/`);

  // Insert data into the database
  try {
    const response = await axios.post(
      `${backendUrl}/api/wallets/`,
      {
        address, // Wallet address
        name, // Wallet name
        description, // Wallet description
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
          Accept: "*/*",
          "Accept-Encoding": "gzip, deflate, br",
          Connection: "keep-alive",
        },
      }
    );

    // Only redirect if the API request was successful
    if (response.status === 201) {
      console.log("Wallet created successfully!");

      // Revalidate the cache for the wallets page and redirect the user.
      revalidatePath(`${webUrl}/dashboard/wallets`);
      redirect(`${webUrl}/dashboard/wallets`);
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      // Log the error for debugging
      console.error(
        "Error creating wallet:",
        error.response ? error.response.data : error.message
      );
    } else if (error instanceof Error) {
      console.error("Error creating wallet:", error.message);
    } else {
      console.error("An unexpected error occurred:", error);
    }

    // If a database error occurs, return a more specific error.
    return {
      message: "Database Error: Failed to Create Wallet.",
    };
  }

  // Revalidate the cache for the wallets page and redirect the user.
  revalidatePath(`${webUrl}/dashboard/wallets`);
  redirect(`${webUrl}/dashboard/wallets`);
}

export async function downloadWallet(id: string) {
  // console.log("Enter downloadWallet for :", id);
  // console.log(`${backendUrl}/api/wallets/${id}/download/`);
  // console.log(`Token ${userToken}`);
  
  // Get the user auth token
  const authToken = await getAuthToken();
  if (!authToken) throw new Error("No auth token found");

  try {
    const response = await axios.post(
      `${backendUrl}/api/wallets/${id}/download/`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
          Accept: "*/*",
          "Accept-Encoding": "gzip, deflate, br",
          Connection: "keep-alive",
        },
      }
    );
    const result = await response.data;
    console.log("Task triggered in downloadWallet:", result);
    return result;
  } catch {
    return { message: "Database Error: Failed to download wallet." };
  }
}

export async function refreshWallet(id: string) {
  // console.log("Enter refreshWallet for :", id);
  // console.log(`${backendUrl}/api/wallets/${id}/refresh/`);
  // console.log(`Token ${userToken}`);

  // Get the user auth token
  const authToken = await getAuthToken();
  if (!authToken) throw new Error("No auth token found");

  try {
    const response = await axios.post(
      `${backendUrl}/api/wallets/${id}/refresh/`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
          Accept: "*/*",
          "Accept-Encoding": "gzip, deflate, br",
          Connection: "keep-alive",
        },
      }
    );
    const result = await response.data;
    console.log("Task triggered:", result);
    return result;
  } catch {
    return { message: "Database Error: Failed to refresh wallet." };
  }
}

export async function refreshFullWallet(id: string) {
  
  // Get the user auth token
  const authToken = await getAuthToken();
  if (!authToken) throw new Error("No auth token found");

  try {
    const response = await axios.post(
      `${backendUrl}/api/wallets/${id}/refresh-full/`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
          Accept: "*/*",
          "Accept-Encoding": "gzip, deflate, br",
          Connection: "keep-alive",
        },
      }
    );
    const result = await response.data;
    console.log("Task triggered:", result);
    return result;
  } catch {
    return { message: "Database Error: Failed to refresh full wallet." };
  }
}

export async function deleteWallet(id: string) {
  
  // Get the user auth token
  const authToken = await getAuthToken();
  if (!authToken) throw new Error("No auth token found");

  try {
    const response = await axios.delete(`${backendUrl}/api/wallets/${id}/`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch {
    return { message: "Database Error: Failed to delete wallet." };
  }
}

export async function setContractAsSuspicious(id: string) {
  
  // Get the user auth token
  const authToken = await getAuthToken();
  if (!authToken) throw new Error("No auth token found");

  try {
    const response = await axios.post(
      `${backendUrl}/api/contracts/${id}/suspicious/`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    return response.data;
  } catch {
    return { message: "Database Error: Failed to set contract as Suspicious." };
  }
}

export async function setContractAsStable(id: string) {

  // Get the user auth token
  const authToken = await getAuthToken();
  if (!authToken) throw new Error("No auth token found");

  try {
    const response = await axios.post(
      `${backendUrl}/api/contracts/${id}/stable/`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    return response.data;
  } catch {
    return { message: "Database Error: Failed to set contract as Stable." };
  }
}

export async function setContractAsStandard(id: string) {

  // Get the user auth token
  const authToken = await getAuthToken();
  if (!authToken) throw new Error("No auth token found");

  try {
    const response = await axios.post(
      `${backendUrl}/api/contracts/${id}/standard/`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    return response.data;
  } catch {
    return { message: "Database Error: Failed to set contract as Standard." };
  }
}
