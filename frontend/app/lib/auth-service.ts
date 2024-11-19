import axios from "axios";

interface RegisterUserProps {
  name: string;
  password: string;
  email: string;
}

interface LoginUserProps {
  email: string;
  password: string;
}

const webUrl = process.env.NEXT_PUBLIC_WEB_URL || "http://127.0.0.1";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://backend:4000";
const userToken = process.env.NEXT_PUBLIC_USER_TOKEN || "";

export async function registerUserService(userData: RegisterUserProps) {
  try {
    const response = await axios.post(
      `${backendUrl}/api/register/`,

      JSON.stringify({ ...userData }),
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          "Accept-Encoding": "gzip, deflate, br",
          Connection: "keep-alive",
        },
      }
    );

    return response;
  } catch (error) {
    console.error("Registration Service Error:", error);
  }
}

export async function loginUserService(userData: LoginUserProps) {
  try {
    // console.log("in loginUserService start");
    const response = await axios.post(
      `${backendUrl}/api/token/`,

      JSON.stringify({ ...userData }),
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          "Accept-Encoding": "gzip, deflate, br",
          Connection: "keep-alive",
        },
      }
    );

    // console.log("in loginUserService end", response);

    return response;
  } catch (error) {
    console.error("Login Service Error:", error);
  }
}
