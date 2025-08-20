// services/authService.ts
import axios from "~/services/axiosConfig"; // ensures interceptors are applied
// alternatively: import axios from "axios" if axiosConfig sets defaults globally

export interface AuthLoginResponse {
  status: boolean;
  message: string;
  user?: any;
  token?: string;
}

export const authService = {
  login: async (
    email: string,
    password: string
  ): Promise<AuthLoginResponse> => {
    try {
      const response = await axios.post<AuthLoginResponse>("/login", {
        email,
        password,
      });

      if (!response.data.status || !response.data.token) {
        throw new Error(response.data.message || "Login failed");
      }

      return response.data;
    } catch (error: any) {
      // Prefer server message if available
      const serverMessage =
        error?.response?.data?.message ?? error?.response?.data ?? undefined;
      const message = serverMessage || error.message || "Login failed";
      console.error("authService.login error:", error);
      throw new Error(
        typeof message === "string" ? message : JSON.stringify(message)
      );
    }
  },

  logout: async (
    token: string | null
  ): Promise<{ status: boolean; message?: string }> => {
    try {
      // server logout expects Authorization header — axios interceptor handles it
      const response = await axios.post("/logout", {});
      if (!response.data.status) {
        throw new Error(response.data.message || "Logout failed");
      }
      return response.data;
    } catch (error: any) {
      console.error("authService.logout error:", error);
      const msg =
        error?.response?.data?.message || error?.message || "Logout failed";
      throw new Error(msg);
    }
  },
};
