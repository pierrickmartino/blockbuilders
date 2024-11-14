"use client";

import { registerUserAction } from "@/app/lib/auth-actions";
import { useActionState } from "react";
import {
  Box,
  Button,
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


// import {
//   CardTitle,
//   CardDescription,
//   CardHeader,
//   CardContent,
//   CardFooter,
//   Card,
// } from "@/components/ui/card";

// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";


const INITIAL_STATE = {
    data: null,
  };

export function SignupForm() {
    const [formState, formAction] = useActionState(registerUserAction, INITIAL_STATE);

  console.log("## will render on client ##");
  console.log(formState);
  console.log("###########################");

  return (
    <Box>
      <Box component="form" action={formAction}>
        <Card>
          <CardHeader
            title="Sign Up"
            subheader="Enter your details to create a new account"
          ></CardHeader>
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
          <CardActions>
            <Button type="submit">Sign Up</Button>
          </CardActions>
        </Card>
        <Box sx={{ mt: 2 }}>
          Have an account?
          <Link href="/signin">Sign In</Link>
        </Box>
      </Box>
    </Box>
  );
}
