import React from "react";
import { useForm } from "react-hook-form";
import { AuthActions } from "@/app/(auth)/utils";
import { useRouter } from "next/navigation";
import { Box, Stack, TextField, FormControl, styled, FormLabel, Divider, Link, Button } from "@mui/material";
import { SubmitButton } from "../custom/submit-button";
import MuiCard from "@mui/material/Card";
import { FacebookIcon, GoogleIcon } from "../custom/login-icons";
import { Heading } from "../Heading";

type FormData = {
  email: string;
  username: string;
  password: string;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4000";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow: "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow: "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  width: "400px",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage: "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage: "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

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
    <SignInContainer direction="column" justifyContent="space-between">
      <Card variant="outlined">
        <Heading variant="h4">Sign up</Heading>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          // noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 2,
          }}
        >
          <FormControl>
            <FormLabel htmlFor="username">Full name</FormLabel>
            <TextField
              autoComplete="username"
              // name="username"
              required
              fullWidth
              id="username"
              placeholder="Pierrick Martino"
              error={errors.username ? true : false}
              helperText={errors.username?.message}
              variant="outlined"
              {...register("username", { required: "Username is required" })}
              color={errors.username ? "error" : "primary"}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              error={errors.email ? true : false}
              helperText={errors.email?.message}
              id="email"
              type="email"
              // name="email"
              placeholder="your@email.com"
              autoComplete="email"
              autoFocus
              required
              fullWidth
              variant="outlined"
              {...register("email", { required: "Email is required" })}
              color={errors.email ? "error" : "primary"}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <TextField
              // error={passwordError}
              // helperText={passwordErrorMessage}
              // name="password"
              placeholder="••••••"
              type="password"
              id="password"
              autoComplete="current-password"
              autoFocus
              required
              fullWidth
              variant="outlined"
              {...register("password", { required: "Password is required" })}
              // color={passwordError ? 'error' : 'primary'}
            />
          </FormControl>
          <SubmitButton text="Sign Up" loadingText="Loading" />
        </Box>
        <Divider>
          <Heading variant="body">or</Heading>
        </Divider>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Button fullWidth variant="outlined" onClick={() => alert("Sign up with Google")} startIcon={<GoogleIcon />}>
            Sign up with Google
          </Button>
          <Button fullWidth variant="outlined" onClick={() => alert("Sign up with Facebook")} startIcon={<FacebookIcon />}>
            Sign up with Facebook
          </Button>
          <Heading variant="body">
            Already have an account?{" "}
            <Link href="/signin" variant="body2" sx={{ alignSelf: "center" }}>
              Sign in
            </Link>
          </Heading>
        </Box>
      </Card>
    </SignInContainer>
  );
};

export default Register;
