// "use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleter, poster } from "./fetcher";

// const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4000";
const webUrl = process.env.NEXT_PUBLIC_WEB_URL || "http://127.0.0.1";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://backend:4000";

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

  // Log the data being sent
  // console.log("Data being sent:", { address, name, description });
  // console.log("Request URL:", `${apiUrl}/api/wallets/`);

  // Insert data into the database
  try {
    const response = await poster(`/api/wallets/`, {
      address, // Wallet address
      name, // Wallet name
      description, // Wallet description
    });

    // Only redirect if the API request was successful
    if (response.status === 201) {
      console.log("Wallet created successfully!");

      // Revalidate the cache for the wallets page and redirect the user.
      revalidatePath(`${webUrl}/dashboard`);
      redirect(`${webUrl}/dashboard`);
    }
  } catch (err) {
    // If a database error occurs, return a more specific error.
    return {
      message: "Database Error: Failed to Create Wallet.",
    };
  }

  // Revalidate the cache for the wallets page and redirect the user.
  revalidatePath(`${webUrl}/dashboard`);
  redirect(`${webUrl}/dashboard`);
}

export async function downloadWallet(id: string) {
  try {
    const response = await poster(`/api/wallets/${id}/download/`);
    const result = await response;
    console.log("Task triggered in downloadWallet:", result);
    return result;
  } catch {
    return { message: "Database Error: Failed to download wallet." };
  }
}

export async function downloadContractInfo(id: string) {
  try {
    console.log("Request for data download in downloadContractInfo:", id);
    const response = await poster(`/api/contracts/${id}/download/`);
    const result = await response;
    console.log("Task triggered in downloadContractInfo:", result);
    return result;
  } catch {
    return { message: "Database Error: Failed to download contract icon." };
  }
}

export async function refresh() {
  try {
    const response = await poster(`/api/wallets/refresh/`);
    const result = await response;
    console.log("Task triggered:", result);
    return result;
  } catch {
    return { message: "Database Error: Failed to refresh." };
  }
}

export async function refreshWallet(id: string) {
  try {
    const response = await poster(`/api/wallets/${id}/refresh/`);
    const result = await response;
    console.log("Task triggered:", result);
    return result;
  } catch {
    return { message: "Database Error: Failed to refresh wallet." };
  }
}

export async function refreshFullWallet(id: string) {
  try {
    const response = await poster(`/api/wallets/${id}/refresh-full/`);
    const result = await response;
    console.log("Task triggered:", result);
    return result;
  } catch {
    return { message: "Database Error: Failed to refresh full wallet." };
  }
}

export async function deleteWalletAction(id: string) {
  try {
    const response = await deleter(`/api/wallets/${id}/`);
    console.log("Task triggered:", response);
    return response;
  } catch {
    return { message: "Database Error: Failed to delete wallet." };
  }
}

export async function setContractAsSuspicious(id: string) {
  try {
    const response = await poster(`/api/contracts/${id}/suspicious/`);
    return response;
  } catch {
    return { message: "Database Error: Failed to set contract as Suspicious." };
  }
}

export async function setContractAsStable(id: string) {
  try {
    const response = await poster(`/api/contracts/${id}/stable/`);
    return response;
  } catch {
    return { message: "Database Error: Failed to set contract as Stable." };
  }
}

export async function setContractAsStandard(id: string) {
  try {
    const response = await poster(`/api/contracts/${id}/standard/`);
    return response;
  } catch {
    return { message: "Database Error: Failed to set contract as Standard." };
  }
}
