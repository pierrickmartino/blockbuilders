"use client";

import {
  Box,
  Divider,
  Stack,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { SaveButton } from "@/components/custom/save-button";
import { AuthActions } from "@/app/(auth)/utils";
import { Fragment } from "react";
import { Button } from "@/components/Button";
import { Heading } from "../Heading";

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
      <Box
        px={3}
        py={2}
        bgcolor="secondary.main"
        color="secondary.contrastText"
      >
        <Heading variant="subtitle2">Add wallet</Heading>
        <Heading variant="caption">
          Get started by filling in the information below to create your new
          wallet.
        </Heading>
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
                <Heading variant="subtitle2">Wallet address</Heading>
                <TextField
                  id="address"
                  type="text"
                  variant="outlined"
                  {...register("address", { required: "Address is required" })}
                />
                {errors.address && (
                  <Box
                    sx={{
                      color: "error.main",
                      fontSize: "0.75rem",
                      fontStyle: "italic",
                    }}
                  >
                    {errors.address.message}
                  </Box>
                )}
              </Stack>
              <Stack spacing={1}>
                <Heading variant="subtitle2">Wallet name</Heading>
                <TextField
                  id="name"
                  type="text"
                  variant="outlined"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                  <Box
                    sx={{
                      color: "error.main",
                      fontSize: "0.75rem",
                      fontStyle: "italic",
                    }}
                  >
                    {errors.name.message}
                  </Box>
                )}
              </Stack>
              <Stack spacing={1}>
                <Heading variant="subtitle2">Wallet description</Heading>
                <TextField
                  id="description"
                  type="text"
                  variant="outlined"
                  {...register("description")}
                />
                {errors.description && (
                  <Box
                    sx={{
                      color: "error.main",
                      fontSize: "0.75rem",
                      fontStyle: "italic",
                    }}
                  >
                    {errors.description.message}
                  </Box>
                )}
              </Stack>
            </Stack>
          </Box>
          <Stack>
            <Divider />
            <Box px={3} py={2}>
              <Stack direction="row" spacing={2} justifyContent={"flex-end"}>
                <Button variant="secondary">
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
