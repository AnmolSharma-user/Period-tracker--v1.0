import { useState, useCallback } from "react";
import { useRouteLoaderData } from "@remix-run/react";
import type { LoaderData } from "~/root";

interface UseRecaptchaReturn {
  executeRecaptcha: () => Promise<string>;
  isLoading: boolean;
  error: string | null;
}

declare global {
  interface Window {
    ENV: {
      RECAPTCHA_SITE_KEY: string;
      SUPABASE_URL: string;
      SUPABASE_ANON_KEY: string;
    };
    recaptchaToken: string | null;
    onRecaptchaVerify: (token: string) => void;
    onRecaptchaExpired: () => void;
    onRecaptchaError: () => void;
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
      render: (container: string | HTMLElement, options: {
        sitekey: string;
        theme?: "light" | "dark";
        size?: "normal" | "compact";
        callback?: (token: string) => void;
        "expired-callback"?: () => void;
        "error-callback"?: () => void;
      }) => number;
      getResponse: (widgetId?: number) => string;
      reset: (widgetId?: number) => void;
    };
  }
}

export function useRecaptcha(): UseRecaptchaReturn {
  const data = useRouteLoaderData<LoaderData>("root");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeRecaptcha = useCallback(async () => {
    if (typeof window === "undefined") {
      throw new Error("reCAPTCHA can only be executed in the browser");
    }

    if (!window.grecaptcha) {
      throw new Error("reCAPTCHA has not been initialized");
    }

    try {
      setIsLoading(true);
      setError(null);

      // Wait for up to 5 seconds for the token
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds (100ms * 50)
      while (!window.recaptchaToken && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }

      if (!window.recaptchaToken) {
        throw new Error("Please complete the reCAPTCHA verification");
      }

      const token = window.recaptchaToken;
      window.recaptchaToken = null; // Clear the token after use
      return token;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to execute reCAPTCHA";
      console.error("reCAPTCHA execution error:", err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    executeRecaptcha,
    isLoading,
    error,
  };
}