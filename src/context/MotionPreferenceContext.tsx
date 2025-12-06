"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type MotionPreference = "system" | "motion" | "reduce";

type MotionPreferenceContextValue = {
  preference: MotionPreference;
  shouldReduceMotion: boolean;
  isOverrideActive: boolean;
  setPreference: (preference: MotionPreference) => void;
};

const STORAGE_KEY = "motionPreference";
const MEDIA_QUERY = "(prefers-reduced-motion: reduce)";

const MotionPreferenceContext = createContext<MotionPreferenceContextValue | null>(null);

export function MotionPreferenceProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<MotionPreference>("system");
  const [systemPrefersReduce, setSystemPrefersReduce] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY) as MotionPreference | null;
    if (stored === "system" || stored === "motion" || stored === "reduce") {
      setPreferenceState(stored);
    }

    const media = window.matchMedia(MEDIA_QUERY);
    const updateSystemPreference = () => {
      setSystemPrefersReduce(media.matches);
    };

    updateSystemPreference();
    media.addEventListener("change", updateSystemPreference);

    return () => media.removeEventListener("change", updateSystemPreference);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const dataValue =
      preference === "system"
        ? systemPrefersReduce
          ? "reduce"
          : "motion"
        : preference === "reduce"
          ? "reduce"
          : "motion";

    document.documentElement.dataset.motionPreference = dataValue;
  }, [preference, systemPrefersReduce]);

  const setPreference = (next: MotionPreference) => {
    setPreferenceState(next);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // ignore storage failures
      }
    }
  };

  const shouldReduceMotion = useMemo(() => {
    if (preference === "motion") {
      return false;
    }
    if (preference === "reduce") {
      return true;
    }
    return systemPrefersReduce;
  }, [preference, systemPrefersReduce]);

  const value = useMemo<MotionPreferenceContextValue>(() => ({
    preference,
    shouldReduceMotion,
    isOverrideActive: preference !== "system",
    setPreference,
  }), [preference, shouldReduceMotion]);

  return (
    <MotionPreferenceContext.Provider value={value}>
      {children}
    </MotionPreferenceContext.Provider>
  );
}

export function useMotionPreference() {
  const context = useContext(MotionPreferenceContext);
  if (!context) {
    throw new Error("useMotionPreference must be used within a MotionPreferenceProvider");
  }
  return context;
}

export function useReducedMotion(): boolean {
  return useMotionPreference().shouldReduceMotion;
}
