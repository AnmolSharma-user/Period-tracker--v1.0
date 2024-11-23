var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: !0 });
};

// app/entry.server.tsx
var entry_server_exports = {};
__export(entry_server_exports, {
  default: () => handleRequest
});
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { jsx } from "react/jsx-runtime";
var ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  return isbot(request.headers.get("user-agent") || "") ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = !1, { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = !0;
          let body = new PassThrough(), stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html"), resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          ), pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500, shellRendered && console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = !1, { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = !0;
          let body = new PassThrough(), stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html"), resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          ), pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500, shellRendered && console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}

// app/root.tsx
var root_exports = {};
__export(root_exports, {
  default: () => App,
  loader: () => loader,
  meta: () => meta
});
import { useEffect as useEffect2 } from "react";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRevalidator
} from "@remix-run/react";

// app/hooks/use-toast.ts
import * as React from "react";
var TOAST_LIMIT = 1, TOAST_REMOVE_DELAY = 1e6;
var count = 0;
function genId() {
  return count = (count + 1) % Number.MAX_SAFE_INTEGER, count.toString();
}
var toastTimeouts = /* @__PURE__ */ new Map(), addToRemoveQueue = (toastId) => {
  if (toastTimeouts.has(toastId))
    return;
  let timeout = setTimeout(() => {
    toastTimeouts.delete(toastId), dispatch({
      type: "REMOVE_TOAST",
      toastId
    });
  }, TOAST_REMOVE_DELAY);
  toastTimeouts.set(toastId, timeout);
}, reducer = (state, action2) => {
  switch (action2.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action2.toast, ...state.toasts].slice(0, TOAST_LIMIT)
      };
    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map(
          (t) => t.id === action2.toast.id ? { ...t, ...action2.toast } : t
        )
      };
    case "DISMISS_TOAST": {
      let { toastId } = action2;
      return toastId ? addToRemoveQueue(toastId) : state.toasts.forEach((toast2) => {
        addToRemoveQueue(toast2.id);
      }), {
        ...state,
        toasts: state.toasts.map(
          (t) => t.id === toastId || toastId === void 0 ? {
            ...t,
            open: !1
          } : t
        )
      };
    }
    case "REMOVE_TOAST":
      return action2.toastId === void 0 ? {
        ...state,
        toasts: []
      } : {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action2.toastId)
      };
  }
}, listeners = [], memoryState = { toasts: [] };
function dispatch(action2) {
  memoryState = reducer(memoryState, action2), listeners.forEach((listener) => {
    listener(memoryState);
  });
}
function toast({ ...props }) {
  let id = genId(), update = (props2) => dispatch({
    type: "UPDATE_TOAST",
    toast: { ...props2, id }
  }), dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });
  return dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: !0,
      onOpenChange: (open) => {
        open || dismiss();
      }
    }
  }), {
    id,
    dismiss,
    update
  };
}
function useToast() {
  let [state, setState] = React.useState(memoryState);
  return React.useEffect(() => (listeners.push(setState), () => {
    let index = listeners.indexOf(setState);
    index > -1 && listeners.splice(index, 1);
  }), [state]), {
    ...state,
    toast,
    dismiss: (toastId) => dispatch({ type: "DISMISS_TOAST", toastId })
  };
}

// app/components/ui/toast.tsx
import * as React2 from "react";
import { Cross2Icon } from "@radix-ui/react-icons";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva } from "class-variance-authority";

// app/lib/utils.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// app/components/ui/toast.tsx
import { jsx as jsx2 } from "react/jsx-runtime";
var ToastProvider = ToastPrimitives.Provider, ToastViewport = React2.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx2(
  ToastPrimitives.Viewport,
  {
    ref,
    className: cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    ),
    ...props
  }
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;
var toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive: "destructive group border-destructive bg-destructive text-destructive-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
), Toast = React2.forwardRef(({ className, variant, ...props }, ref) => /* @__PURE__ */ jsx2(
  ToastPrimitives.Root,
  {
    ref,
    className: cn(toastVariants({ variant }), className),
    ...props
  }
));
Toast.displayName = ToastPrimitives.Root.displayName;
var ToastAction = React2.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx2(
  ToastPrimitives.Action,
  {
    ref,
    className: cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    ),
    ...props
  }
));
ToastAction.displayName = ToastPrimitives.Action.displayName;
var ToastClose = React2.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx2(
  ToastPrimitives.Close,
  {
    ref,
    className: cn(
      "absolute right-1 top-1 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-1 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    ),
    "toast-close": "",
    ...props,
    children: /* @__PURE__ */ jsx2(Cross2Icon, { className: "h-4 w-4" })
  }
));
ToastClose.displayName = ToastPrimitives.Close.displayName;
var ToastTitle = React2.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx2(
  ToastPrimitives.Title,
  {
    ref,
    className: cn("text-sm font-semibold [&+div]:text-xs", className),
    ...props
  }
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;
var ToastDescription = React2.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx2(
  ToastPrimitives.Description,
  {
    ref,
    className: cn("text-sm opacity-90", className),
    ...props
  }
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

// app/components/ui/toaster.tsx
import { jsx as jsx3, jsxs } from "react/jsx-runtime";
function Toaster() {
  let { toasts } = useToast();
  return /* @__PURE__ */ jsxs(ToastProvider, { children: [
    toasts.map(function({ id, title, description, action: action2, ...props }) {
      return /* @__PURE__ */ jsxs(Toast, { ...props, children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-1", children: [
          title && /* @__PURE__ */ jsx3(ToastTitle, { children: title }),
          description && /* @__PURE__ */ jsx3(ToastDescription, { children: description })
        ] }),
        action2,
        /* @__PURE__ */ jsx3(ToastClose, {})
      ] }, id);
    }),
    /* @__PURE__ */ jsx3(ToastViewport, {})
  ] });
}

// app/lib/config.ts
function getEnvVar(key, defaultValue) {
  let value = typeof window < "u" ? window.ENV?.[key] : process.env[key];
  if (!value && defaultValue === void 0)
    throw new Error(`Environment variable ${key} is not defined`);
  return value || defaultValue || "";
}
function getPublicConfig() {
  return {
    env: getEnvVar("NODE_ENV", "development"),
    supabase: {
      url: "https://gdslhzsvkbwjcbtbjhas.supabase.co",
      anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdkc2xoenN2a2J3amNidGJqaGFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIzNTA2MzgsImV4cCI6MjA0NzkyNjYzOH0.j-j6HAyoMq2Js268wt7Zf1z2ZwkghBKJsYJ5mT9bChk"
    },
    recaptcha: {
      siteKey: getEnvVar("RECAPTCHA_SITE_KEY", "6LcVHGApAAAAAJXM8qdvYqV9xmG9gWYgC7bTz0_K"),
      secretKey: getEnvVar("RECAPTCHA_SECRET_KEY", "")
    },
    google: {
      clientId: getEnvVar("GOOGLE_CLIENT_ID", "974142084348-fkainokdi6470sc245g7uvfhamgs5n79.apps.googleusercontent.com")
    }
  };
}
function getServerConfig() {
  return {
    supabase: {
      url: process.env.SUPABASE_URL || "https://gdslhzsvkbwjcbtbjhas.supabase.co",
      anonKey: process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdkc2xoenN2a2J3amNidGJqaGFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIzNTA2MzgsImV4cCI6MjA0NzkyNjYzOH0.j-j6HAyoMq2Js268wt7Zf1z2ZwkghBKJsYJ5mT9bChk"
    },
    recaptcha: {
      siteKey: process.env.RECAPTCHA_SITE_KEY || "6LcVHGApAAAAAJXM8qdvYqV9xmG9gWYgC7bTz0_K",
      secretKey: process.env.RECAPTCHA_SECRET_KEY || ""
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "974142084348-fkainokdi6470sc245g7uvfhamgs5n79.apps.googleusercontent.com"
    }
  };
}

// app/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";
var config = getPublicConfig(), supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey,
  {
    auth: {
      autoRefreshToken: !0,
      persistSession: !0,
      detectSessionInUrl: !0,
      flowType: "pkce"
    },
    db: {
      schema: "public"
    },
    global: {
      headers: {
        "x-application-name": "period-tracker"
      }
    }
  }
);
function formatDateForSupabase(date) {
  return date.toISOString().split("T")[0];
}
function parseDateFromSupabase(dateString) {
  return new Date(dateString);
}

// app/root.tsx
import { jsx as jsx4, jsxs as jsxs2 } from "react/jsx-runtime";
var meta = () => [
  { title: "Period Tracker" },
  { name: "description", content: "Track your periods and symptoms" },
  { name: "viewport", content: "width=device-width,initial-scale=1" },
  { charSet: "utf-8" },
  { name: "theme-color", content: "#ffffff" },
  { name: "apple-mobile-web-app-capable", content: "yes" },
  { name: "apple-mobile-web-app-status-bar-style", content: "default" }
];
async function loader({ request }) {
  try {
    let config2 = getPublicConfig(), { data: { session }, error } = await supabase.auth.getSession();
    if (error)
      return console.error("Error getting session:", error), json({ config: config2, session: null });
    let transformedSession = session ? {
      user: {
        id: session.user.id,
        email: session.user.email || ""
      }
    } : null;
    return json({ config: config2, session: transformedSession });
  } catch (error) {
    throw console.error("Failed to load application configuration:", error), new Response("Server Configuration Error", {
      status: 500,
      statusText: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
function App() {
  let { config: config2, session } = useLoaderData(), { revalidate } = useRevalidator();
  return useEffect2(() => {
    let {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session2) => {
      (event === "SIGNED_IN" || event === "SIGNED_OUT") && revalidate();
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [revalidate]), /* @__PURE__ */ jsxs2("html", { lang: "en", className: "h-full", children: [
    /* @__PURE__ */ jsxs2("head", { children: [
      /* @__PURE__ */ jsx4(Meta, {}),
      /* @__PURE__ */ jsx4(Links, {}),
      /* @__PURE__ */ jsx4(
        "script",
        {
          src: "https://www.google.com/recaptcha/api.js",
          async: !0,
          defer: !0
        }
      ),
      /* @__PURE__ */ jsx4(
        "script",
        {
          src: "https://accounts.google.com/gsi/client",
          async: !0,
          defer: !0
        }
      )
    ] }),
    /* @__PURE__ */ jsxs2("body", { className: "min-h-full bg-background font-sans antialiased", children: [
      /* @__PURE__ */ jsx4(Outlet, { context: { session } }),
      /* @__PURE__ */ jsx4(Toaster, {}),
      /* @__PURE__ */ jsx4(ScrollRestoration, {}),
      /* @__PURE__ */ jsx4(
        "script",
        {
          dangerouslySetInnerHTML: {
            __html: `window.ENV = ${JSON.stringify({
              RECAPTCHA_SITE_KEY: config2.recaptcha.siteKey,
              SUPABASE_URL: config2.supabase.url,
              SUPABASE_ANON_KEY: config2.supabase.anonKey,
              GOOGLE_CLIENT_ID: config2.google.clientId
            })}`
          }
        }
      ),
      /* @__PURE__ */ jsx4(Scripts, {}),
      /* @__PURE__ */ jsx4(LiveReload, {})
    ] })
  ] });
}

// app/routes/api.verify-captcha.tsx
var api_verify_captcha_exports = {};
__export(api_verify_captcha_exports, {
  action: () => action,
  loader: () => loader2
});
import { json as json2 } from "@remix-run/node";
var action = async ({ request }) => {
  if (request.method !== "POST")
    return json2(
      { success: !1, error: "Method not allowed" },
      { status: 405 }
    );
  try {
    let token = (await request.formData()).get("token");
    if (!token || typeof token != "string")
      return json2(
        { success: !1, error: "Missing reCAPTCHA token" },
        { status: 400 }
      );
    let config2 = getServerConfig(), response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        secret: config2.recaptcha.secretKey,
        response: token
      }).toString()
    });
    if (!response.ok) {
      let errorText = await response.text();
      throw console.error("reCAPTCHA API error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      }), new Error(`reCAPTCHA API error: ${response.statusText}`);
    }
    let data = await response.json();
    if (!data.success) {
      let errorCodes = data["error-codes"] || [];
      return console.error("reCAPTCHA verification failed:", {
        errorCodes,
        token: token.substring(0, 10) + "..."
        // Log only the beginning of the token for debugging
      }), json2(
        {
          success: !1,
          error: "reCAPTCHA verification failed",
          details: errorCodes
        },
        { status: 400 }
      );
    }
    return json2({
      success: !0,
      timestamp: data.challenge_ts,
      hostname: data.hostname
    });
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    let errorMessage = error instanceof Error ? error.message : "Unknown error";
    return json2(
      {
        success: !1,
        error: "reCAPTCHA verification failed",
        details: errorMessage
      },
      { status: 500 }
    );
  }
}, loader2 = () => json2({ message: "Method not allowed" }, { status: 405 });

// app/routes/forgot-password.tsx
var forgot_password_exports = {};
__export(forgot_password_exports, {
  default: () => ForgotPasswordPage,
  loader: () => loader3
});
import { redirect } from "@remix-run/node";

// app/components/ui/card.tsx
import * as React3 from "react";
import { jsx as jsx5 } from "react/jsx-runtime";
var Card = React3.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx5(
  "div",
  {
    ref,
    className: cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className
    ),
    ...props
  }
));
Card.displayName = "Card";
var CardHeader = React3.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx5(
  "div",
  {
    ref,
    className: cn("flex flex-col space-y-1.5 p-6", className),
    ...props
  }
));
CardHeader.displayName = "CardHeader";
var CardTitle = React3.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx5(
  "h3",
  {
    ref,
    className: cn("font-semibold leading-none tracking-tight", className),
    ...props
  }
));
CardTitle.displayName = "CardTitle";
var CardDescription = React3.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx5(
  "p",
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
CardDescription.displayName = "CardDescription";
var CardContent = React3.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx5("div", { ref, className: cn("p-6 pt-0", className), ...props }));
CardContent.displayName = "CardContent";
var CardFooter = React3.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx5(
  "div",
  {
    ref,
    className: cn("flex items-center p-6 pt-0", className),
    ...props
  }
));
CardFooter.displayName = "CardFooter";

// app/components/auth/forgot-password.tsx
import { useState as useState2 } from "react";
import { useNavigate } from "@remix-run/react";

// app/components/ui/button.tsx
import * as React4 from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva as cva2 } from "class-variance-authority";
import { jsx as jsx6 } from "react/jsx-runtime";
var buttonVariants = cva2(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
), Button = React4.forwardRef(
  ({ className, variant, size, asChild = !1, ...props }, ref) => /* @__PURE__ */ jsx6(
    asChild ? Slot : "button",
    {
      className: cn(buttonVariants({ variant, size, className })),
      ref,
      ...props
    }
  )
);
Button.displayName = "Button";

// app/components/ui/input.tsx
import * as React5 from "react";
import { jsx as jsx7 } from "react/jsx-runtime";
var Input = React5.forwardRef(
  ({ className, type, ...props }, ref) => /* @__PURE__ */ jsx7(
    "input",
    {
      type,
      className: cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ref,
      ...props
    }
  )
);
Input.displayName = "Input";

// app/components/ui/label.tsx
import * as React6 from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva as cva3 } from "class-variance-authority";
import { jsx as jsx8 } from "react/jsx-runtime";
var labelVariants = cva3(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
), Label = React6.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx8(
  LabelPrimitive.Root,
  {
    ref,
    className: cn(labelVariants(), className),
    ...props
  }
));
Label.displayName = LabelPrimitive.Root.displayName;

// app/components/ui/alert.tsx
import * as React7 from "react";
import { cva as cva4 } from "class-variance-authority";
import { jsx as jsx9 } from "react/jsx-runtime";
var alertVariants = cva4(
  "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
), Alert = React7.forwardRef(({ className, variant, ...props }, ref) => /* @__PURE__ */ jsx9(
  "div",
  {
    ref,
    role: "alert",
    className: cn(alertVariants({ variant }), className),
    ...props
  }
));
Alert.displayName = "Alert";
var AlertTitle = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx9(
  "h5",
  {
    ref,
    className: cn("mb-1 font-medium leading-none tracking-tight", className),
    ...props
  }
));
AlertTitle.displayName = "AlertTitle";
var AlertDescription = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx9(
  "div",
  {
    ref,
    className: cn("text-sm [&_p]:leading-relaxed", className),
    ...props
  }
));
AlertDescription.displayName = "AlertDescription";

// app/components/auth/forgot-password.tsx
import { Loader2 } from "lucide-react";
import { jsx as jsx10, jsxs as jsxs3 } from "react/jsx-runtime";
function ForgotPassword() {
  let navigate = useNavigate(), { toast: toast2 } = useToast(), [email, setEmail] = useState2(""), [error, setError] = useState2(null), [loading, setLoading] = useState2(!1), [submitted, setSubmitted] = useState2(!1), handleSubmit = async (e) => {
    if (e.preventDefault(), !loading)
      try {
        setLoading(!0), setError(null);
        let { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`
        });
        if (resetError)
          throw resetError;
        setSubmitted(!0), toast2({
          title: "Reset link sent",
          description: "Please check your email for the password reset link."
        });
      } catch (err) {
        let message = err instanceof Error ? err.message : "Failed to send reset link";
        setError(message), toast2({
          variant: "destructive",
          title: "Error",
          description: message
        });
      } finally {
        setLoading(!1);
      }
  };
  return submitted ? /* @__PURE__ */ jsxs3("div", { className: "text-center space-y-4", children: [
    /* @__PURE__ */ jsx10("h2", { className: "text-2xl font-semibold tracking-tight", children: "Check your email" }),
    /* @__PURE__ */ jsxs3("p", { className: "text-muted-foreground", children: [
      "We've sent a password reset link to ",
      email
    ] }),
    /* @__PURE__ */ jsxs3("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx10(
        Button,
        {
          variant: "outline",
          className: "w-full",
          onClick: () => setSubmitted(!1),
          children: "Try another email"
        }
      ),
      /* @__PURE__ */ jsx10(
        Button,
        {
          variant: "outline",
          className: "w-full",
          onClick: () => navigate("/login"),
          children: "Back to login"
        }
      )
    ] })
  ] }) : /* @__PURE__ */ jsxs3("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
    /* @__PURE__ */ jsxs3("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx10(Label, { htmlFor: "email", children: "Email" }),
      /* @__PURE__ */ jsx10(
        Input,
        {
          id: "email",
          type: "email",
          placeholder: "Enter your email",
          value: email,
          onChange: (e) => setEmail(e.target.value),
          required: !0,
          disabled: loading,
          className: "bg-background"
        }
      ),
      /* @__PURE__ */ jsx10("p", { className: "text-sm text-muted-foreground", children: "Enter the email address you used to create your account and we'll send you a link to reset your password." })
    ] }),
    error && /* @__PURE__ */ jsx10(Alert, { variant: "destructive", children: /* @__PURE__ */ jsx10(AlertDescription, { children: error }) }),
    /* @__PURE__ */ jsxs3("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxs3(Button, { type: "submit", className: "w-full", disabled: loading, children: [
        loading && /* @__PURE__ */ jsx10(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
        "Send reset link"
      ] }),
      /* @__PURE__ */ jsx10(
        Button,
        {
          type: "button",
          variant: "outline",
          className: "w-full",
          onClick: () => navigate("/login"),
          disabled: loading,
          children: "Back to login"
        }
      )
    ] })
  ] });
}

// app/routes/forgot-password.tsx
import { jsx as jsx11, jsxs as jsxs4 } from "react/jsx-runtime";
async function loader3({ request }) {
  let { data: { session }, error } = await supabase.auth.getSession();
  if (error)
    return console.error("Error getting session:", error), null;
  if (session?.user) {
    let { data: preferences } = await supabase.from("user_preferences").select("*").eq("user_id", session.user.id).single();
    return preferences ? redirect("/dashboard") : redirect("/onboarding");
  }
  return null;
}
function ForgotPasswordPage() {
  return /* @__PURE__ */ jsx11("main", { className: "min-h-screen flex items-center justify-center p-4 bg-background", children: /* @__PURE__ */ jsxs4("div", { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxs4("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsx11("h1", { className: "text-4xl font-bold tracking-tight", children: "Reset Password" }),
      /* @__PURE__ */ jsx11("p", { className: "text-muted-foreground mt-2", children: "Enter your email to reset your password" })
    ] }),
    /* @__PURE__ */ jsxs4(Card, { children: [
      /* @__PURE__ */ jsxs4(CardHeader, { children: [
        /* @__PURE__ */ jsx11(CardTitle, { children: "Forgot Password" }),
        /* @__PURE__ */ jsx11(CardDescription, { children: "We'll send you a link to reset your password" })
      ] }),
      /* @__PURE__ */ jsx11(CardContent, { children: /* @__PURE__ */ jsx11(ForgotPassword, {}) })
    ] })
  ] }) });
}

// app/routes/onboarding.tsx
var onboarding_exports = {};
__export(onboarding_exports, {
  default: () => OnboardingPage,
  loader: () => loader4
});
import { redirect as redirect2 } from "@remix-run/node";
import { useLoaderData as useLoaderData2 } from "@remix-run/react";

// app/components/onboarding/onboarding-flow.tsx
import { useState as useState3 } from "react";
import { useNavigate as useNavigate2 } from "@remix-run/react";

// app/components/ui/switch.tsx
import * as React8 from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { jsx as jsx12 } from "react/jsx-runtime";
var Switch = React8.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx12(
  SwitchPrimitives.Root,
  {
    className: cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    ),
    ...props,
    ref,
    children: /* @__PURE__ */ jsx12(
      SwitchPrimitives.Thumb,
      {
        className: cn(
          "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
        )
      }
    )
  }
));
Switch.displayName = SwitchPrimitives.Root.displayName;

// app/components/ui/calendar.tsx
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { DayPicker } from "react-day-picker";
import { jsx as jsx13 } from "react/jsx-runtime";
function Calendar({
  className,
  classNames,
  showOutsideDays = !0,
  ...props
}) {
  return /* @__PURE__ */ jsx13(
    DayPicker,
    {
      showOutsideDays,
      className: cn("p-3", className),
      classNames: {
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range" ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md" : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "day-outside text-muted-foreground opacity-50  aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames
      },
      components: {
        IconLeft: ({ ...props2 }) => /* @__PURE__ */ jsx13(ChevronLeftIcon, { className: "h-4 w-4" }),
        IconRight: ({ ...props2 }) => /* @__PURE__ */ jsx13(ChevronRightIcon, { className: "h-4 w-4" })
      },
      ...props
    }
  );
}
Calendar.displayName = "Calendar";

// app/components/ui/progress.tsx
import * as React9 from "react";
import { jsx as jsx14 } from "react/jsx-runtime";
var Progress = React9.forwardRef(
  ({ className, value = 0, ...props }, ref) => {
    let percentage = Math.min(Math.max(value, 0), 100);
    return /* @__PURE__ */ jsx14(
      "div",
      {
        ref,
        role: "progressbar",
        "aria-valuemin": 0,
        "aria-valuemax": 100,
        "aria-valuenow": percentage,
        className: cn(
          "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
          className
        ),
        ...props,
        children: /* @__PURE__ */ jsx14(
          "div",
          {
            className: "h-full w-full flex-1 bg-primary transition-all duration-300 ease-in-out",
            style: { transform: `translateX(-${100 - percentage}%)` }
          }
        )
      }
    );
  }
);
Progress.displayName = "Progress";

// app/components/onboarding/onboarding-flow.tsx
import { Loader2 as Loader22 } from "lucide-react";
import { jsx as jsx15, jsxs as jsxs5 } from "react/jsx-runtime";
function OnboardingFlow({ userId }) {
  let navigate = useNavigate2(), { toast: toast2 } = useToast(), [step, setStep] = useState3(1), [loading, setLoading] = useState3(!1), [error, setError] = useState3(null), [lastPeriodDate, setLastPeriodDate] = useState3(/* @__PURE__ */ new Date()), [cycleLength, setCycleLength] = useState3("28"), [hasPeriodReminders, setHasPeriodReminders] = useState3(!0), [hasPillReminders, setHasPillReminders] = useState3(!1), handleNext = () => {
    if (step === 1 && !lastPeriodDate) {
      setError("Please select your last period date");
      return;
    }
    if (step === 2) {
      let length = parseInt(cycleLength);
      if (isNaN(length) || length < 21 || length > 35) {
        setError("Cycle length must be between 21 and 35 days");
        return;
      }
    }
    step < 3 && (setError(null), setStep(step + 1));
  }, handleBack = () => {
    setError(null), setStep(step - 1);
  }, handleComplete = async () => {
    if (!lastPeriodDate) {
      setError("Please select your last period date");
      return;
    }
    let length = parseInt(cycleLength);
    if (isNaN(length) || length < 21 || length > 35) {
      setError("Cycle length must be between 21 and 35 days");
      return;
    }
    try {
      setLoading(!0), setError(null);
      let preferences = {
        user_id: userId,
        cycle_length: length,
        last_period_date: lastPeriodDate.toISOString().split("T")[0],
        has_period_reminders: hasPeriodReminders,
        has_pill_reminders: hasPillReminders
      }, { error: preferencesError } = await supabase.from("user_preferences").insert(preferences);
      if (preferencesError)
        throw preferencesError;
      toast2({
        title: "Setup complete",
        description: "Your preferences have been saved successfully."
      }), navigate("/dashboard");
    } catch (err) {
      let message = err instanceof Error ? err.message : "Failed to save preferences";
      setError(message), toast2({
        variant: "destructive",
        title: "Error",
        description: message
      });
    } finally {
      setLoading(!1);
    }
  };
  return /* @__PURE__ */ jsx15("div", { className: "min-h-screen flex items-center justify-center p-4 bg-background", children: /* @__PURE__ */ jsxs5("div", { className: "w-full max-w-lg", children: [
    /* @__PURE__ */ jsxs5("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsx15("h1", { className: "text-4xl font-bold tracking-tight", children: "Welcome to Period Tracker" }),
      /* @__PURE__ */ jsx15("p", { className: "text-muted-foreground mt-2", children: "Let's get your account set up" })
    ] }),
    /* @__PURE__ */ jsx15(
      Progress,
      {
        value: step / 3 * 100,
        className: "mb-8"
      }
    ),
    /* @__PURE__ */ jsxs5(Card, { children: [
      /* @__PURE__ */ jsxs5(CardHeader, { children: [
        /* @__PURE__ */ jsxs5(CardTitle, { children: [
          step === 1 && "When was your last period?",
          step === 2 && "How long is your cycle?",
          step === 3 && "Set up reminders"
        ] }),
        /* @__PURE__ */ jsxs5(CardDescription, { children: [
          step === 1 && "This helps us predict your next period",
          step === 2 && "Most cycles are between 21 and 35 days",
          step === 3 && "Choose what you want to be reminded about"
        ] })
      ] }),
      /* @__PURE__ */ jsxs5(CardContent, { className: "space-y-6", children: [
        step === 1 && /* @__PURE__ */ jsx15(
          Calendar,
          {
            mode: "single",
            selected: lastPeriodDate,
            onSelect: setLastPeriodDate,
            disabled: (date) => date > /* @__PURE__ */ new Date(),
            className: "rounded-md border"
          }
        ),
        step === 2 && /* @__PURE__ */ jsxs5("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx15(Label, { htmlFor: "cycleLength", children: "Cycle Length (days)" }),
          /* @__PURE__ */ jsx15(
            Input,
            {
              id: "cycleLength",
              type: "number",
              min: 21,
              max: 35,
              value: cycleLength,
              onChange: (e) => setCycleLength(e.target.value),
              className: "w-32"
            }
          ),
          /* @__PURE__ */ jsx15("p", { className: "text-sm text-muted-foreground", children: "Most cycles are between 21 and 35 days" })
        ] }),
        step === 3 && /* @__PURE__ */ jsxs5("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs5("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs5("div", { className: "space-y-0.5", children: [
              /* @__PURE__ */ jsx15(Label, { children: "Period Reminders" }),
              /* @__PURE__ */ jsx15("p", { className: "text-sm text-muted-foreground", children: "Get notified about your upcoming periods" })
            ] }),
            /* @__PURE__ */ jsx15(
              Switch,
              {
                checked: hasPeriodReminders,
                onCheckedChange: setHasPeriodReminders
              }
            )
          ] }),
          /* @__PURE__ */ jsxs5("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs5("div", { className: "space-y-0.5", children: [
              /* @__PURE__ */ jsx15(Label, { children: "Pill Reminders" }),
              /* @__PURE__ */ jsx15("p", { className: "text-sm text-muted-foreground", children: "Get reminded to take your pills" })
            ] }),
            /* @__PURE__ */ jsx15(
              Switch,
              {
                checked: hasPillReminders,
                onCheckedChange: setHasPillReminders
              }
            )
          ] })
        ] }),
        error && /* @__PURE__ */ jsx15(Alert, { variant: "destructive", children: /* @__PURE__ */ jsx15(AlertDescription, { children: error }) }),
        /* @__PURE__ */ jsxs5("div", { className: "flex justify-between pt-4", children: [
          step > 1 ? /* @__PURE__ */ jsx15(
            Button,
            {
              variant: "outline",
              onClick: handleBack,
              disabled: loading,
              children: "Back"
            }
          ) : /* @__PURE__ */ jsx15("div", {}),
          step < 3 ? /* @__PURE__ */ jsx15(Button, { onClick: handleNext, disabled: loading, children: "Next" }) : /* @__PURE__ */ jsxs5(Button, { onClick: handleComplete, disabled: loading, children: [
            loading && /* @__PURE__ */ jsx15(Loader22, { className: "mr-2 h-4 w-4 animate-spin" }),
            "Complete Setup"
          ] })
        ] })
      ] })
    ] })
  ] }) });
}

// app/routes/onboarding.tsx
import { jsx as jsx16 } from "react/jsx-runtime";
async function loader4({ request }) {
  let { data: { session }, error } = await supabase.auth.getSession();
  if (error)
    return console.error("Error getting session:", error), redirect2("/login");
  if (!session?.user)
    return redirect2("/login");
  let { data: preferences } = await supabase.from("user_preferences").select("*").eq("user_id", session.user.id).single();
  return preferences ? redirect2("/dashboard") : { userId: session.user.id };
}
function OnboardingPage() {
  let { userId } = useLoaderData2();
  return /* @__PURE__ */ jsx16("main", { children: /* @__PURE__ */ jsx16(OnboardingFlow, { userId }) });
}

// app/routes/dashboard.tsx
var dashboard_exports = {};
__export(dashboard_exports, {
  default: () => DashboardPage,
  loader: () => loader5
});
import { redirect as redirect3 } from "@remix-run/node";
import { useLoaderData as useLoaderData3 } from "@remix-run/react";

// app/components/dashboard/period-tracker.tsx
import { useState as useState4, useEffect as useEffect3 } from "react";

// app/components/ui/textarea.tsx
import * as React10 from "react";
import { jsx as jsx17 } from "react/jsx-runtime";
var Textarea = React10.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx17(
    "textarea",
    {
      className: cn(
        "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ref,
      ...props
    }
  )
);
Textarea.displayName = "Textarea";

// app/components/ui/tabs.tsx
import * as React11 from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { jsx as jsx18 } from "react/jsx-runtime";
var Tabs = TabsPrimitive.Root, TabsList = React11.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx18(
  TabsPrimitive.List,
  {
    ref,
    className: cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className
    ),
    ...props
  }
));
TabsList.displayName = TabsPrimitive.List.displayName;
var TabsTrigger = React11.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx18(
  TabsPrimitive.Trigger,
  {
    ref,
    className: cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
      className
    ),
    ...props
  }
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
var TabsContent = React11.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx18(
  TabsPrimitive.Content,
  {
    ref,
    className: cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    ),
    ...props
  }
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

// app/components/dashboard/period-tracker.tsx
import { Loader2 as Loader23 } from "lucide-react";
import { jsx as jsx19, jsxs as jsxs6 } from "react/jsx-runtime";
function PeriodTracker({ userId }) {
  let { toast: toast2 } = useToast(), [loading, setLoading] = useState4(!1), [error, setError] = useState4(null), [periods, setPeriods] = useState4([]), [symptomGroups, setSymptomGroups] = useState4([]), [selectedDate, setSelectedDate] = useState4(/* @__PURE__ */ new Date()), [selectedSymptoms, setSelectedSymptoms] = useState4([]), [notes, setNotes] = useState4(""), [activePeriod, setActivePeriod] = useState4(null), [activeTab, setActiveTab] = useState4("calendar");
  useEffect3(() => {
    loadPeriods(), loadSymptomTypes();
  }, []);
  let loadPeriods = async () => {
    try {
      setLoading(!0);
      let { data, error: error2 } = await supabase.from("periods").select("*").eq("user_id", userId).order("start_date", { ascending: !1 });
      if (error2)
        throw error2;
      setPeriods(data || []);
    } catch (err) {
      let message = err instanceof Error ? err.message : "Failed to load periods";
      setError(message), toast2({
        variant: "destructive",
        title: "Error",
        description: message
      });
    } finally {
      setLoading(!1);
    }
  }, loadSymptomTypes = async () => {
    try {
      let { data, error: error2 } = await supabase.from("symptom_types").select("*").order("symptom_category", { ascending: !0 }).order("symptom_name", { ascending: !0 });
      if (error2)
        throw error2;
      let grouped = data?.reduce((acc, symptom) => {
        let group = acc.find((g) => g.category === symptom.symptom_category);
        return group ? group.symptoms.push({ ...symptom, isSelected: !1 }) : acc.push({
          category: symptom.symptom_category,
          symptoms: [{ ...symptom, isSelected: !1 }]
        }), acc;
      }, []) || [];
      setSymptomGroups(grouped);
    } catch (err) {
      console.error("Failed to load symptom types:", err);
    }
  }, handleDateSelect = (date) => {
    if (setSelectedDate(date), date) {
      let active = periods.find((period) => {
        let start = parseDateFromSupabase(period.start_date), end = period.end_date ? parseDateFromSupabase(period.end_date) : null;
        return date >= start && (!end || date <= end);
      });
      if (setActivePeriod(active || null), active) {
        let activeSymptoms = active.symptoms;
        setSelectedSymptoms(activeSymptoms), setNotes(active.notes || ""), setSymptomGroups((groups) => groups.map((group) => ({
          ...group,
          symptoms: group.symptoms.map((symptom) => ({
            ...symptom,
            isSelected: activeSymptoms.some((s) => s.id === symptom.id)
          }))
        })));
      } else
        setSelectedSymptoms([]), setNotes(""), setSymptomGroups((groups) => groups.map((group) => ({
          ...group,
          symptoms: group.symptoms.map((symptom) => ({
            ...symptom,
            isSelected: !1
          }))
        })));
    }
  }, handleSymptomToggle = (symptom) => {
    setSymptomGroups((groups) => groups.map((group) => ({
      ...group,
      symptoms: group.symptoms.map(
        (s) => s.id === symptom.id ? { ...s, isSelected: !s.isSelected } : s
      )
    }))), setSelectedSymptoms((prev) => prev.some((s) => s.id === symptom.id) ? prev.filter((s) => s.id !== symptom.id) : [...prev, { ...symptom, isSelected: !0 }]);
  }, handleSavePeriod = async () => {
    if (selectedDate)
      try {
        setLoading(!0), setError(null);
        let periodData = {
          user_id: userId,
          start_date: formatDateForSupabase(selectedDate),
          symptoms: selectedSymptoms.map((symptom) => ({
            id: symptom.id,
            symptom_name: symptom.symptom_name,
            symptom_category: symptom.symptom_category,
            symptom_icon: symptom.symptom_icon,
            logged_at: (/* @__PURE__ */ new Date()).toISOString()
          })),
          notes: notes.trim() || null
        };
        if (activePeriod) {
          let { error: error2 } = await supabase.from("periods").update(periodData).eq("id", activePeriod.id);
          if (error2)
            throw error2;
          toast2({
            title: "Period updated",
            description: "Your period has been updated successfully."
          });
        } else {
          let { error: error2 } = await supabase.from("periods").insert([periodData]);
          if (error2)
            throw error2;
          toast2({
            title: "Period logged",
            description: "Your period has been logged successfully."
          });
        }
        await loadPeriods();
      } catch (err) {
        let message = err instanceof Error ? err.message : "Failed to save period";
        setError(message), toast2({
          variant: "destructive",
          title: "Error",
          description: message
        });
      } finally {
        setLoading(!1);
      }
  }, handleEndPeriod = async () => {
    if (!(!activePeriod || !selectedDate))
      try {
        setLoading(!0), setError(null);
        let { error: error2 } = await supabase.from("periods").update({
          end_date: formatDateForSupabase(selectedDate)
        }).eq("id", activePeriod.id);
        if (error2)
          throw error2;
        toast2({
          title: "Period ended",
          description: "Your period has been marked as ended."
        }), await loadPeriods();
      } catch (err) {
        let message = err instanceof Error ? err.message : "Failed to end period";
        setError(message), toast2({
          variant: "destructive",
          title: "Error",
          description: message
        });
      } finally {
        setLoading(!1);
      }
  };
  return /* @__PURE__ */ jsx19("div", { className: "space-y-6", children: /* @__PURE__ */ jsxs6(Tabs, { defaultValue: "calendar", value: activeTab, onValueChange: setActiveTab, children: [
    /* @__PURE__ */ jsxs6(TabsList, { className: "grid w-full grid-cols-2", children: [
      /* @__PURE__ */ jsx19(TabsTrigger, { value: "calendar", children: "Calendar" }),
      /* @__PURE__ */ jsx19(TabsTrigger, { value: "symptoms", children: "Symptoms" })
    ] }),
    /* @__PURE__ */ jsx19(TabsContent, { value: "calendar", children: /* @__PURE__ */ jsxs6(Card, { children: [
      /* @__PURE__ */ jsxs6(CardHeader, { children: [
        /* @__PURE__ */ jsx19(CardTitle, { children: "Period Calendar" }),
        /* @__PURE__ */ jsx19(CardDescription, { children: "Track your periods and view your cycle" })
      ] }),
      /* @__PURE__ */ jsx19(CardContent, { children: /* @__PURE__ */ jsxs6("div", { className: "flex flex-col md:flex-row gap-6", children: [
        /* @__PURE__ */ jsx19("div", { className: "flex-1", children: /* @__PURE__ */ jsx19(
          Calendar,
          {
            mode: "single",
            selected: selectedDate,
            onSelect: handleDateSelect,
            className: "rounded-md border",
            modifiers: {
              period: (date) => periods.some((period) => {
                let start = parseDateFromSupabase(period.start_date), end = period.end_date ? parseDateFromSupabase(period.end_date) : null;
                return date >= start && (!end || date <= end);
              })
            },
            modifiersClassNames: {
              period: "bg-red-100 text-red-900 hover:bg-red-200"
            }
          }
        ) }),
        /* @__PURE__ */ jsxs6("div", { className: "flex-1 space-y-4", children: [
          /* @__PURE__ */ jsxs6("div", { children: [
            /* @__PURE__ */ jsx19(Label, { children: "Notes" }),
            /* @__PURE__ */ jsx19(
              Textarea,
              {
                value: notes,
                onChange: (e) => setNotes(e.target.value),
                placeholder: "Add any notes about your period...",
                className: "mt-2",
                disabled: loading
              }
            )
          ] }),
          error && /* @__PURE__ */ jsx19(Alert, { variant: "destructive", children: /* @__PURE__ */ jsx19(AlertDescription, { children: error }) }),
          /* @__PURE__ */ jsxs6("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxs6(
              Button,
              {
                onClick: handleSavePeriod,
                disabled: loading || !selectedDate,
                className: "flex-1",
                children: [
                  loading && /* @__PURE__ */ jsx19(Loader23, { className: "mr-2 h-4 w-4 animate-spin" }),
                  activePeriod ? "Update Period" : "Start Period"
                ]
              }
            ),
            activePeriod && !activePeriod.end_date && /* @__PURE__ */ jsx19(
              Button,
              {
                onClick: handleEndPeriod,
                disabled: loading,
                variant: "outline",
                children: "End Period"
              }
            )
          ] })
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsx19(TabsContent, { value: "symptoms", children: /* @__PURE__ */ jsxs6(Card, { children: [
      /* @__PURE__ */ jsxs6(CardHeader, { children: [
        /* @__PURE__ */ jsx19(CardTitle, { children: "Track Symptoms" }),
        /* @__PURE__ */ jsx19(CardDescription, { children: "Log your symptoms and track patterns" })
      ] }),
      /* @__PURE__ */ jsx19(CardContent, { children: /* @__PURE__ */ jsxs6("div", { className: "space-y-6", children: [
        symptomGroups.map((group) => /* @__PURE__ */ jsxs6("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx19("h3", { className: "font-semibold", children: group.category }),
          /* @__PURE__ */ jsx19("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2", children: group.symptoms.map((symptom) => /* @__PURE__ */ jsxs6(
            Button,
            {
              variant: symptom.isSelected ? "default" : "outline",
              onClick: () => handleSymptomToggle(symptom),
              className: "justify-start",
              disabled: loading,
              children: [
                symptom.symptom_icon && /* @__PURE__ */ jsx19("span", { className: "mr-2", children: symptom.symptom_icon }),
                symptom.symptom_name
              ]
            },
            symptom.id
          )) })
        ] }, group.category)),
        /* @__PURE__ */ jsxs6(
          Button,
          {
            onClick: handleSavePeriod,
            disabled: loading || !selectedDate,
            className: "w-full",
            children: [
              loading && /* @__PURE__ */ jsx19(Loader23, { className: "mr-2 h-4 w-4 animate-spin" }),
              "Save Symptoms"
            ]
          }
        )
      ] }) })
    ] }) })
  ] }) });
}

// app/routes/dashboard.tsx
import { jsx as jsx20, jsxs as jsxs7 } from "react/jsx-runtime";
async function loader5({ request }) {
  let { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError)
    return console.error("Error getting session:", sessionError), redirect3("/login");
  if (!session?.user)
    return redirect3("/login");
  let { data: preferences, error: preferencesError } = await supabase.from("user_preferences").select("*").eq("user_id", session.user.id).single();
  return preferencesError ? (console.error("Error getting preferences:", preferencesError), redirect3("/onboarding")) : preferences ? { userId: session.user.id } : redirect3("/onboarding");
}
function DashboardPage() {
  let { userId } = useLoaderData3();
  return /* @__PURE__ */ jsx20("main", { className: "min-h-screen p-4 md:p-8 bg-background", children: /* @__PURE__ */ jsxs7("div", { className: "max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxs7("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsx20("h1", { className: "text-4xl font-bold tracking-tight", children: "Period Tracker" }),
      /* @__PURE__ */ jsx20("p", { className: "text-muted-foreground mt-2", children: "Track your periods and symptoms" })
    ] }),
    /* @__PURE__ */ jsx20(PeriodTracker, { userId })
  ] }) });
}

// app/routes/settings.tsx
var settings_exports = {};
__export(settings_exports, {
  default: () => Settings,
  loader: () => loader6
});
import { json as json3, redirect as redirect4 } from "@remix-run/node";
import { useLoaderData as useLoaderData4, useNavigate as useNavigate3 } from "@remix-run/react";
import { Loader2 as Loader24, ArrowLeft } from "lucide-react";
import { useState as useState5 } from "react";
import { jsx as jsx21, jsxs as jsxs8 } from "react/jsx-runtime";
var loader6 = async ({ request }) => {
  try {
    let { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError)
      throw sessionError;
    if (!session?.user)
      return redirect4("/login");
    let { data: preferences, error: preferencesError } = await supabase.from("user_preferences").select("*").eq("user_id", session.user.id).single();
    if (preferencesError)
      throw preferencesError;
    let { data: profile, error: profileError } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
    if (profileError)
      throw profileError;
    return json3({ user: session.user, profile, preferences });
  } catch (error) {
    throw console.error("Settings loader error:", error), redirect4("/login");
  }
};
function Settings() {
  let { user, profile, preferences } = useLoaderData4(), navigate = useNavigate3(), { toast: toast2 } = useToast(), [loading, setLoading] = useState5(!1), [error, setError] = useState5(null), [cycleLength, setCycleLength] = useState5(preferences.cycle_length.toString()), [hasPeriodReminders, setHasPeriodReminders] = useState5(preferences.has_period_reminders), [hasPillReminders, setHasPillReminders] = useState5(preferences.has_pill_reminders);
  return /* @__PURE__ */ jsxs8("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx21("header", { className: "border-b", children: /* @__PURE__ */ jsx21("div", { className: "container mx-auto px-4 py-4", children: /* @__PURE__ */ jsxs8("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsx21(
        Button,
        {
          variant: "ghost",
          size: "icon",
          onClick: () => navigate("/dashboard"),
          children: /* @__PURE__ */ jsx21(ArrowLeft, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsxs8("div", { children: [
        /* @__PURE__ */ jsx21("h1", { className: "text-2xl font-bold", children: "Settings" }),
        /* @__PURE__ */ jsx21("p", { className: "text-sm text-muted-foreground", children: "Update your preferences" })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx21("main", { className: "container mx-auto px-4 py-8", children: /* @__PURE__ */ jsx21("div", { className: "max-w-2xl mx-auto", children: /* @__PURE__ */ jsxs8(Card, { children: [
      /* @__PURE__ */ jsxs8(CardHeader, { children: [
        /* @__PURE__ */ jsx21(CardTitle, { children: "Preferences" }),
        /* @__PURE__ */ jsx21(CardDescription, { children: "Customize your period tracking experience" })
      ] }),
      /* @__PURE__ */ jsxs8(CardContent, { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs8("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx21(Label, { htmlFor: "cycleLength", children: "Cycle Length (days)" }),
          /* @__PURE__ */ jsx21(
            Input,
            {
              id: "cycleLength",
              type: "number",
              min: 21,
              max: 35,
              value: cycleLength,
              onChange: (e) => setCycleLength(e.target.value),
              className: "w-32"
            }
          ),
          /* @__PURE__ */ jsx21("p", { className: "text-sm text-muted-foreground", children: "Most cycles are between 21 and 35 days" })
        ] }),
        /* @__PURE__ */ jsxs8("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs8("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs8("div", { className: "space-y-0.5", children: [
              /* @__PURE__ */ jsx21(Label, { children: "Period Reminders" }),
              /* @__PURE__ */ jsx21("p", { className: "text-sm text-muted-foreground", children: "Get notified about your upcoming periods" })
            ] }),
            /* @__PURE__ */ jsx21(
              Switch,
              {
                checked: hasPeriodReminders,
                onCheckedChange: setHasPeriodReminders
              }
            )
          ] }),
          /* @__PURE__ */ jsxs8("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs8("div", { className: "space-y-0.5", children: [
              /* @__PURE__ */ jsx21(Label, { children: "Pill Reminders" }),
              /* @__PURE__ */ jsx21("p", { className: "text-sm text-muted-foreground", children: "Get reminded to take your pills" })
            ] }),
            /* @__PURE__ */ jsx21(
              Switch,
              {
                checked: hasPillReminders,
                onCheckedChange: setHasPillReminders
              }
            )
          ] })
        ] }),
        error && /* @__PURE__ */ jsx21(Alert, { variant: "destructive", children: /* @__PURE__ */ jsx21(AlertDescription, { children: error }) }),
        /* @__PURE__ */ jsxs8(
          Button,
          {
            onClick: async () => {
              try {
                setLoading(!0), setError(null);
                let cycleLengthNum = parseInt(cycleLength);
                if (isNaN(cycleLengthNum) || cycleLengthNum < 21 || cycleLengthNum > 35)
                  throw new Error("Cycle length must be between 21 and 35 days");
                let { error: updateError } = await supabase.from("user_preferences").update({
                  cycle_length: cycleLengthNum,
                  has_period_reminders: hasPeriodReminders,
                  has_pill_reminders: hasPillReminders
                }).eq("user_id", user.id);
                if (updateError)
                  throw updateError;
                toast2({
                  title: "Settings updated",
                  description: "Your preferences have been saved successfully."
                }), navigate("/dashboard");
              } catch (err) {
                let message = err instanceof Error ? err.message : "Failed to update settings";
                setError(message), toast2({
                  variant: "destructive",
                  title: "Error",
                  description: message
                });
              } finally {
                setLoading(!1);
              }
            },
            disabled: loading,
            className: "w-full",
            children: [
              loading && /* @__PURE__ */ jsx21(Loader24, { className: "mr-2 h-4 w-4 animate-spin" }),
              "Save Changes"
            ]
          }
        )
      ] })
    ] }) }) })
  ] });
}

// app/routes/signup.tsx
var signup_exports = {};
__export(signup_exports, {
  default: () => SignUpPage,
  loader: () => loader7
});
import { redirect as redirect5 } from "@remix-run/node";
import { Link } from "@remix-run/react";

// app/components/ui/separator.tsx
import * as React12 from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { jsx as jsx22 } from "react/jsx-runtime";
var Separator = React12.forwardRef(
  ({ className, orientation = "horizontal", decorative = !0, ...props }, ref) => /* @__PURE__ */ jsx22(
    SeparatorPrimitive.Root,
    {
      ref,
      decorative,
      orientation,
      className: cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      ),
      ...props
    }
  )
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

// app/components/auth/google-auth-button.tsx
import { useState as useState6 } from "react";
import { useNavigate as useNavigate4 } from "@remix-run/react";
import { Loader2 as Loader25 } from "lucide-react";
import { jsx as jsx23, jsxs as jsxs9 } from "react/jsx-runtime";
function GoogleAuthButton({ mode: mode2, disabled }) {
  let navigate = useNavigate4(), { toast: toast2 } = useToast(), [loading, setLoading] = useState6(!1);
  return /* @__PURE__ */ jsxs9(
    Button,
    {
      variant: "outline",
      onClick: async () => {
        try {
          setLoading(!0);
          let { data, error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
              redirectTo: `${window.location.origin}/onboarding`,
              queryParams: {
                access_type: "offline",
                prompt: "consent"
              }
            }
          });
          if (error)
            throw error;
          if (!data)
            throw new Error("No data returned from Google sign in");
        } catch (err) {
          let message = err instanceof Error ? err.message : "Failed to authenticate with Google";
          console.error("Google auth error:", err), toast2({
            variant: "destructive",
            title: "Error",
            description: message
          });
        } finally {
          setLoading(!1);
        }
      },
      disabled: loading || disabled,
      className: "w-full",
      children: [
        loading ? /* @__PURE__ */ jsx23(Loader25, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxs9("svg", { className: "mr-2 h-4 w-4", viewBox: "0 0 24 24", children: [
          /* @__PURE__ */ jsx23(
            "path",
            {
              d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z",
              fill: "#4285F4"
            }
          ),
          /* @__PURE__ */ jsx23(
            "path",
            {
              d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z",
              fill: "#34A853"
            }
          ),
          /* @__PURE__ */ jsx23(
            "path",
            {
              d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z",
              fill: "#FBBC05"
            }
          ),
          /* @__PURE__ */ jsx23(
            "path",
            {
              d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z",
              fill: "#EA4335"
            }
          )
        ] }),
        mode2 === "signup" ? "Sign up with Google" : "Continue with Google"
      ]
    }
  );
}

// app/components/auth/signup.tsx
import { useState as useState7 } from "react";
import { useNavigate as useNavigate5 } from "@remix-run/react";
import { Loader2 as Loader26 } from "lucide-react";
import { jsx as jsx24, jsxs as jsxs10 } from "react/jsx-runtime";
function SignUp() {
  let navigate = useNavigate5(), { toast: toast2 } = useToast(), [email, setEmail] = useState7(""), [password, setPassword] = useState7(""), [confirmPassword, setConfirmPassword] = useState7(""), [error, setError] = useState7(null), [loading, setLoading] = useState7(!1), validatePassword = (password2) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password2);
  return /* @__PURE__ */ jsxs10("form", { onSubmit: async (e) => {
    if (e.preventDefault(), !loading)
      try {
        if (setLoading(!0), setError(null), !validatePassword(password))
          throw new Error(
            "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number"
          );
        if (password !== confirmPassword)
          throw new Error("Passwords do not match");
        let { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`
          }
        });
        if (signUpError)
          throw signUpError;
        if (data.user && data.user.email) {
          let newProfile = {
            id: data.user.id,
            email: data.user.email
          }, { error: profileError } = await supabase.from("profiles").insert(newProfile);
          if (profileError)
            throw profileError;
          toast2({
            title: "Account created",
            description: "Please check your email to verify your account."
          }), navigate("/onboarding");
        }
      } catch (err) {
        let message = err instanceof Error ? err.message : "Failed to create account";
        setError(message), toast2({
          variant: "destructive",
          title: "Error",
          description: message
        });
      } finally {
        setLoading(!1);
      }
  }, className: "space-y-4", children: [
    /* @__PURE__ */ jsxs10("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx24(Label, { htmlFor: "email", children: "Email" }),
      /* @__PURE__ */ jsx24(
        Input,
        {
          id: "email",
          type: "email",
          placeholder: "Enter your email",
          value: email,
          onChange: (e) => setEmail(e.target.value),
          required: !0,
          disabled: loading,
          className: "bg-background"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs10("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx24(Label, { htmlFor: "password", children: "Password" }),
      /* @__PURE__ */ jsx24(
        Input,
        {
          id: "password",
          type: "password",
          placeholder: "Create a password",
          value: password,
          onChange: (e) => setPassword(e.target.value),
          required: !0,
          disabled: loading,
          className: "bg-background"
        }
      ),
      /* @__PURE__ */ jsx24("p", { className: "text-sm text-muted-foreground", children: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number" })
    ] }),
    /* @__PURE__ */ jsxs10("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx24(Label, { htmlFor: "confirmPassword", children: "Confirm Password" }),
      /* @__PURE__ */ jsx24(
        Input,
        {
          id: "confirmPassword",
          type: "password",
          placeholder: "Confirm your password",
          value: confirmPassword,
          onChange: (e) => setConfirmPassword(e.target.value),
          required: !0,
          disabled: loading,
          className: "bg-background"
        }
      )
    ] }),
    error && /* @__PURE__ */ jsx24(Alert, { variant: "destructive", children: /* @__PURE__ */ jsx24(AlertDescription, { children: error }) }),
    /* @__PURE__ */ jsxs10(Button, { type: "submit", className: "w-full", disabled: loading, children: [
      loading && /* @__PURE__ */ jsx24(Loader26, { className: "mr-2 h-4 w-4 animate-spin" }),
      "Create Account"
    ] })
  ] });
}

// app/routes/signup.tsx
import { jsx as jsx25, jsxs as jsxs11 } from "react/jsx-runtime";
async function loader7({ request }) {
  let { data: { session }, error } = await supabase.auth.getSession();
  if (error)
    return console.error("Error getting session:", error), null;
  if (session?.user) {
    let { data: preferences } = await supabase.from("user_preferences").select("*").eq("user_id", session.user.id).single();
    return preferences ? redirect5("/dashboard") : redirect5("/onboarding");
  }
  return null;
}
function SignUpPage() {
  return /* @__PURE__ */ jsx25("main", { className: "min-h-screen flex items-center justify-center p-4 bg-background", children: /* @__PURE__ */ jsxs11("div", { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxs11("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsx25("h1", { className: "text-4xl font-bold tracking-tight", children: "Create Account" }),
      /* @__PURE__ */ jsx25("p", { className: "text-muted-foreground mt-2", children: "Sign up to start tracking your periods" })
    ] }),
    /* @__PURE__ */ jsxs11(Card, { children: [
      /* @__PURE__ */ jsxs11(CardHeader, { children: [
        /* @__PURE__ */ jsx25(CardTitle, { children: "Sign Up" }),
        /* @__PURE__ */ jsx25(CardDescription, { children: "Choose your preferred sign up method" })
      ] }),
      /* @__PURE__ */ jsxs11(CardContent, { className: "space-y-6", children: [
        /* @__PURE__ */ jsx25(GoogleAuthButton, { mode: "signup" }),
        /* @__PURE__ */ jsxs11("div", { className: "relative", children: [
          /* @__PURE__ */ jsx25("div", { className: "absolute inset-0 flex items-center", children: /* @__PURE__ */ jsx25(Separator, { className: "w-full" }) }),
          /* @__PURE__ */ jsx25("div", { className: "relative flex justify-center text-xs uppercase", children: /* @__PURE__ */ jsx25("span", { className: "bg-background px-2 text-muted-foreground", children: "Or continue with email" }) })
        ] }),
        /* @__PURE__ */ jsx25(SignUp, {}),
        /* @__PURE__ */ jsxs11("div", { className: "text-center text-sm", children: [
          /* @__PURE__ */ jsxs11("span", { className: "text-muted-foreground", children: [
            "Already have an account?",
            " "
          ] }),
          /* @__PURE__ */ jsx25(
            Link,
            {
              to: "/login",
              className: "text-primary underline-offset-4 hover:underline",
              children: "Sign in"
            }
          )
        ] })
      ] })
    ] })
  ] }) });
}

// app/routes/_index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => Index,
  loader: () => loader8
});
import { redirect as redirect6 } from "@remix-run/node";
import { Link as Link2 } from "@remix-run/react";
import { jsx as jsx26, jsxs as jsxs12 } from "react/jsx-runtime";
async function loader8({ request }) {
  let { data: { session }, error } = await supabase.auth.getSession();
  if (error)
    return console.error("Error getting session:", error), null;
  if (session?.user) {
    let { data: preferences } = await supabase.from("user_preferences").select("*").eq("user_id", session.user.id).single();
    return preferences ? redirect6("/dashboard") : redirect6("/onboarding");
  }
  return null;
}
function Index() {
  return /* @__PURE__ */ jsxs12("main", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsx26("header", { className: "px-4 py-6 border-b", children: /* @__PURE__ */ jsxs12("div", { className: "max-w-7xl mx-auto flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs12("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx26(
          "img",
          {
            src: "/logo-dark.png",
            alt: "Period Tracker",
            className: "h-8 w-auto dark:hidden"
          }
        ),
        /* @__PURE__ */ jsx26(
          "img",
          {
            src: "/logo-light.png",
            alt: "Period Tracker",
            className: "h-8 w-auto hidden dark:block"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs12("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx26(Link2, { to: "/login", children: /* @__PURE__ */ jsx26(Button, { variant: "ghost", children: "Sign in" }) }),
        /* @__PURE__ */ jsx26(Link2, { to: "/signup", children: /* @__PURE__ */ jsx26(Button, { children: "Get Started" }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx26("div", { className: "flex-1 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs12("div", { className: "max-w-3xl mx-auto text-center space-y-8", children: [
      /* @__PURE__ */ jsx26("h1", { className: "text-5xl font-bold tracking-tight", children: "Track Your Periods with Ease" }),
      /* @__PURE__ */ jsx26("p", { className: "text-xl text-muted-foreground", children: "A simple, private, and secure way to track your menstrual cycle. Get insights about your body and stay informed about your health." }),
      /* @__PURE__ */ jsxs12("div", { className: "flex items-center justify-center gap-4", children: [
        /* @__PURE__ */ jsx26(Link2, { to: "/signup", children: /* @__PURE__ */ jsx26(Button, { size: "lg", children: "Create Free Account" }) }),
        /* @__PURE__ */ jsx26(Link2, { to: "/login", children: /* @__PURE__ */ jsx26(Button, { variant: "outline", size: "lg", children: "Sign In" }) })
      ] }),
      /* @__PURE__ */ jsxs12("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8 mt-16", children: [
        /* @__PURE__ */ jsxs12("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx26("h3", { className: "text-xl font-semibold", children: "Track Your Cycle" }),
          /* @__PURE__ */ jsx26("p", { className: "text-muted-foreground", children: "Log your periods and symptoms to understand your body better" })
        ] }),
        /* @__PURE__ */ jsxs12("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx26("h3", { className: "text-xl font-semibold", children: "Get Reminders" }),
          /* @__PURE__ */ jsx26("p", { className: "text-muted-foreground", children: "Never miss a period or pill with customizable reminders" })
        ] }),
        /* @__PURE__ */ jsxs12("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx26("h3", { className: "text-xl font-semibold", children: "Share Safely" }),
          /* @__PURE__ */ jsx26("p", { className: "text-muted-foreground", children: "Share your cycle information with trusted partners" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx26("footer", { className: "px-4 py-6 border-t", children: /* @__PURE__ */ jsxs12("div", { className: "max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxs12("p", { className: "text-sm text-muted-foreground", children: [
        "\xA9 ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " Period Tracker. All rights reserved."
      ] }),
      /* @__PURE__ */ jsxs12("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx26(
          Link2,
          {
            to: "/privacy",
            className: "text-sm text-muted-foreground hover:underline",
            children: "Privacy Policy"
          }
        ),
        /* @__PURE__ */ jsx26(
          Link2,
          {
            to: "/terms",
            className: "text-sm text-muted-foreground hover:underline",
            children: "Terms of Service"
          }
        )
      ] })
    ] }) })
  ] });
}

// app/routes/login.tsx
var login_exports = {};
__export(login_exports, {
  default: () => LoginPage,
  loader: () => loader9
});
import { redirect as redirect7 } from "@remix-run/node";
import { Link as Link4 } from "@remix-run/react";

// app/components/auth/login.tsx
import { useState as useState8 } from "react";
import { useNavigate as useNavigate6 } from "@remix-run/react";
import { Loader2 as Loader27 } from "lucide-react";
import { Link as Link3 } from "@remix-run/react";
import { jsx as jsx27, jsxs as jsxs13 } from "react/jsx-runtime";
function Login() {
  let navigate = useNavigate6(), { toast: toast2 } = useToast(), [email, setEmail] = useState8(""), [password, setPassword] = useState8(""), [error, setError] = useState8(null), [loading, setLoading] = useState8(!1);
  return /* @__PURE__ */ jsxs13("form", { onSubmit: async (e) => {
    if (e.preventDefault(), !loading)
      try {
        setLoading(!0), setError(null);
        let { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (signInError)
          throw signInError;
        if (data.user) {
          let { data: preferences } = await supabase.from("user_preferences").select("*").eq("user_id", data.user.id).single();
          toast2({
            title: "Welcome back!",
            description: "You have successfully signed in."
          }), navigate(preferences ? "/dashboard" : "/onboarding");
        }
      } catch (err) {
        let message = err instanceof Error ? err.message : "Failed to sign in";
        setError(message), toast2({
          variant: "destructive",
          title: "Error",
          description: message
        });
      } finally {
        setLoading(!1);
      }
  }, className: "space-y-4", children: [
    /* @__PURE__ */ jsxs13("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx27(Label, { htmlFor: "email", children: "Email" }),
      /* @__PURE__ */ jsx27(
        Input,
        {
          id: "email",
          type: "email",
          placeholder: "Enter your email",
          value: email,
          onChange: (e) => setEmail(e.target.value),
          required: !0,
          disabled: loading,
          className: "bg-background"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs13("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxs13("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx27(Label, { htmlFor: "password", children: "Password" }),
        /* @__PURE__ */ jsx27(
          Link3,
          {
            to: "/forgot-password",
            className: "text-sm text-primary hover:underline",
            children: "Forgot password?"
          }
        )
      ] }),
      /* @__PURE__ */ jsx27(
        Input,
        {
          id: "password",
          type: "password",
          placeholder: "Enter your password",
          value: password,
          onChange: (e) => setPassword(e.target.value),
          required: !0,
          disabled: loading,
          className: "bg-background"
        }
      )
    ] }),
    error && /* @__PURE__ */ jsx27(Alert, { variant: "destructive", children: /* @__PURE__ */ jsx27(AlertDescription, { children: error }) }),
    /* @__PURE__ */ jsxs13(Button, { type: "submit", className: "w-full", disabled: loading, children: [
      loading && /* @__PURE__ */ jsx27(Loader27, { className: "mr-2 h-4 w-4 animate-spin" }),
      "Sign In"
    ] })
  ] });
}

// app/routes/login.tsx
import { jsx as jsx28, jsxs as jsxs14 } from "react/jsx-runtime";
async function loader9({ request }) {
  let { data: { session }, error } = await supabase.auth.getSession();
  if (error)
    return console.error("Error getting session:", error), null;
  if (session?.user) {
    let { data: preferences } = await supabase.from("user_preferences").select("*").eq("user_id", session.user.id).single();
    return preferences ? redirect7("/dashboard") : redirect7("/onboarding");
  }
  return null;
}
function LoginPage() {
  return /* @__PURE__ */ jsx28("main", { className: "min-h-screen flex items-center justify-center p-4 bg-background", children: /* @__PURE__ */ jsxs14("div", { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxs14("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsx28("h1", { className: "text-4xl font-bold tracking-tight", children: "Welcome Back" }),
      /* @__PURE__ */ jsx28("p", { className: "text-muted-foreground mt-2", children: "Sign in to your account to continue" })
    ] }),
    /* @__PURE__ */ jsxs14(Card, { children: [
      /* @__PURE__ */ jsxs14(CardHeader, { children: [
        /* @__PURE__ */ jsx28(CardTitle, { children: "Sign In" }),
        /* @__PURE__ */ jsx28(CardDescription, { children: "Choose your preferred sign in method" })
      ] }),
      /* @__PURE__ */ jsxs14(CardContent, { className: "space-y-6", children: [
        /* @__PURE__ */ jsx28(GoogleAuthButton, { mode: "login" }),
        /* @__PURE__ */ jsxs14("div", { className: "relative", children: [
          /* @__PURE__ */ jsx28("div", { className: "absolute inset-0 flex items-center", children: /* @__PURE__ */ jsx28(Separator, { className: "w-full" }) }),
          /* @__PURE__ */ jsx28("div", { className: "relative flex justify-center text-xs uppercase", children: /* @__PURE__ */ jsx28("span", { className: "bg-background px-2 text-muted-foreground", children: "Or continue with email" }) })
        ] }),
        /* @__PURE__ */ jsx28(Login, {}),
        /* @__PURE__ */ jsxs14("div", { className: "text-center text-sm", children: [
          /* @__PURE__ */ jsxs14("span", { className: "text-muted-foreground", children: [
            "Don't have an account?",
            " "
          ] }),
          /* @__PURE__ */ jsx28(
            Link4,
            {
              to: "/signup",
              className: "text-primary underline-offset-4 hover:underline",
              children: "Sign up"
            }
          )
        ] })
      ] })
    ] })
  ] }) });
}

// app/routes/share.tsx
var share_exports = {};
__export(share_exports, {
  default: () => Share,
  loader: () => loader10
});
import { json as json4, redirect as redirect8 } from "@remix-run/node";
import { useLoaderData as useLoaderData5, useNavigate as useNavigate7 } from "@remix-run/react";
import { Loader2 as Loader28, ArrowLeft as ArrowLeft2, Copy, Check } from "lucide-react";
import { useState as useState9 } from "react";
import { nanoid } from "nanoid";
import { jsx as jsx29, jsxs as jsxs15 } from "react/jsx-runtime";
var loader10 = async ({ request }) => {
  try {
    let { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError)
      throw sessionError;
    if (!session?.user)
      return redirect8("/login");
    let { data: sharedCycles, error: sharedError } = await supabase.from("shared_cycles").select(`
        *,
        shared_with:profiles!shared_cycles_shared_with_id_fkey(email)
      `).eq("user_id", session.user.id);
    if (sharedError)
      throw sharedError;
    return json4({ user: session.user, sharedCycles });
  } catch (error) {
    throw console.error("Share loader error:", error), redirect8("/login");
  }
};
function Share() {
  let { user, sharedCycles } = useLoaderData5(), navigate = useNavigate7(), { toast: toast2 } = useToast(), [loading, setLoading] = useState9(!1), [error, setError] = useState9(null), [email, setEmail] = useState9(""), [copied, setCopied] = useState9(!1), handleShare = async () => {
    try {
      setLoading(!0), setError(null);
      let { data: profile, error: profileError } = await supabase.from("profiles").select("id").eq("email", email).single();
      if (profileError)
        throw new Error("User not found. Make sure they have an account.");
      let shareCode = nanoid(10), expiresAt = /* @__PURE__ */ new Date();
      expiresAt.setDate(expiresAt.getDate() + 1);
      let { error: shareError } = await supabase.from("shared_cycles").insert([{
        user_id: user.id,
        shared_with_id: profile.id,
        share_code: shareCode,
        expires_at: expiresAt.toISOString()
      }]);
      if (shareError)
        throw shareError;
      toast2({
        title: "Share created",
        description: "Your cycle information has been shared successfully."
      }), setEmail(""), navigate(0);
    } catch (err) {
      let message = err instanceof Error ? err.message : "Failed to share cycle";
      setError(message), toast2({
        variant: "destructive",
        title: "Error",
        description: message
      });
    } finally {
      setLoading(!1);
    }
  }, handleCopyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code), setCopied(!0), setTimeout(() => setCopied(!1), 2e3), toast2({
        title: "Code copied",
        description: "Share code has been copied to clipboard."
      });
    } catch {
      toast2({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy code to clipboard."
      });
    }
  }, handleRemoveShare = async (id) => {
    try {
      setLoading(!0);
      let { error: error2 } = await supabase.from("shared_cycles").delete().eq("id", id);
      if (error2)
        throw error2;
      toast2({
        title: "Share removed",
        description: "Access has been revoked successfully."
      }), navigate(0);
    } catch (err) {
      let message = err instanceof Error ? err.message : "Failed to remove share";
      toast2({
        variant: "destructive",
        title: "Error",
        description: message
      });
    } finally {
      setLoading(!1);
    }
  };
  return /* @__PURE__ */ jsxs15("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx29("header", { className: "border-b", children: /* @__PURE__ */ jsx29("div", { className: "container mx-auto px-4 py-4", children: /* @__PURE__ */ jsxs15("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsx29(
        Button,
        {
          variant: "ghost",
          size: "icon",
          onClick: () => navigate("/dashboard"),
          children: /* @__PURE__ */ jsx29(ArrowLeft2, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsxs15("div", { children: [
        /* @__PURE__ */ jsx29("h1", { className: "text-2xl font-bold", children: "Share Cycle" }),
        /* @__PURE__ */ jsx29("p", { className: "text-sm text-muted-foreground", children: "Share your cycle with trusted partners" })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx29("main", { className: "container mx-auto px-4 py-8", children: /* @__PURE__ */ jsxs15("div", { className: "max-w-2xl mx-auto space-y-6", children: [
      /* @__PURE__ */ jsxs15(Card, { children: [
        /* @__PURE__ */ jsxs15(CardHeader, { children: [
          /* @__PURE__ */ jsx29(CardTitle, { children: "Share with Someone" }),
          /* @__PURE__ */ jsx29(CardDescription, { children: "Enter their email to share your cycle information" })
        ] }),
        /* @__PURE__ */ jsxs15(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs15("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx29(
              Input,
              {
                type: "email",
                placeholder: "Enter email address",
                value: email,
                onChange: (e) => setEmail(e.target.value),
                disabled: loading
              }
            ),
            /* @__PURE__ */ jsxs15(
              Button,
              {
                onClick: handleShare,
                disabled: loading || !email,
                children: [
                  loading && /* @__PURE__ */ jsx29(Loader28, { className: "mr-2 h-4 w-4 animate-spin" }),
                  "Share"
                ]
              }
            )
          ] }),
          error && /* @__PURE__ */ jsx29(Alert, { variant: "destructive", children: /* @__PURE__ */ jsx29(AlertDescription, { children: error }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs15(Card, { children: [
        /* @__PURE__ */ jsxs15(CardHeader, { children: [
          /* @__PURE__ */ jsx29(CardTitle, { children: "Active Shares" }),
          /* @__PURE__ */ jsx29(CardDescription, { children: "Manage who has access to your cycle information" })
        ] }),
        /* @__PURE__ */ jsx29(CardContent, { children: sharedCycles.length === 0 ? /* @__PURE__ */ jsx29("p", { className: "text-sm text-muted-foreground", children: "You haven't shared your cycle with anyone yet" }) : /* @__PURE__ */ jsx29("div", { className: "space-y-4", children: sharedCycles.map((share) => /* @__PURE__ */ jsxs15(
          "div",
          {
            className: "flex items-center justify-between p-4 border rounded-lg",
            children: [
              /* @__PURE__ */ jsxs15("div", { children: [
                /* @__PURE__ */ jsx29("p", { className: "font-medium", children: share.shared_with.email }),
                /* @__PURE__ */ jsxs15("p", { className: "text-sm text-muted-foreground", children: [
                  "Expires: ",
                  new Date(share.expires_at).toLocaleDateString()
                ] })
              ] }),
              /* @__PURE__ */ jsxs15("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx29(
                  Button,
                  {
                    variant: "outline",
                    size: "icon",
                    onClick: () => handleCopyCode(share.share_code),
                    children: copied ? /* @__PURE__ */ jsx29(Check, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx29(Copy, { className: "h-4 w-4" })
                  }
                ),
                /* @__PURE__ */ jsx29(
                  Button,
                  {
                    variant: "destructive",
                    onClick: () => handleRemoveShare(share.id),
                    disabled: loading,
                    children: "Remove"
                  }
                )
              ] })
            ]
          },
          share.id
        )) }) })
      ] })
    ] }) })
  ] });
}

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { entry: { module: "/build/entry.client-NX2IR6KB.js", imports: ["/build/_shared/chunk-JP2RFOQ7.js", "/build/_shared/chunk-G5WX4PPA.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-B7T453QB.js", imports: ["/build/_shared/chunk-SOZJRLH2.js", "/build/_shared/chunk-BRSLZYGM.js", "/build/_shared/chunk-EKVI7LUR.js", "/build/_shared/chunk-YE2UENJQ.js", "/build/_shared/chunk-KTYYHXXO.js", "/build/_shared/chunk-57Q5BGZR.js", "/build/_shared/chunk-HB276KJY.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/_index": { id: "routes/_index", parentId: "root", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/_index-TU3JECAP.js", imports: ["/build/_shared/chunk-6NL3JN34.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/api.verify-captcha": { id: "routes/api.verify-captcha", parentId: "root", path: "api/verify-captcha", index: void 0, caseSensitive: void 0, module: "/build/routes/api.verify-captcha-PVGLK3ZA.js", imports: void 0, hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/dashboard": { id: "routes/dashboard", parentId: "root", path: "dashboard", index: void 0, caseSensitive: void 0, module: "/build/routes/dashboard-GMPJO3F7.js", imports: ["/build/_shared/chunk-V7A4TTYH.js", "/build/_shared/chunk-TLKRROZH.js", "/build/_shared/chunk-PLAFFANM.js", "/build/_shared/chunk-6NL3JN34.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/forgot-password": { id: "routes/forgot-password", parentId: "root", path: "forgot-password", index: void 0, caseSensitive: void 0, module: "/build/routes/forgot-password-EXORTSNU.js", imports: ["/build/_shared/chunk-6KU7KB65.js", "/build/_shared/chunk-TLKRROZH.js", "/build/_shared/chunk-PLAFFANM.js", "/build/_shared/chunk-6NL3JN34.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/login": { id: "routes/login", parentId: "root", path: "login", index: void 0, caseSensitive: void 0, module: "/build/routes/login-2QUHW3BP.js", imports: ["/build/_shared/chunk-O7ZHU2XC.js", "/build/_shared/chunk-6KU7KB65.js", "/build/_shared/chunk-TLKRROZH.js", "/build/_shared/chunk-PLAFFANM.js", "/build/_shared/chunk-6NL3JN34.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/onboarding": { id: "routes/onboarding", parentId: "root", path: "onboarding", index: void 0, caseSensitive: void 0, module: "/build/routes/onboarding-KLXGHIQO.js", imports: ["/build/_shared/chunk-V7A4TTYH.js", "/build/_shared/chunk-TE53RJ7G.js", "/build/_shared/chunk-6KU7KB65.js", "/build/_shared/chunk-TLKRROZH.js", "/build/_shared/chunk-PLAFFANM.js", "/build/_shared/chunk-6NL3JN34.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/settings": { id: "routes/settings", parentId: "root", path: "settings", index: void 0, caseSensitive: void 0, module: "/build/routes/settings-MPABRJO2.js", imports: ["/build/_shared/chunk-TE53RJ7G.js", "/build/_shared/chunk-6KU7KB65.js", "/build/_shared/chunk-TLKRROZH.js", "/build/_shared/chunk-PLAFFANM.js", "/build/_shared/chunk-6NL3JN34.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/share": { id: "routes/share", parentId: "root", path: "share", index: void 0, caseSensitive: void 0, module: "/build/routes/share-WJTZKMVZ.js", imports: ["/build/_shared/chunk-6KU7KB65.js", "/build/_shared/chunk-PLAFFANM.js", "/build/_shared/chunk-6NL3JN34.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/signup": { id: "routes/signup", parentId: "root", path: "signup", index: void 0, caseSensitive: void 0, module: "/build/routes/signup-SCVBSEMQ.js", imports: ["/build/_shared/chunk-O7ZHU2XC.js", "/build/_shared/chunk-6KU7KB65.js", "/build/_shared/chunk-TLKRROZH.js", "/build/_shared/chunk-PLAFFANM.js", "/build/_shared/chunk-6NL3JN34.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 } }, version: "9414ed00", hmr: void 0, url: "/build/manifest-9414ED00.js" };

// server-entry-module:@remix-run/dev/server-build
var mode = "production", assetsBuildDirectory = "public\\build", future = { v3_fetcherPersist: !1, v3_relativeSplatPath: !1, v3_throwAbortReason: !1, unstable_singleFetch: !1, unstable_lazyRouteDiscovery: !1, unstable_optimizeDeps: !1 }, publicPath = "/build/", entry = { module: entry_server_exports }, routes = {
  root: {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/api.verify-captcha": {
    id: "routes/api.verify-captcha",
    parentId: "root",
    path: "api/verify-captcha",
    index: void 0,
    caseSensitive: void 0,
    module: api_verify_captcha_exports
  },
  "routes/forgot-password": {
    id: "routes/forgot-password",
    parentId: "root",
    path: "forgot-password",
    index: void 0,
    caseSensitive: void 0,
    module: forgot_password_exports
  },
  "routes/onboarding": {
    id: "routes/onboarding",
    parentId: "root",
    path: "onboarding",
    index: void 0,
    caseSensitive: void 0,
    module: onboarding_exports
  },
  "routes/dashboard": {
    id: "routes/dashboard",
    parentId: "root",
    path: "dashboard",
    index: void 0,
    caseSensitive: void 0,
    module: dashboard_exports
  },
  "routes/settings": {
    id: "routes/settings",
    parentId: "root",
    path: "settings",
    index: void 0,
    caseSensitive: void 0,
    module: settings_exports
  },
  "routes/signup": {
    id: "routes/signup",
    parentId: "root",
    path: "signup",
    index: void 0,
    caseSensitive: void 0,
    module: signup_exports
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: !0,
    caseSensitive: void 0,
    module: index_exports
  },
  "routes/login": {
    id: "routes/login",
    parentId: "root",
    path: "login",
    index: void 0,
    caseSensitive: void 0,
    module: login_exports
  },
  "routes/share": {
    id: "routes/share",
    parentId: "root",
    path: "share",
    index: void 0,
    caseSensitive: void 0,
    module: share_exports
  }
};
export {
  assets_manifest_default as assets,
  assetsBuildDirectory,
  entry,
  future,
  mode,
  publicPath,
  routes
};
