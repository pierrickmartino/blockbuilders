"use client";

import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { SaveButton } from "@/components/custom/save-button";
import { AuthActions } from "@/app/(auth)/utils";
import { Fragment } from "react";

type FormData = {
  address: string;
  name: string;
  description: string;
};

const CreateWalletForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>();

  const router = useRouter();

  const { createWallet } = AuthActions();

  const onSubmit = (data: FormData) => {
    createWallet(data.address, data.name, data.description)
      .json((json) => {
        router.push("/dashboard");
      })
      .catch((err) => {
        setError("root", { type: "manual", message: err.json.detail });
      });
  };

  return (
    <Fragment>
      <Box px={3} py={2} bgcolor="primary.main" color="white">
        <Typography variant="h5">Add wallet</Typography>
        <Typography variant="subtitle1">
          Get started by filling in the information below to create your new wallet.
        </Typography>
      </Box>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ height: "auto" }}
      >
        <Stack direction="column" justifyContent={"space-between"}>
          <Box px={3} py={3}>
            <Stack spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h6">Wallet address</Typography>
                <TextField
                  id="address"
                  type="text"
                  variant="outlined"
                  {...register("address", { required: "Address is required" })}
                />
              </Stack>
              <Stack spacing={1}>
                <Typography variant="h6">Wallet name</Typography>
                <TextField
                  id="name"
                  type="text"
                  variant="outlined"
                  {...register("name", { required: "Name is required" })}
                />
              </Stack>
              <Stack spacing={1}>
                <Typography variant="h6">Wallet description</Typography>
                <TextField
                  id="description"
                  type="text"
                  variant="outlined"
                  {...register("description", {
                    required: "Description is required",
                  })}
                />
              </Stack>
            </Stack>
          </Box>
          <Stack>
            <Divider />
            <Box px={3} py={2}>
              <Stack direction="row" spacing={2} justifyContent={"flex-end"}>
                <Button size="small" variant="outlined" color="primary">
                  Cancel
                </Button>
                <SaveButton text="Save" loadingText="Loading" />
              </Stack>
            </Box>
          </Stack>
        </Stack>
      </Box>
    </Fragment>
  );
};
export default CreateWalletForm;
