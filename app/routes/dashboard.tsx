import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { PeriodTracker } from "~/components/dashboard/period-tracker";
import { supabase } from "~/lib/supabase";

export async function loader({ request }: LoaderFunctionArgs) {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    console.error("Error getting session:", sessionError);
    return redirect("/login");
  }

  if (!session?.user) {
    return redirect("/login");
  }

  // Check if user has completed onboarding
  const { data: preferences, error: preferencesError } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", session.user.id)
    .single();

  if (preferencesError) {
    console.error("Error getting preferences:", preferencesError);
    return redirect("/onboarding");
  }

  if (!preferences) {
    return redirect("/onboarding");
  }

  return { userId: session.user.id };
}

export default function DashboardPage() {
  const { userId } = useLoaderData<typeof loader>();

  return (
    <main className="min-h-screen p-4 md:p-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Period Tracker</h1>
          <p className="text-muted-foreground mt-2">
            Track your periods and symptoms
          </p>
        </div>

        <PeriodTracker userId={userId} />
      </div>
    </main>
  );
}