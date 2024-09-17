"use client";

import { State } from "../../lib/actions";
import { Button, ButtonGroup, Grid, Stack, TextField } from "@mui/material";
import BaseCard from "@/app/dashboard/components/shared/BaseCard";

export default function Form() {
  const initialState: State = { message: null, errors: {} };
  //   const [state, formAction] = useActionState(createWallet, initialState);

  return (
    // <Grid container spacing={3}>
    //   <Grid item xs={12} lg={12}>
          <>
            <Stack spacing={3}>
              <TextField id="wallet-user" label="User" variant="outlined" />
              <TextField
                id="wallet-address"
                label="Address"
                variant="outlined"
              />
              <TextField id="wallet-name" label="Name" variant="outlined" />
              <TextField
                id="wallet-description"
                label="Description"
                variant="outlined"
              />
              
            </Stack>

            <br />
            <ButtonGroup variant="outlined" aria-label="outlined button group">
              <Button variant="outlined" color="success">Add</Button>
              <Button variant="outlined" color="primary">Save</Button>
              <Button variant="outlined" color="error">Delete</Button>
            </ButtonGroup>
          </>
    //   </Grid>
    // </Grid>
  );

  // <form action={formAction}>
  // <form>
  //   <div className="rounded-md bg-gray-50 p-4 md:p-6">
  //     {/* Wallet Address */}
  //     <div className="mb-4">
  //       <label htmlFor="address" className="mb-2 block text-sm font-medium">
  //         Choose an address
  //       </label>
  //       <div className="relative">
  //       <input
  //             id="address"
  //             name="address"
  //             type="text"
  //             placeholder="Enter the address"
  //             className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
  //           />
  //         {/* <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" /> */}
  //       </div>

  //     </div>

  {
    /* Wallet Amount */
  }
  {
    /* <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Choose an amount
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                placeholder="Enter USD amount"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="amount-error"
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>

          <div id="amount-error" aria-live="polite" aria-atomic="true">
            {state.errors?.amount &&
              state.errors.amount.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div> */
  }

  {
    /* Wallet Status */
  }
  {
    /* <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Set the Wallet status
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="pending"
                  name="status"
                  type="radio"
                  value="pending"
                  className="text-white-600 h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 focus:ring-2"
                />
                <label
                  htmlFor="pending"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  Pending <ClockIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="paid"
                  name="status"
                  type="radio"
                  value="paid"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="paid"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Paid <CheckIcon className="h-4 w-4" />
                </label>
              </div>
            </div>
          </div>
          <div id="status-error" aria-live="polite" aria-atomic="true">
            {state.errors?.status &&
              state.errors.status.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </fieldset> */
  }

  {
    /* <div aria-live="polite" aria-atomic="true">
          {state.message ? (
            <p className="mt-2 text-sm text-red-500">{state.message}</p>
          ) : null}
        </div> */
  }
  //       </div>
  //       <div className="mt-6 flex justify-end gap-4">
  //         <Link
  //           href="/dashboard/wallets"
  //           className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
  //         >
  //           Cancel
  //         </Link>
  //         <Button type="submit">Create Wallet</Button>
  //       </div>
  //     </form>
  //   );
}
