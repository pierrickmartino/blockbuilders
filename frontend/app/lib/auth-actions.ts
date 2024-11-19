"use server";

import { z } from "zod";
import { loginUserService, registerUserService } from "./auth-service";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";


const config = {
  maxAge: 60 * 60 * 24 * 7, // 1 week
  path: "/",
  domain: process.env.HOST ?? "localhost",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};

const schemaRegister = z.object({
  name: z.string().min(3).max(20, {
    message: "Username must be between 3 and 20 characters",
  }),
  password: z.string().min(6).max(100, {
    message: "Password must be between 6 and 100 characters",
  }),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
});

export async function registerUserAction(prevState: any, formData: FormData) {
  // console.log("Hello From Register User Action");

  const validatedFields = schemaRegister.safeParse({
    name: formData.get("username"),
    password: formData.get("password"),
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      zodErrors: validatedFields.error.flatten().fieldErrors,
      authErrors: null,
      message: "Missing Fields. Failed to Register.",
    };
  }

  const responseData = await registerUserService(validatedFields.data);

  // console.log(responseData?.status);
  // console.log(responseData?.data);
  // console.log(responseData?.data.email);

  if (!responseData) {
    return {
      ...prevState,
      authErrors: null,
      zodErrors: null,
      message: "Ops! Something went wrong. Please try again.",
    };
  }

  if (responseData.status != 200) {
    return {
      ...prevState,
      authErrors: responseData.data.email,
      zodErrors: null,
      message: "Failed to Register.",
    };
  }

  // const cookieStore = await cookies();
  // cookieStore.set("jwt", responseData.jwt, config);

  redirect("/signin");
}

const schemaLogin = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z
    .string()
    .min(6, {
      message: "Password must have at least 6 or more characters",
    })
    .max(100, {
      message: "Password must be between 6 and 100 characters",
    }),
});

export async function loginUserAction(prevState: any, formData: FormData) {
  // console.log("Hello From Login User Action");

  const validatedFields = schemaLogin.safeParse({
    // name: formData.get("username"),
    password: formData.get("password"),
    email: formData.get("identifier"),
  });

  // console.log(validatedFields);

  if (!validatedFields.success) {
    return {
      ...prevState,
      zodErrors: validatedFields.error.flatten().fieldErrors,
      authErrors: null,
      message: "Missing Fields. Failed to Login.",
    };
  }

  const responseData = await loginUserService(validatedFields.data);

  // console.log("response");
  // console.log(responseData);
  // console.log(responseData?.data);
  // console.log(responseData?.data.access);
  // console.log(responseData?.data.refresh);

  if (!responseData) {
    return {
      ...prevState,
      authErrors: null,
      zodErrors: null,
      message: "Ops! Something went wrong. Please try again.",
    };
  }

  if (responseData.status != 200) {
    return {
      ...prevState,
      authErrors: responseData.data,
      zodErrors: null,
      message: "Failed to Login.",
    };
  }

  const cookieStore = await cookies();
  cookieStore.set("jwt_access", responseData.data.access, config);
  cookieStore.set("jwt_refresh", responseData.data.refresh, config);

  redirect("/dashboard");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.set("jwt_access", "", { ...config, maxAge: 0 });
  cookieStore.set("jwt_refresh", "", { ...config, maxAge: 0 });
  redirect("/");
}
