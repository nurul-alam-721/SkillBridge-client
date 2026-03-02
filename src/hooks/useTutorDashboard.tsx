import { useState, useEffect, useCallback } from "react";
import { tutorService, TutorStatsResponse } from "@/services/tutor.service";

export function useTutorDashboard() {
  const [data, setData] = useState<TutorStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await tutorService.getMyStats();
      setData(res);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, refresh: load };
}