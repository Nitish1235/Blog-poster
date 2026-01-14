"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // In production we assume env vars are set in the hosting platform (e.g. Cloud Run)
    // and we don't want to show the local ".env.local" warning banner.
    if (process.env.NODE_ENV === "production") {
      setIsConfigured(true);
      return;
    }

    // Development check for local setup
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (url && key && !url.includes("your_supabase") && !key.includes("your_supabase") && !url.includes("placeholder")) {
      setIsConfigured(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // In development, prevent login if Supabase isn't configured
    if (!isConfigured && process.env.NODE_ENV !== "production") {
      setError("Supabase is not configured. Please set up your .env.local file with your Supabase credentials.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      router.push("/admin");
      router.refresh();
    } catch (error: any) {
      setError(error.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <Card className="w-full max-w-md p-6 sm:p-8" sharp="br">
        <h1 className="text-2xl sm:text-3xl font-black uppercase mb-2">Admin Login</h1>
        <p className="text-gray-600 font-medium mb-6 md:mb-8 text-sm sm:text-base">
          Sign in to manage your blog content
        </p>

        {/* Show configuration warning only in development */}
        {!isConfigured && process.env.NODE_ENV !== "production" && (
          <div className="bg-yellow-50 border-2 border-yellow-500 text-yellow-800 px-3 sm:px-4 py-2 sm:py-3 rounded-md mb-4 font-medium text-sm sm:text-base">
            <p className="font-bold mb-1 sm:mb-2">⚠️ Supabase Not Configured (Local)</p>
            <p className="text-xs sm:text-sm">
              Please set up your <code className="bg-yellow-100 px-1 rounded">.env.local</code> file with your Supabase credentials.
              See <code className="bg-yellow-100 px-1 rounded">ENV_SETUP.md</code> for instructions.
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-2 border-red-500 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-md mb-4 font-medium text-sm sm:text-base">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block font-bold uppercase text-sm mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-12 px-4 border-2 border-border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block font-bold uppercase text-sm mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-12 px-4 border-2 border-border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full touch-manipulation"
            sharp="br"
            disabled={loading || !isConfigured}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-xs sm:text-sm font-medium text-gray-600 hover:underline touch-manipulation">
            ← Back to Home
          </Link>
        </div>
      </Card>
    </div>
  );
}
