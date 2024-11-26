import React from "react";
import { useForm } from "react-hook-form";
import { AuthActions } from "@/app/(auth)/utils";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Box, Card, CardActions, CardContent, CardHeader, Stack, TextField, Typography } from "@mui/material";
import { SubmitButton } from "@/components/custom/submit-button";

type FormData = {
  email: string;
  password: string;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4000";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>();

  const router = useRouter();

  const { login, storeToken } = AuthActions();

  const onSubmit = (data: FormData) => {
    login(data.email, data.password)
      .json((json) => {
        storeToken(json.access, "access");
        storeToken(json.refresh, "refresh");
        router.push("/dashboard");
      })
      .catch((err) => {
        setError("root", { type: "manual", message: err.json.detail });
      });
  };

  return (
    <Box>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
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
                  id="email"
                  type="text"
                  placeholder="email"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
              <Box
              sx={{
                  color: "error.main",
                  fontSize: "0.75rem",
                  fontStyle: "italic",
              }}
              >
              {errors.email.message}
              </Box>
            )}
                
              </Stack>
              <Stack spacing={1}>
                <Typography variant="h6">Password</Typography>
                <TextField
                  id="password"
                  type="password"
                  placeholder="password"
                  {...register("password", { required: "Password is required" })}
                />
                {errors.password && (
              <Box
              sx={{
                  color: "error.main",
                  fontSize: "0.75rem",
                  fontStyle: "italic",
              }}
              >
              {errors.password.message}
              </Box>
            )}
              </Stack>
            </Stack>
          </CardContent>
          <CardActions sx={{ padding: "8px 30px 30px 30px" }}>
            <SubmitButton text="Sign In" loadingText="Loading" />
            {errors.root && (
            <Box sx={{
                color: "error.main",
                fontSize: "0.75rem",
                fontStyle: "italic",
            }}>{errors.root.message}</Box>
          )}
          </CardActions>
        </Card>
        <Box sx={{ mt: 2 }}>
            <Stack>
            Don&apos;t have an account?&nbsp;
            <Link href="/signup">Sign Up</Link>
            <Link
            href={`${apiUrl}/api/auth/password/reset-password`}
            // className="text-sm text-blue-600 hover:underline"
          >
            Forgot password?
          </Link>
            </Stack>
          
        </Box>
      </Box>
    </Box>
  );
  
};

export default Login;