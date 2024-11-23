interface EnvVariables {
  RECAPTCHA_SITE_KEY: string;
  RECAPTCHA_SECRET_KEY: string;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  GOOGLE_CLIENT_ID: string;
  [key: string]: string;
}

interface Config {
  env: string;
  supabase: {
    url: string;
    anonKey: string;
  };
  recaptcha: {
    siteKey: string;
    secretKey: string;
  };
  google: {
    clientId: string;
  };
}

declare global {
  interface Window {
    ENV: EnvVariables;
  }
}

// Get environment variables with proper type checking
function getEnvVar(key: keyof EnvVariables, defaultValue?: string): string {
  const value = typeof window !== "undefined" 
    ? window.ENV?.[key]
    : process.env[key];

  if (!value && defaultValue === undefined) {
    throw new Error(`Environment variable ${key} is not defined`);
  }

  return value || defaultValue || "";
}

// Get public configuration that's safe to expose to the client
export function getPublicConfig(): Config {
  return {
    env: getEnvVar("NODE_ENV", "development"),
    supabase: {
      url: "https://gdslhzsvkbwjcbtbjhas.supabase.co",
      anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdkc2xoenN2a2J3amNidGJqaGFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIzNTA2MzgsImV4cCI6MjA0NzkyNjYzOH0.j-j6HAyoMq2Js268wt7Zf1z2ZwkghBKJsYJ5mT9bChk",
    },
    recaptcha: {
      siteKey: getEnvVar("RECAPTCHA_SITE_KEY", "6LcVHGApAAAAAJXM8qdvYqV9xmG9gWYgC7bTz0_K"),
      secretKey: getEnvVar("RECAPTCHA_SECRET_KEY", ""),
    },
    google: {
      clientId: getEnvVar("GOOGLE_CLIENT_ID", "974142084348-fkainokdi6470sc245g7uvfhamgs5n79.apps.googleusercontent.com"),
    },
  };
}

// Get server-side only configuration
export function getServerConfig(): Omit<Config, "env"> {
  return {
    supabase: {
      url: process.env.SUPABASE_URL || "https://gdslhzsvkbwjcbtbjhas.supabase.co",
      anonKey: process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdkc2xoenN2a2J3amNidGJqaGFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIzNTA2MzgsImV4cCI6MjA0NzkyNjYzOH0.j-j6HAyoMq2Js268wt7Zf1z2ZwkghBKJsYJ5mT9bChk",
    },
    recaptcha: {
      siteKey: process.env.RECAPTCHA_SITE_KEY || "6LcVHGApAAAAAJXM8qdvYqV9xmG9gWYgC7bTz0_K",
      secretKey: process.env.RECAPTCHA_SECRET_KEY || "",
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "974142084348-fkainokdi6470sc245g7uvfhamgs5n79.apps.googleusercontent.com",
    },
  };
}

// Validate environment variables at runtime
export function validateConfig() {
  const config = getPublicConfig();

  const requiredVars: [keyof EnvVariables, string][] = [
    ["SUPABASE_URL", config.supabase.url],
    ["SUPABASE_ANON_KEY", config.supabase.anonKey],
    ["RECAPTCHA_SITE_KEY", config.recaptcha.siteKey],
    ["RECAPTCHA_SECRET_KEY", config.recaptcha.secretKey],
    ["GOOGLE_CLIENT_ID", config.google.clientId],
  ];

  for (const [name, value] of requiredVars) {
    if (!value) {
      throw new Error(`Environment variable ${name} is not defined`);
    }
  }

  return config;
}

// Export types for use in other files
export type { Config, EnvVariables };