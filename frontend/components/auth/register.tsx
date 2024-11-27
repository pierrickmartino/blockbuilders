import React from "react";
import { useForm } from "react-hook-form";
import { AuthActions } from "@/app/(auth)/utils";
import { useRouter } from "next/navigation";
import { Box, Card, CardActions, CardContent, CardHeader, Stack, TextField, Typography } from "@mui/material";
import { SubmitButton } from "../custom/submit-button";
import Link from "next/link";

type FormData = {
    email: string;
    username: string;
    password: string;
  };

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4000";

const Register = () => {
    const {
      register,
      handleSubmit,
      formState: { errors },
      setError,
    } = useForm<FormData>();
  
    const router = useRouter();
  
    const { register: registerUser } = AuthActions(); // Note: Renamed to avoid naming conflict with useForm's register
  
    const onSubmit = (data: FormData) => {
      registerUser(data.email, data.username, data.password)
        .json(() => {
          router.push("/signin");
        })
        .catch((err) => {
          setError("root", {
            type: "manual",
            message: err.json.detail,
          });
        });
    };
  
    return (
        <Box>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
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
                      type="text"
                      placeholder="username"
                      {...register("username")}
                    />
                    {errors.username && (
                    <Box
              sx={{
                  color: "error.main",
                  fontSize: "0.75rem",
                  fontStyle: "italic",
              }}
              >
              {errors.username.message}
            
              </Box>
              )}
                  </Stack>
                  <Stack spacing={1}>
                    <Typography variant="h6">Email</Typography>
                    <TextField
                      id="email"
                      type="email"
                      placeholder="name@example.com"
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
                <SubmitButton text="Sign Up" loadingText="Loading" />
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
              Have an account?&nbsp;
              <Link href="/signin">Sign In</Link>
            </Box>
          </Box>
        </Box>
      );
    
  };
  
  export default Register;