import { useState, useEffect, useCallback } from "react";
import { tutorService, TutorProfile } from "@/services/tutor.service";

export function useTutorProfile() {
  const [profile, setProfile] = useState<TutorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await tutorService.getMyProfile();
      setProfile(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { profile, loading, error, refresh: load, setProfile };
}