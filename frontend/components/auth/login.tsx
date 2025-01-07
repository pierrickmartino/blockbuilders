import React from "react";
import { useForm } from "react-hook-form";
import { AuthActions } from "@/app/(auth)/utils";
import { useRouter } from "next/navigation";
// import Link from "next/link";
import {
  Box,
  Button,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  FormLabel,
  Link,
  Stack,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import MuiCard from "@mui/material/Card";
import { SubmitButton } from "@/components/custom/submit-button";
import { FacebookIcon, GoogleIcon } from "../custom/login-icons";

type FormData = {
  email: string;
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
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
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
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

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

  const handleNavigateToResetPassword = () => {
    window.location.href = `${apiUrl}/api/auth/password/reset-password`;
  };

  return (
    <SignInContainer direction="column" justifyContent="space-between">
      {/* <Box component="form" onSubmit={handleSubmit(onSubmit)}> */}
      <Card variant="outlined">
        <Typography
          component="h2"
          variant="h4"
          // sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
        >
          Sign in
        </Typography>
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
          <SubmitButton text="Sign In" loadingText="Loading" />
          <Link
            component="button"
            type="button"
            onClick={() => handleNavigateToResetPassword()}
            // href={`${apiUrl}/api/auth/password/reset-password`}
            variant="body2"
            sx={{ alignSelf: "center" }}
          >
            Forgot your password?
          </Link>
        </Box>
        <Divider>or</Divider>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => alert("Sign in with Google")}
            startIcon={<GoogleIcon />}
          >
            Sign in with Google
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => alert("Sign in with Facebook")}
            startIcon={<FacebookIcon />}
          >
            Sign in with Facebook
          </Button>
          <Typography sx={{ textAlign: "center" }}>
            Don&apos;t have an account?{" "}
            <Link href="/signup" variant="body2" sx={{ alignSelf: "center" }}>
              Sign up
            </Link>
          </Typography>
        </Box>
      </Card>
      {/* <Box sx={{ mt: 2 }}>
            <Stack>
            Don&apos;t have an account?&nbsp;
            <Link href="/signup">Sign Up</Link> */}
      {/* <Link
            href={`${apiUrl}/api/auth/password/reset-password`}
            // className="text-sm text-blue-600 hover:underline"
          >
            Forgot password?
          </Link> */}
      {/* </Stack> */}

      {/* </Box> */}
    </SignInContainer>
    // </Box>
  );
};

export default Login;
