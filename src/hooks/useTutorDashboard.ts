import { useState, useEffect, useRef, useCallback } from "react";
import { tutorService, TutorStatsResponse } from "@/services/tutor.service";

type State =
  | { status: "loading" }
  | { status: "no_profile" }
  | { status: "error" }
  | { status: "ok"; data: TutorStatsResponse };

export function useTutorDashboard() {
  const [state, setState] = useState<State>({ status: "loading" });
  const mountedRef = useRef(false);

  const load = useCallback(async () => {
    if (mountedRef.current) {
      setState({ status: "loading" });
    }
    try {
      const data = await tutorService.getMyStats();
      setState({ status: "ok", data });
    } catch (err: unknown) {
      const httpStatus = (err as { response?: { status?: number } })?.response?.status;
      if (httpStatus === 404) {
        setState({ status: "no_profile" });
      } else {
        setState({ status: "error" });
      }
    } finally {
      mountedRef.current = true;
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { state, refresh: load };
}