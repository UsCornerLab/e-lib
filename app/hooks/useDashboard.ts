// app/hooks/useDashboard.ts
import { useEffect, useState } from "react";
import { dashboardService } from "~/services/dashboardService";

export function useDashboard() {
  const [stats, setStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dashboardService
      .getStats()
      .then((data) => {
        setStats(data);
      })
      .catch((err) => {
        setError("Failed to load stats");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading, error };
}
