import { json, redirect } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "~/hooks/use-toast";
import { supabase } from "~/lib/supabase";
import { useState } from "react";

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;

    if (!session?.user) {
      return redirect("/login");
    }

    const { data: preferences, error: preferencesError } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", session.user.id)
      .single();

    if (preferencesError) throw preferencesError;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (profileError) throw profileError;

    return json({ user: session.user, profile, preferences });
  } catch (error) {
    console.error("Settings loader error:", error);
    throw redirect("/login");
  }
};

export default function Settings() {
  const { user, profile, preferences } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cycleLength, setCycleLength] = useState(preferences.cycle_length.toString());
  const [hasPeriodReminders, setHasPeriodReminders] = useState(preferences.has_period_reminders);
  const [hasPillReminders, setHasPillReminders] = useState(preferences.has_pill_reminders);

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      const cycleLengthNum = parseInt(cycleLength);
      if (isNaN(cycleLengthNum) || cycleLengthNum < 21 || cycleLengthNum > 35) {
        throw new Error("Cycle length must be between 21 and 35 days");
      }

      const { error: updateError } = await supabase
        .from("user_preferences")
        .update({
          cycle_length: cycleLengthNum,
          has_period_reminders: hasPeriodReminders,
          has_pill_reminders: hasPillReminders,
        })
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      toast({
        title: "Settings updated",
        description: "Your preferences have been saved successfully.",
      });

      navigate("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update settings";
      setError(message);
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Settings</h1>
              <p className="text-sm text-muted-foreground">
                Update your preferences
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>
                Customize your period tracking experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="cycleLength">Cycle Length (days)</Label>
                <Input
                  id="cycleLength"
                  type="number"
                  min={21}
                  max={35}
                  value={cycleLength}
                  onChange={(e) => setCycleLength(e.target.value)}
                  className="w-32"
                />
                <p className="text-sm text-muted-foreground">
                  Most cycles are between 21 and 35 days
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Period Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about your upcoming periods
                    </p>
                  </div>
                  <Switch
                    checked={hasPeriodReminders}
                    onCheckedChange={setHasPeriodReminders}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Pill Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Get reminded to take your pills
                    </p>
                  </div>
                  <Switch
                    checked={hasPillReminders}
                    onCheckedChange={setHasPillReminders}
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleSave}
                disabled={loading}
                className="w-full"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}