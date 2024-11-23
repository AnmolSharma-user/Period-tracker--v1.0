import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { OnboardingFlow } from "~/components/onboarding/onboarding-flow";
import { supabase } from "~/lib/supabase";

export async function loader({ request }: LoaderFunctionArgs) {
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    console.error("Error getting session:", error);
    return redirect("/login");
  }

  if (!session?.user) {
    return redirect("/login");
  }

  // Check if user already completed onboarding
  const { data: preferences } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", session.user.id)
    .single();

  if (preferences) {
    return redirect("/dashboard");
  }

  return { userId: session.user.id };
}

export default function OnboardingPage() {
  const { userId } = useLoaderData<typeof loader>();

  return (
    <main>
      <OnboardingFlow userId={userId} />
    </main>
  );
}