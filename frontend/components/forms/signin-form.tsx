"use client";

import { loginUserAction } from "@/app/lib/auth-actions";
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
import { useActionState } from "react";
import { AuthErrors } from "../custom/auth-errors";
import { SubmitButton } from "../custom/submit-button";

const INITIAL_STATE = {
  zodErrors: null,
  authErrors: null,
  data: null,
  message: null,
};

export function SigninForm() {
  const [formState, formAction] = useActionState(
    loginUserAction,
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
            title="Sign In"
            subheader="Enter your details to sign in to your account"
            sx={{ paddingBottom: "0px" }}
          />
          <CardContent>
            <Stack spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h6">Email</Typography>
                <TextField
                  id="identifier"
                  name="identifier"
                  type="text"
                  placeholder="identifier"
                />
              </Stack>
              <Stack spacing={1}>
                <Typography variant="h6">Password</Typography>
                <TextField
                  id="password"
                  name="password"
                  type="password"
                  placeholder="password"
                />
              </Stack>
            </Stack>
          </CardContent>
          <CardActions sx={{ padding: "8px 30px 30px 30px" }}>
            <SubmitButton text="Sign In" loadingText="Loading" />
            <AuthErrors error={formState?.authErrors} />
          </CardActions>
        </Card>
        <Box sx={{ mt: 2 }}>
          Don&apos;t have an account?&nbsp;
          <Link href="/signup">Sign Up</Link>
        </Box>
      </Box>
    </Box>
  );
}
