"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4000";
const webUrl = process.env.NEXT_PUBLIC_WEB_URL || "http://127.0.0.1";

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
  console.log("Data being sent:", { address, name, description });
  console.log("Request URL:", `${apiUrl}/api/wallets/`);

  // Insert data into the database
  try {
    const response = await axios.post(
      `${apiUrl}/api/wallets/`,
      {
        address, // Wallet address
        name, // Wallet name
        description, // Wallet description
      },
      {
        headers: {
          Authorization: "Token c40feb748f0e17b3d7472ed387a566e9d632d4c8",
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
  } catch (error: any) {
    // Log the error for debugging
    console.error(
      "Error creating wallet:",
      error.response ? error.response.data : error.message
    );
    // If a database error occurs, return a more specific error.
    return {
      message: "Database Error: Failed to Create Wallet.",
    };
  }

  // Revalidate the cache for the wallets page and redirect the user.
  revalidatePath(`${webUrl}/dashboard/wallets`);
  redirect(`${webUrl}/dashboard/wallets`);
}

// export async function updateWallet(
//   id: string,
//   prevState: State,
//   formData: FormData,
// ) {
//   const validatedFields = UpdateWallet.safeParse({
//     customerId: formData.get('customerId'),
//     amount: formData.get('amount'),
//     status: formData.get('status'),
//   });

//   if (!validatedFields.success) {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//       message: 'Missing Fields. Failed to Update Invoice.',
//     };
//   }

//   const { customerId, amount, status } = validatedFields.data;
//   const amountInCents = amount * 100;

//   try {
//     await sql`
//       UPDATE invoices
//       SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
//       WHERE id = ${id}
//     `;
//   } catch (error) {
//     return { message: 'Database Error: Failed to Update Invoice.' };
//   }

//   revalidatePath('/dashboard/invoices');
//   redirect('/dashboard/invoices');
// }

// export async function deleteWallet(id: string) {
//   // throw new Error('Failed to Delete Invoice');

//   try {
//     await sql`DELETE FROM invoices WHERE id = ${id}`;
//     revalidatePath('/dashboard/invoices');
//     return { message: 'Deleted Invoice' };
//   } catch (error) {
//     return { message: 'Database Error: Failed to Delete Invoice.' };
//   }
// }

// export async function authenticate(
//   prevState: string | undefined,
//   formData: FormData,
// ) {
//   try {
//     await signIn('credentials', formData);
//   } catch (error) {
//     if (error instanceof AuthError) {
//       switch (error.type) {
//         case 'CredentialsSignin':
//           return 'Invalid credentials.';
//         default:
//           return 'Something went wrong.';
//       }
//     }
//     throw error;
//   }
// }
