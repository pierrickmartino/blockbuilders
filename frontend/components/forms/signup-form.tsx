"use client";

import { registerUserAction } from "@/app/lib/auth-actions";
import { useActionState } from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { ZodErrors } from "../custom/zod-errors";
import { AuthErrors } from "../custom/auth-errors";
import { SubmitButton } from "../custom/submit-button";

const INITIAL_STATE = {
  data: null,
};

export function SignupForm() {
  const [formState, formAction] = useActionState(
    registerUserAction,
    INITIAL_STATE
  );

  // console.log("## will render on client ##");
  // console.log(formState);
  // console.log("###########################");

  return (
    <Box>
      <Box component="form" action={formAction}>
        <Card>
          <CardHeader
            title="Sign Up"
            subheader="Enter your details to create a new account"
            sx={{ paddingBottom: "0px" }}
          />
          <CardContent>
            <Stack spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h6">Username</Typography>
                <TextField
                  id="username"
                  name="username"
                  type="text"
                  placeholder="username"
                />
                <ZodErrors error={formState?.zodErrors?.username} />
              </Stack>
              <Stack spacing={1}>
                <Typography variant="h6">Email</Typography>
                <TextField
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                />
                <ZodErrors error={formState?.zodErrors?.email} />
              </Stack>

              <Stack spacing={1}>
                <Typography variant="h6">Password</Typography>
                <TextField
                  id="password"
                  name="password"
                  type="password"
                  placeholder="password"
                />
                <ZodErrors error={formState?.zodErrors?.password} />
              </Stack>
            </Stack>
          </CardContent>
          <CardActions sx={{ padding: "8px 30px 30px 30px" }}>
            <SubmitButton text="Sign Up" loadingText="Loading" />
            <AuthErrors error={formState?.authErrors} />
          </CardActions>
        </Card>
        <Box sx={{ mt: 2 }}>
          Have an account?&nbsp;
          <Link href="/signin">Sign In</Link>
        </Box>
      </Box>
    </Box>
  );
}
