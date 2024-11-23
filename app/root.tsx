import { useEffect } from "react";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRevalidator,
} from "@remix-run/react";
import "./tailwind.css";
import { Toaster } from "~/components/ui/toaster";
import { getPublicConfig } from "~/lib/config";
import { supabase } from "~/lib/supabase";
import type { EnvVariables } from "~/lib/config";

export const meta: MetaFunction = () => {
  return [
    { title: "Period Tracker" },
    { name: "description", content: "Track your periods and symptoms" },
    { name: "viewport", content: "width=device-width,initial-scale=1" },
    { charSet: "utf-8" },
    { name: "theme-color", content: "#ffffff" },
    { name: "apple-mobile-web-app-capable", content: "yes" },
    { name: "apple-mobile-web-app-status-bar-style", content: "default" },
  ];
};

export interface LoaderData {
  config: {
    recaptcha: {
      siteKey: string;
    };
    supabase: {
      url: string;
      anonKey: string;
    };
    google: {
      clientId: string;
    };
    env: string;
  };
  session: {
    user: {
      id: string;
      email: string;
    } | null;
  } | null;
}

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const config = getPublicConfig();
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Error getting session:", error);
      return json<LoaderData>({ config, session: null });
    }

    // Transform session to match LoaderData type
    const transformedSession = session ? {
      user: {
        id: session.user.id,
        email: session.user.email || "",
      },
    } : null;

    return json<LoaderData>({ config, session: transformedSession });
  } catch (error) {
    console.error("Failed to load application configuration:", error);
    throw new Response("Server Configuration Error", {
      status: 500,
      statusText: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export default function App() {
  const { config, session } = useLoaderData<typeof loader>();
  const { revalidate } = useRevalidator();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        revalidate();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [revalidate]);

  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
        <script 
          src="https://www.google.com/recaptcha/api.js" 
          async 
          defer
        ></script>
        <script 
          src="https://accounts.google.com/gsi/client" 
          async 
          defer
        ></script>
      </head>
      <body className="min-h-full bg-background font-sans antialiased">
        <Outlet context={{ session }} />
        <Toaster />
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify({
              RECAPTCHA_SITE_KEY: config.recaptcha.siteKey,
              SUPABASE_URL: config.supabase.url,
              SUPABASE_ANON_KEY: config.supabase.anonKey,
              GOOGLE_CLIENT_ID: config.google.clientId,
            } as EnvVariables)}`,
          }}
        />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

declare global {
  interface Window {
    ENV: EnvVariables;
    google: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (response: any) => void }) => void;
          prompt: () => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "large" | "medium" | "small";
              type?: "standard" | "icon";
              shape?: "rectangular" | "pill" | "circle" | "square";
              width?: number;
              logo_alignment?: "left" | "center";
              text?: string;
              locale?: string;
            }
          ) => void;
        };
      };
    };
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