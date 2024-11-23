import { json, redirect } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Loader2, ArrowLeft, Copy, Check } from "lucide-react";
import { useToast } from "~/hooks/use-toast";
import { supabase } from "~/lib/supabase";
import { useState } from "react";
import { nanoid } from "nanoid";
import type { SharedCycle } from "~/lib/database.types";

interface LoaderData {
  user: {
    id: string;
  };
  sharedCycles: (SharedCycle & {
    shared_with: {
      email: string;
    };
  })[];
}

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;

    if (!session?.user) {
      return redirect("/login");
    }

    const { data: sharedCycles, error: sharedError } = await supabase
      .from("shared_cycles")
      .select(`
        *,
        shared_with:profiles!shared_cycles_shared_with_id_fkey(email)
      `)
      .eq("user_id", session.user.id);

    if (sharedError) throw sharedError;

    return json({ user: session.user, sharedCycles });
  } catch (error) {
    console.error("Share loader error:", error);
    throw redirect("/login");
  }
};

export default function Share() {
  const { user, sharedCycles } = useLoaderData<LoaderData>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if email exists
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email)
        .single();

      if (profileError) {
        throw new Error("User not found. Make sure they have an account.");
      }

      // Generate share code
      const shareCode = nanoid(10);
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 1); // 24 hours expiry

      const { error: shareError } = await supabase
        .from("shared_cycles")
        .insert([{
          user_id: user.id,
          shared_with_id: profile.id,
          share_code: shareCode,
          expires_at: expiresAt.toISOString(),
        }]);

      if (shareError) throw shareError;

      toast({
        title: "Share created",
        description: "Your cycle information has been shared successfully.",
      });

      setEmail("");
      navigate(0); // Refresh the page to show new share
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to share cycle";
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

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Code copied",
        description: "Share code has been copied to clipboard.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy code to clipboard.",
      });
    }
  };

  const handleRemoveShare = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("shared_cycles")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Share removed",
        description: "Access has been revoked successfully.",
      });

      navigate(0); // Refresh the page
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to remove share";
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
              <h1 className="text-2xl font-bold">Share Cycle</h1>
              <p className="text-sm text-muted-foreground">
                Share your cycle with trusted partners
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Share with Someone</CardTitle>
              <CardDescription>
                Enter their email to share your cycle information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
                <Button
                  onClick={handleShare}
                  disabled={loading || !email}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Share
                </Button>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Shares</CardTitle>
              <CardDescription>
                Manage who has access to your cycle information
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sharedCycles.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  You haven't shared your cycle with anyone yet
                </p>
              ) : (
                <div className="space-y-4">
                  {sharedCycles.map((share) => (
                    <div
                      key={share.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">
                          {share.shared_with.email}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Expires: {new Date(share.expires_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleCopyCode(share.share_code)}
                        >
                          {copied ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleRemoveShare(share.id)}
                          disabled={loading}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}