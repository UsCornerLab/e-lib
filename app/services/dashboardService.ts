// services/dashboardService.ts
import axios from "~/services/axiosConfig";

export interface DashboardStatsPayload {
  total_books: number;
  total_users: number;
  total_news: number;
  total_categories: number;
  deactivated_books: number;
  deactivated_users: number;
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStatsPayload> => {
    try {
      const res = await axios.get<{
        status: boolean;
        data?: DashboardStatsPayload;
        message?: string;
      }>("/dashboard/stats");
      if (!res.data?.status) {
        throw new Error(res.data?.message || "Failed to fetch dashboard stats");
      }
      if (!res.data.data) {
        throw new Error("No stats returned from server");
      }
      return res.data.data;
    } catch (err: any) {
      console.error("dashboardService.getStats error:", err);
      throw new Error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load dashboard stats"
      );
    }
  },
};