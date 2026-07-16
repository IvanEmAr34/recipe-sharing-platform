import Link from "next/link";
import { redirect } from "next/navigation";
import { Clock, ChefHat, UtensilsCrossed } from "lucide-react";
import Navbar from "@/components/navbar";
import { createClient } from "@/lib/supabase/server";


const difficultyStyle = {
  easy: "bg-green-100 text-green-700",
  medium: "bg-amber-100 text-amber-700",
  hard: "bg-red-100 text-red-700",
} as const;

export default async function DashboardPage() {
  const supabase = await createClient();

  // Guard: redirect unauthenticated users to login
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch recipes from other users
  const { data: recipes } = await supabase
    .from("recipes")
    .select("id, title, description, category, difficulty, cooking_time, image_url, tags, created_at, user_id")
    .neq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(24);

  // Fetch author profiles for those recipes
  const authorIds = [...new Set((recipes ?? []).map((r) => r.user_id))];
  const { data: profiles } = authorIds.length
    ? await supabase.from("profiles").select("id, username").in("id", authorIds)
    : { data: [] };

  const usernameMap = Object.fromEntries(
    (profiles ?? []).map((p) => [p.id, p.username])
  );

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-900">Dashboard</h1>
            <p className="mt-1 text-sm text-stone-500">
              Recipes shared by the community
            </p>
          </div>
          <Link
            href="/recipes/new"
            className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
          >
            <ChefHat className="h-4 w-4" />
            Add Recipe
          </Link>
        </div>

        {/* Recipe grid */}
        {!recipes || recipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white py-24 text-center">
            <UtensilsCrossed className="mb-4 h-10 w-10 text-stone-300" />
            <p className="font-semibold text-stone-600">No recipes yet</p>
            <p className="mt-1 text-sm text-stone-400">
              Be the first to share one!
            </p>
            <Link
              href="/recipes/new"
              className="mt-6 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
            >
              Share a Recipe
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recipes.map((recipe) => (
              <Link
                key={recipe.id}
                href={`/recipes/${recipe.id}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Thumbnail */}
                <div className="relative h-44 w-full overflow-hidden bg-stone-100">
                  {recipe.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={recipe.image_url}
                      alt={recipe.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100">
                      <span className="text-5xl">🍽️</span>
                    </div>
                  )}
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-medium text-stone-700 backdrop-blur-sm">
                    {recipe.category}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-2 font-semibold leading-snug text-stone-900 group-hover:text-orange-500">
                      {recipe.title}
                    </h3>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                        difficultyStyle[recipe.difficulty]
                      }`}
                    >
                      {recipe.difficulty.charAt(0).toUpperCase() +
                        recipe.difficulty.slice(1)}
                    </span>
                  </div>

                  {recipe.description && (
                    <p className="line-clamp-2 text-sm text-stone-500">
                      {recipe.description}
                    </p>
                  )}

                  <div className="mt-auto flex items-center justify-between pt-3 text-xs text-stone-400">
                    {recipe.cooking_time ? (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {recipe.cooking_time} min
                      </span>
                    ) : (
                      <span />
                    )}
                    <span>
                      by{" "}
                      <span className="font-medium text-stone-600">
                        {usernameMap[recipe.user_id] ?? "unknown"}
                      </span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
