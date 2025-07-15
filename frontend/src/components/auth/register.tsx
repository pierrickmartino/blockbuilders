import React from "react";
import { useForm } from "react-hook-form";
import { AuthActions } from "@/app/(auth)/utils";
import { useRouter } from "next/navigation";
import { Input } from "../Input";

type FormData = {
  email: string;
  username: string;
  password: string;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4000";

const Logo = (props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => (
  <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M10.9999 2.04938L11 5.07088C7.6077 5.55612 5 8.47352 5 12C5 15.866 8.13401 19 12 19C13.5723 19 15.0236 18.4816 16.1922 17.6064L18.3289 19.7428C16.605 21.1536 14.4014 22 12 22C6.47715 22 2 17.5228 2 12C2 6.81468 5.94662 2.55115 10.9999 2.04938ZM21.9506 13.0001C21.7509 15.0111 20.9555 16.8468 19.7433 18.3283L17.6064 16.1922C18.2926 15.2759 18.7595 14.1859 18.9291 13L21.9506 13.0001ZM13.0011 2.04948C17.725 2.51902 21.4815 6.27589 21.9506 10.9999L18.9291 10.9998C18.4905 7.93452 16.0661 5.50992 13.001 5.07103L13.0011 2.04948Z" />
  </svg>
);

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
    <>
      <div className="flex min-h-screen flex-1 flex-col justify-center px-4 py-10 lg:px-6">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex items-center space-x-2.5">
            <Logo className="remixicon size-7 text-gray-900 dark:text-gray-50" aria-hidden={true} />
            <p className="font-medium text-gray-900 dark:text-gray-50">BlockBuilders</p>
          </div>
          <h3 className="mt-6 text-lg font-semibold text-gray-900 dark:text-gray-50">Create a new account</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
            Already have an account?{" "}
            <a href="/signin" className="font-medium text-blue-500 hover:text-blue-600 dark:text-blue-500 hover:dark:text-blue-600">
              Sign in
            </a>
          </p>
          <form onSubmit={handleSubmit(onSubmit)} method="post" className="mt-6 space-y-4">
            <div>
              <label htmlFor="username" className="text-sm font-medium text-gray-900 dark:text-gray-50">
                Full name
              </label>
              <Input
                type="text"
                id="username"
                autoComplete="username"
                placeholder="Full name"
                className="mt-2"
                {...register("username", { required: "Username is required" })}
              />
            </div>
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
              Create account
            </button>
            <p className="text-center text-xs text-gray-500 dark:text-gray-500">
              By signing in, you agree to our{" "}
              <a href="#" className="capitalize text-blue-500 hover:text-blue-600 dark:text-blue-500 hover:dark:text-blue-600">
                Terms of use
              </a>{" "}
              and{" "}
              <a href="#" className="capitalize text-blue-500 hover:text-blue-600 dark:text-blue-500 hover:dark:text-blue-600">
                Privacy policy
              </a>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
