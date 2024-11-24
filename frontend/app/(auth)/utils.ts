// src/app/auth/utils.ts
import wretch from "wretch";
import Cookies from "js-cookie";

// Base API setup for making HTTP requests
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4000";
const webUrl = process.env.NEXT_PUBLIC_WEB_URL || "http://127.0.0.1";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://backend:4000";
const api = wretch(apiUrl).accept("application/json");

/**
 * Stores a token in cookies.
 * @param {string} token - The token to be stored.
 * @param {"access" | "refresh"} type - The type of the token (access or refresh).
 */
const storeToken = (token: string, type: "access" | "refresh") => {
    Cookies.set(type + "Token", token);
  };
  
  /**
   * Retrieves a token from cookies.
   * @param {"access" | "refresh"} type - The type of the token to retrieve (access or refresh).
   * @returns {string | undefined} The token, if found.
   */
  const getToken = (type: string) => {
    return Cookies.get(type + "Token");
  };
  
  /**
   * Removes both access and refresh tokens from cookies.
   */
  const removeTokens = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
  };

  const register = (email: string, name: string, password: string) => {
    return api.post({ email, name, password }, "/api/auth/users/");
  };
  
  const login = (email: string, password: string) => {
    return api.post({ email, password }, "/api/auth/jwt/create");
  };
  
  const logout = () => {
    const refreshToken = getToken("refresh");
    return api.post({ refresh: refreshToken }, "/api/auth/logout/");
  };
  
  const handleJWTRefresh = () => {
    const refreshToken = getToken("refresh");
    return api.post({ refresh: refreshToken }, "/api/auth/jwt/refresh");
  };
  
  const resetPassword = (email: string) => {
    return api.post({ email }, "/api/auth/users/reset_password/");
  };
  
  const resetPasswordConfirm = (
    new_password: string,
    re_new_password: string,
    token: string,
    uid: string
  ) => {
    return api.post(
      { uid, token, new_password, re_new_password },
      "/api/auth/users/reset_password_confirm/"
    );
  };

  const createWallet = (address: string, name: string, description: string) => {
    const accessToken = getToken("access");
    return api.auth(`Bearer ${ accessToken }`).post({ address, name, description }, "/api/wallets/");
  };

  export const AuthActions = () => {
    return {
      login,
      resetPasswordConfirm,
      handleJWTRefresh,
      register,
      resetPassword,
      storeToken,
      getToken,
      logout,
      removeTokens,
      createWallet,
    };
  };