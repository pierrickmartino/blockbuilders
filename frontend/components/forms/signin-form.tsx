"use client";

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

export function SigninForm() {
  return (
    <Box>
      <Box component="form">
        <Card>
          <CardHeader
            title="Sign In"
            subheader="Enter your details to sign in to your account"
          ></CardHeader>
          <CardContent>
            <Stack spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h6">Email</Typography>
                <TextField
                  id="identifier"
                  name="identifier"
                  type="text"
                  placeholder="username or email"
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
          <CardActions>
            <Button>Sign In</Button>
          </CardActions>
        </Card>
        <Box sx={{ mt: 2 }}>
          Don&apos;t have an account?
          <Link href="/signup">Sign Up</Link>
        </Box>
      </Box>
    </Box>
  );
}
