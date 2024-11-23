import { useState, useEffect } from "react";
import { Calendar } from "~/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { useToast } from "~/hooks/use-toast";
import { supabase, formatDateForSupabase, parseDateFromSupabase } from "~/lib/supabase";
import type { Period, SymptomType, SymptomWithUI, PeriodWithSymptoms } from "~/lib/database.types";

interface PeriodTrackerProps {
  userId: string;
}

interface SymptomGroup {
  category: string;
  symptoms: SymptomWithUI[];
}

export function PeriodTracker({ userId }: PeriodTrackerProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [periods, setPeriods] = useState<PeriodWithSymptoms[]>([]);
  const [symptomGroups, setSymptomGroups] = useState<SymptomGroup[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSymptoms, setSelectedSymptoms] = useState<SymptomWithUI[]>([]);
  const [notes, setNotes] = useState("");
  const [activePeriod, setActivePeriod] = useState<PeriodWithSymptoms | null>(null);
  const [activeTab, setActiveTab] = useState("calendar");

  useEffect(() => {
    loadPeriods();
    loadSymptomTypes();
  }, []);

  const loadPeriods = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("periods")
        .select("*")
        .eq("user_id", userId)
        .order("start_date", { ascending: false });

      if (error) throw error;
      setPeriods(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load periods";
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

  const loadSymptomTypes = async () => {
    try {
      const { data, error } = await supabase
        .from("symptom_types")
        .select("*")
        .order("symptom_category", { ascending: true })
        .order("symptom_name", { ascending: true });

      if (error) throw error;

      // Group symptoms by category
      const grouped = data?.reduce((acc: SymptomGroup[], symptom) => {
        const group = acc.find(g => g.category === symptom.symptom_category);
        if (group) {
          group.symptoms.push({ ...symptom, isSelected: false });
        } else {
          acc.push({
            category: symptom.symptom_category,
            symptoms: [{ ...symptom, isSelected: false }],
          });
        }
        return acc;
      }, []) || [];

      setSymptomGroups(grouped);
    } catch (err) {
      console.error("Failed to load symptom types:", err);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const active = periods.find(period => {
        const start = parseDateFromSupabase(period.start_date);
        const end = period.end_date ? parseDateFromSupabase(period.end_date) : null;
        return date >= start && (!end || date <= end);
      });
      setActivePeriod(active || null);
      if (active) {
        // Update selected symptoms based on active period
        const activeSymptoms = active.symptoms as SymptomWithUI[];
        setSelectedSymptoms(activeSymptoms);
        setNotes(active.notes || "");

        // Update symptom groups to show selected symptoms
        setSymptomGroups(groups => groups.map(group => ({
          ...group,
          symptoms: group.symptoms.map(symptom => ({
            ...symptom,
            isSelected: activeSymptoms.some(s => s.id === symptom.id),
          })),
        })));
      } else {
        setSelectedSymptoms([]);
        setNotes("");
        // Reset all symptom selections
        setSymptomGroups(groups => groups.map(group => ({
          ...group,
          symptoms: group.symptoms.map(symptom => ({
            ...symptom,
            isSelected: false,
          })),
        })));
      }
    }
  };

  const handleSymptomToggle = (symptom: SymptomWithUI) => {
    // Update symptom groups
    setSymptomGroups(groups => groups.map(group => ({
      ...group,
      symptoms: group.symptoms.map(s => 
        s.id === symptom.id ? { ...s, isSelected: !s.isSelected } : s
      ),
    })));

    // Update selected symptoms
    setSelectedSymptoms(prev => {
      const exists = prev.some(s => s.id === symptom.id);
      if (exists) {
        return prev.filter(s => s.id !== symptom.id);
      } else {
        return [...prev, { ...symptom, isSelected: true }];
      }
    });
  };

  const handleSavePeriod = async () => {
    if (!selectedDate) return;

    try {
      setLoading(true);
      setError(null);

      const periodData = {
        user_id: userId,
        start_date: formatDateForSupabase(selectedDate),
        symptoms: selectedSymptoms.map(symptom => ({
          id: symptom.id,
          symptom_name: symptom.symptom_name,
          symptom_category: symptom.symptom_category,
          symptom_icon: symptom.symptom_icon,
          logged_at: new Date().toISOString(),
        })),
        notes: notes.trim() || null,
      };

      if (activePeriod) {
        const { error } = await supabase
          .from("periods")
          .update(periodData)
          .eq("id", activePeriod.id);

        if (error) throw error;

        toast({
          title: "Period updated",
          description: "Your period has been updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from("periods")
          .insert([periodData]);

        if (error) throw error;

        toast({
          title: "Period logged",
          description: "Your period has been logged successfully.",
        });
      }

      await loadPeriods();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save period";
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

  const handleEndPeriod = async () => {
    if (!activePeriod || !selectedDate) return;

    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from("periods")
        .update({
          end_date: formatDateForSupabase(selectedDate),
        })
        .eq("id", activePeriod.id);

      if (error) throw error;

      toast({
        title: "Period ended",
        description: "Your period has been marked as ended.",
      });

      await loadPeriods();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to end period";
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
    <div className="space-y-6">
      <Tabs defaultValue="calendar" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Period Calendar</CardTitle>
              <CardDescription>
                Track your periods and view your cycle
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    className="rounded-md border"
                    modifiers={{
                      period: (date) => periods.some(period => {
                        const start = parseDateFromSupabase(period.start_date);
                        const end = period.end_date ? parseDateFromSupabase(period.end_date) : null;
                        return date >= start && (!end || date <= end);
                      }),
                    }}
                    modifiersClassNames={{
                      period: "bg-red-100 text-red-900 hover:bg-red-200",
                    }}
                  />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <Label>Notes</Label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add any notes about your period..."
                      className="mt-2"
                      disabled={loading}
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex gap-2">
                    <Button
                      onClick={handleSavePeriod}
                      disabled={loading || !selectedDate}
                      className="flex-1"
                    >
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {activePeriod ? "Update Period" : "Start Period"}
                    </Button>
                    {activePeriod && !activePeriod.end_date && (
                      <Button
                        onClick={handleEndPeriod}
                        disabled={loading}
                        variant="outline"
                      >
                        End Period
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="symptoms">
          <Card>
            <CardHeader>
              <CardTitle>Track Symptoms</CardTitle>
              <CardDescription>
                Log your symptoms and track patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {symptomGroups.map((group) => (
                  <div key={group.category} className="space-y-4">
                    <h3 className="font-semibold">{group.category}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {group.symptoms.map((symptom) => (
                        <Button
                          key={symptom.id}
                          variant={symptom.isSelected ? "default" : "outline"}
                          onClick={() => handleSymptomToggle(symptom)}
                          className="justify-start"
                          disabled={loading}
                        >
                          {symptom.symptom_icon && (
                            <span className="mr-2">{symptom.symptom_icon}</span>
                          )}
                          {symptom.symptom_name}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}

                <Button
                  onClick={handleSavePeriod}
                  disabled={loading || !selectedDate}
                  className="w-full"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Symptoms
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}