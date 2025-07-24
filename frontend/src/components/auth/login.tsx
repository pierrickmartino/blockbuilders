import React from "react";
import { useForm } from "react-hook-form";
import { AuthActions } from "@/app/(auth)/utils";
import { useRouter } from "next/navigation";
import { Divider } from "../Divider";
import { Input } from "../Input";

type FormData = {
  email: string;
  password: string;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4000";

const GoogleIcon = (props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => (
  <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M3.06364 7.50914C4.70909 4.24092 8.09084 2 12 2C14.6954 2 16.959 2.99095 18.6909 4.60455L15.8227 7.47274C14.7864 6.48185 13.4681 5.97727 12 5.97727C9.39542 5.97727 7.19084 7.73637 6.40455 10.1C6.2045 10.7 6.09086 11.3409 6.09086 12C6.09086 12.6591 6.2045 13.3 6.40455 13.9C7.19084 16.2636 9.39542 18.0227 12 18.0227C13.3454 18.0227 14.4909 17.6682 15.3864 17.0682C16.4454 16.3591 17.15 15.3 17.3818 14.05H12V10.1818H21.4181C21.5364 10.8363 21.6 11.5182 21.6 12.2273C21.6 15.2727 20.5091 17.8363 18.6181 19.5773C16.9636 21.1046 14.7 22 12 22C8.09084 22 4.70909 19.7591 3.06364 16.4909C2.38638 15.1409 2 13.6136 2 12C2 10.3864 2.38638 8.85911 3.06364 7.50914Z" />
  </svg>
);

const GitHubIcon = (props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => (
  <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M12.001 2C6.47598 2 2.00098 6.475 2.00098 12C2.00098 16.425 4.86348 20.1625 8.83848 21.4875C9.33848 21.575 9.52598 21.275 9.52598 21.0125C9.52598 20.775 9.51348 19.9875 9.51348 19.15C7.00098 19.6125 6.35098 18.5375 6.15098 17.975C6.03848 17.6875 5.55098 16.8 5.12598 16.5625C4.77598 16.375 4.27598 15.9125 5.11348 15.9C5.90098 15.8875 6.46348 16.625 6.65098 16.925C7.55098 18.4375 8.98848 18.0125 9.56348 17.75C9.65098 17.1 9.91348 16.6625 10.201 16.4125C7.97598 16.1625 5.65098 15.3 5.65098 11.475C5.65098 10.3875 6.03848 9.4875 6.67598 8.7875C6.57598 8.5375 6.22598 7.5125 6.77598 6.1375C6.77598 6.1375 7.61348 5.875 9.52598 7.1625C10.326 6.9375 11.176 6.825 12.026 6.825C12.876 6.825 13.726 6.9375 14.526 7.1625C16.4385 5.8625 17.276 6.1375 17.276 6.1375C17.826 7.5125 17.476 8.5375 17.376 8.7875C18.0135 9.4875 18.401 10.375 18.401 11.475C18.401 15.3125 16.0635 16.1625 13.8385 16.4125C14.201 16.725 14.5135 17.325 14.5135 18.2625C14.5135 19.6 14.501 20.675 14.501 21.0125C14.501 21.275 14.6885 21.5875 15.1885 21.4875C19.259 20.1133 21.9999 16.2963 22.001 12C22.001 6.475 17.526 2 12.001 2Z" />
  </svg>
);

const Logo = (props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => (
  <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M10.9999 2.04938L11 5.07088C7.6077 5.55612 5 8.47352 5 12C5 15.866 8.13401 19 12 19C13.5723 19 15.0236 18.4816 16.1922 17.6064L18.3289 19.7428C16.605 21.1536 14.4014 22 12 22C6.47715 22 2 17.5228 2 12C2 6.81468 5.94662 2.55115 10.9999 2.04938ZM21.9506 13.0001C21.7509 15.0111 20.9555 16.8468 19.7433 18.3283L17.6064 16.1922C18.2926 15.2759 18.7595 14.1859 18.9291 13L21.9506 13.0001ZM13.0011 2.04948C17.725 2.51902 21.4815 6.27589 21.9506 10.9999L18.9291 10.9998C18.4905 7.93452 16.0661 5.50992 13.001 5.07103L13.0011 2.04948Z" />
  </svg>
);

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
        storeToken(json.access_token, "access");
        storeToken(json.refresh, "refresh");
        router.push("/overview");
      })
      .catch((err) => {
        setError("root", { type: "manual", message: err.json.detail });
      });
  };

  const handleNavigateToResetPassword = () => {
    window.location.href = `${apiUrl}/api/auth/password/reset-password`;
  };

  return (
    <>
      <div className="flex min-h-screen flex-1 flex-col justify-center px-4 py-10 lg:px-6">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex items-center space-x-2.5">
            <Logo className="remixicon size-7 text-gray-900 dark:text-gray-50" aria-hidden={true} />
            <p className="font-medium text-gray-900 dark:text-gray-50">BlockBuilders</p>
          </div>
          <h3 className="mt-6 text-lg font-semibold text-gray-900 dark:text-gray-50">Sign in to your account</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="font-medium text-blue-500 hover:text-blue-600 dark:text-blue-500 hover:dark:text-blue-600">
              Sign up
            </a>
          </p>
          <div className="mt-8 sm:flex sm:items-center sm:space-x-2">
            <a
              onClick={() => alert("Sign in with Github")}
              className="relative justify-center whitespace-nowrap rounded-md border px-3 py-2 text-center text-sm font-medium shadow-sm transition-all duration-100 ease-in-out disabled:pointer-events-none disabled:shadow-none outline-offset-2 outline-0 focus-visible:outline-2 outline-blue-500 dark:outline-blue-500 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-gray-50 bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900/60 disabled:text-gray-400 disabled:dark:text-gray-600 w-full inline-flex items-center gap-2"
            >
              <GitHubIcon className="size-5" aria-hidden={true} />
              <span>Login with GitHub</span>
            </a>
            <a
              onClick={() => alert("Sign in with Google")}
              className="relative justify-center whitespace-nowrap rounded-md border px-3 py-2 text-center text-sm font-medium shadow-sm transition-all duration-100 ease-in-out disabled:pointer-events-none disabled:shadow-none outline-offset-2 outline-0 focus-visible:outline-2 outline-blue-500 dark:outline-blue-500 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-gray-50 bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900/60 disabled:text-gray-400 disabled:dark:text-gray-600 mt-2 w-full sm:mt-0 inline-flex items-center gap-2"
            >
              <GoogleIcon className="size-4" aria-hidden={true} />
              <span>Login with Google</span>
            </a>
          </div>
          <Divider>or</Divider>
          <form onSubmit={handleSubmit(onSubmit)} method="post" className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="text-sm font-medium text-gray-900 dark:text-gray-50">
                Email
              </label>
              <Input
                type="email"
                id="email"
                {...register("email", { required: "Email is required" })}
                autoComplete="email"
                placeholder="john@company.com"
                className="mt-2"
              />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-medium text-gray-900 dark:text-gray-50">
                Password
              </label>
              <Input
                type="password"
                id="password"
                {...register("password", { required: "Password is required" })}
                autoComplete="password"
                placeholder="Password"
                className="mt-2"
              />
            </div>
            <button
              type="submit"
              className="relative inline-flex items-center justify-center whitespace-nowrap rounded-md border px-3 py-2 text-center text-sm font-medium shadow-sm transition-all duration-100 ease-in-out disabled:pointer-events-none disabled:shadow-none outline-offset-2 outline-0 focus-visible:outline-2 outline-blue-500 dark:outline-blue-500 border-transparent text-white dark:text-white bg-blue-500 dark:bg-blue-500 hover:bg-blue-600 dark:hover:bg-blue-600 disabled:bg-blue-300 disabled:text-white disabled:dark:bg-blue-800 disabled:dark:text-blue-400 mt-4 w-full"
            >
              Sign in
            </button>
          </form>
          <p className="mt-6 text-sm text-gray-500 dark:text-gray-500">
            Forgot your password?{" "}
            <a
              onClick={handleNavigateToResetPassword}
              className="font-medium text-blue-500 hover:text-blue-600 dark:text-blue-500 hover:dark:text-blue-600"
            >
              Reset password
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
