"use client";

import { useEffect } from "react";

export function KeepAlive() {
  useEffect(() => {
    const ping = () => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/health`).catch(() => {});
    };

    ping();
    const interval = setInterval(ping, 14 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return null;
}