import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { supabase } from "~/lib/supabase";

export async function loader({ request }: LoaderFunctionArgs) {
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    console.error("Error getting session:", error);
    return null;
  }

  if (session?.user) {
    // Check if user has completed onboarding
    const { data: preferences } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", session.user.id)
      .single();

    if (preferences) {
      return redirect("/dashboard");
    } else {
      return redirect("/onboarding");
    }
  }

  return null;
}

export default function Index() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="px-4 py-6 border-b">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/logo-dark.png"
              alt="Period Tracker"
              className="h-8 w-auto dark:hidden"
            />
            <img
              src="/logo-light.png"
              alt="Period Tracker"
              className="h-8 w-auto hidden dark:block"
            />
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link to="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="text-5xl font-bold tracking-tight">
            Track Your Periods with Ease
          </h1>
          <p className="text-xl text-muted-foreground">
            A simple, private, and secure way to track your menstrual cycle.
            Get insights about your body and stay informed about your health.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/signup">
              <Button size="lg">Create Free Account</Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">Sign In</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Track Your Cycle</h3>
              <p className="text-muted-foreground">
                Log your periods and symptoms to understand your body better
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Get Reminders</h3>
              <p className="text-muted-foreground">
                Never miss a period or pill with customizable reminders
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Share Safely</h3>
              <p className="text-muted-foreground">
                Share your cycle information with trusted partners
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="px-4 py-6 border-t">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Period Tracker. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/privacy"
              className="text-sm text-muted-foreground hover:underline"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-sm text-muted-foreground hover:underline"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}