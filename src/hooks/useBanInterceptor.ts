"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiClient } from "@/lib/axios";
import { AxiosError } from "axios";

export function useBanInterceptor() {
  const router = useRouter();

  useEffect(() => {
    const interceptor = apiClient.interceptors.response.use(
      (response) => response,
      (error: AxiosError<{ code?: string; message?: string }>) => {
        if (
          error.response?.status === 403 &&
          error.response.data?.code === "ACCOUNT_BANNED"
        ) {
          toast.error("Your account has been suspended.", {
            description: "You are being redirected.",
            duration: 4000,
          });
          router.push("/banned");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      apiClient.interceptors.response.eject(interceptor);
    };
  }, [router]);
}