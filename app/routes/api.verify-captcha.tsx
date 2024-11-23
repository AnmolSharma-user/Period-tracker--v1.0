import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { getServerConfig } from "~/lib/config";

interface ReCaptchaResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  score?: number;
  action?: string;
  "error-codes"?: string[];
}

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "POST") {
    return json(
      { success: false, error: "Method not allowed" },
      { status: 405 }
    );
  }

  try {
    const formData = await request.formData();
    const token = formData.get("token");

    if (!token || typeof token !== "string") {
      return json(
        { success: false, error: "Missing reCAPTCHA token" },
        { status: 400 }
      );
    }

    const config = getServerConfig();

    const verifyUrl = "https://www.google.com/recaptcha/api/siteverify";
    const response = await fetch(verifyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: config.recaptcha.secretKey,
        response: token,
      }).toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("reCAPTCHA API error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      throw new Error(`reCAPTCHA API error: ${response.statusText}`);
    }

    const data: ReCaptchaResponse = await response.json();

    if (!data.success) {
      const errorCodes = data["error-codes"] || [];
      console.error("reCAPTCHA verification failed:", {
        errorCodes,
        token: token.substring(0, 10) + "...", // Log only the beginning of the token for debugging
      });
      return json(
        {
          success: false,
          error: "reCAPTCHA verification failed",
          details: errorCodes,
        },
        { status: 400 }
      );
    }

    // For v2 Checkbox, we don't need to check the score
    return json({
      success: true,
      timestamp: data.challenge_ts,
      hostname: data.hostname,
    });
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    return json(
      {
        success: false,
        error: "reCAPTCHA verification failed",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
};

// This route doesn't need a loader since it only handles POST requests
export const loader = () => {
  return json({ message: "Method not allowed" }, { status: 405 });
};