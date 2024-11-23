import { useState } from "react";
import { useNavigate } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Calendar } from "~/components/ui/calendar";
import { Progress } from "~/components/ui/progress";
import { useToast } from "~/hooks/use-toast";
import { supabase } from "~/lib/supabase";
import { Loader2 } from "lucide-react";
import type { NewUserPreferences } from "~/lib/database.types";

interface OnboardingFlowProps {
  userId: string;
}

export function OnboardingFlow({ userId }: OnboardingFlowProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Step 1: Last period date
  const [lastPeriodDate, setLastPeriodDate] = useState<Date | undefined>(new Date());
  
  // Step 2: Cycle length
  const [cycleLength, setCycleLength] = useState("28");
  
  // Step 3: Reminders
  const [hasPeriodReminders, setHasPeriodReminders] = useState(true);
  const [hasPillReminders, setHasPillReminders] = useState(false);

  const handleNext = () => {
    if (step === 1 && !lastPeriodDate) {
      setError("Please select your last period date");
      return;
    }

    if (step === 2) {
      const length = parseInt(cycleLength);
      if (isNaN(length) || length < 21 || length > 35) {
        setError("Cycle length must be between 21 and 35 days");
        return;
      }
    }

    if (step < 3) {
      setError(null);
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setError(null);
    setStep(step - 1);
  };

  const handleComplete = async () => {
    if (!lastPeriodDate) {
      setError("Please select your last period date");
      return;
    }

    const length = parseInt(cycleLength);
    if (isNaN(length) || length < 21 || length > 35) {
      setError("Cycle length must be between 21 and 35 days");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const preferences: NewUserPreferences = {
        user_id: userId,
        cycle_length: length,
        last_period_date: lastPeriodDate.toISOString().split('T')[0],
        has_period_reminders: hasPeriodReminders,
        has_pill_reminders: hasPillReminders,
      };

      const { error: preferencesError } = await supabase
        .from("user_preferences")
        .insert(preferences);

      if (preferencesError) throw preferencesError;

      toast({
        title: "Setup complete",
        description: "Your preferences have been saved successfully.",
      });

      navigate("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save preferences";
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Welcome to Period Tracker</h1>
          <p className="text-muted-foreground mt-2">
            Let's get your account set up
          </p>
        </div>

        <Progress 
          value={(step / 3) * 100} 
          className="mb-8"
        />

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 && "When was your last period?"}
              {step === 2 && "How long is your cycle?"}
              {step === 3 && "Set up reminders"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "This helps us predict your next period"}
              {step === 2 && "Most cycles are between 21 and 35 days"}
              {step === 3 && "Choose what you want to be reminded about"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <Calendar
                mode="single"
                selected={lastPeriodDate}
                onSelect={setLastPeriodDate}
                disabled={(date) => date > new Date()}
                className="rounded-md border"
              />
            )}

            {step === 2 && (
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
            )}

            {step === 3 && (
              <div className="space-y-6">
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
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-between pt-4">
              {step > 1 ? (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={loading}
                >
                  Back
                </Button>
              ) : (
                <div></div> // Spacer
              )}

              {step < 3 ? (
                <Button onClick={handleNext} disabled={loading}>
                  Next
                </Button>
              ) : (
                <Button onClick={handleComplete} disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Complete Setup
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}