import Link from "next/link";
import { redirect } from "next/navigation";
import { ChefHat, Sparkles } from "lucide-react";
import Navbar from "@/components/navbar";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        <p className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-600">
          <Sparkles className="h-3.5 w-3.5" />
          Community-driven recipes
        </p>

        <h1 className="mb-4 max-w-2xl text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
          Discover &amp; share recipes you&apos;ll{" "}
          <span className="text-orange-500">love to cook</span>
        </h1>

        <p className="mb-10 max-w-xl text-lg text-stone-500">
          Join thousands of home cooks. Upload your own recipes, save
          favourites, and connect with other food lovers.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
          >
            <ChefHat className="h-4 w-4" />
            Start Creating
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-stone-200 bg-white px-7 py-3 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-100"
          >
            Sign in
          </Link>
        </div>
      </main>
    </div>
  );
}
