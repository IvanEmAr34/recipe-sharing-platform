import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ChefHat, UtensilsCrossed, Search } from "lucide-react";
import Navbar from "@/components/navbar";
import SearchBar from "@/components/search-bar";
import RecipeGridCard from "@/components/recipe-grid-card";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; difficulty?: string; time_min?: string; time_max?: string }>;
}) {
  const { q, category, difficulty, time_min, time_max } = await searchParams;
  const query = q?.trim() ?? "";
  const isFiltered = query || category || difficulty || time_min || time_max;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const cols = "id, title, description, category, difficulty, cooking_time, image_url, tags, created_at, user_id";

  /* ── Filtered / Search mode ──────────────────────────────── */
  let searchResults: Record<string, unknown>[] | null = null;
  let searchAuthorMap: Record<string, string> = {};

  if (isFiltered) {
    let dbQuery = supabase.from("recipes").select(cols);

    if (query) {
      dbQuery = dbQuery.or(
        `title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`
      );
    }
    if (category) {
      dbQuery = dbQuery.eq("category", category);
    }
    if (difficulty) {
      dbQuery = dbQuery.eq("difficulty", difficulty as "easy" | "medium" | "hard");
    }
    if (time_min) {
      dbQuery = dbQuery.gte("cooking_time", parseInt(time_min, 10));
    }
    if (time_max) {
      dbQuery = dbQuery.lte("cooking_time", parseInt(time_max, 10));
    }

    const { data } = await dbQuery
      .order("created_at", { ascending: false })
      .limit(48);

    searchResults = data;

    const authorIds = [...new Set((data ?? []).map((r) => r.user_id as string))];
    if (authorIds.length) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username")
        .in("id", authorIds);
      searchAuthorMap = Object.fromEntries((profiles ?? []).map((p) => [p.id, p.username]));
    }
  }

  /* ── Normal mode ─────────────────────────────────────────── */
  const { data: myRecipes } = isFiltered
    ? { data: null }
    : await supabase
        .from("recipes")
        .select(cols)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

  const { data: communityRecipes } = isFiltered
    ? { data: null }
    : await supabase
        .from("recipes")
        .select(cols)
        .neq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(24);

  const communityAuthorIds = [...new Set((communityRecipes ?? []).map((r) => r.user_id as string))];
  const { data: communityProfiles } = communityAuthorIds.length
    ? await supabase.from("profiles").select("id, username").in("id", communityAuthorIds)
    : { data: [] };
  const communityAuthorMap = Object.fromEntries(
    (communityProfiles ?? []).map((p) => [p.id, p.username])
  );

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-900">Dashboard</h1>
            <p className="mt-1 text-sm text-stone-500">Recipes shared by the community</p>
          </div>
          <div className="flex items-center gap-3">
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[380px]">
            <Suspense fallback={
              <div className="w-full rounded-full border border-stone-200 bg-white py-2.5 pl-10 pr-4 text-sm text-stone-400">
                Search recipes…
              </div>
            }>
              <SearchBar />
            </Suspense>
          </div>
            <Link
              href="/recipes/new"
              className="shrink-0 inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
            >
              <ChefHat className="h-4 w-4" />
              <span className="hidden sm:inline">Add Recipe</span>
            </Link>
          </div>
        </div>

        {/* ── Search results ─────────────────────────────────── */}
        {isFiltered ? (
          <section>
            <div className="mb-4 flex flex-wrap items-center gap-2 text-stone-600">
              <Search className="h-4 w-4 text-stone-400" />
              {query && (
                <span className="text-sm">
                  Results for{" "}
                  <span className="font-semibold text-stone-900">&ldquo;{query}&rdquo;</span>
                </span>
              )}
              {category && (
                <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-600">{category}</span>
              )}
              {difficulty && (
                <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-600 capitalize">{difficulty}</span>
              )}
              {(time_min || time_max) && (
                <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-600">
                  {time_min ?? "0"}–{time_max ?? "∞"} min
                </span>
              )}
              {searchResults && (
                <span className="text-sm text-stone-400">({searchResults.length} result{searchResults.length !== 1 ? "s" : ""})</span>
              )}
            </div>

            {!searchResults || searchResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white py-16 text-center">
                <Search className="mb-3 h-8 w-8 text-stone-300" />
                <p className="font-semibold text-stone-600">No recipes found</p>
                <p className="mt-1 text-sm text-stone-400">Try a different keyword</p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {searchResults.map((recipe) => (
                  <RecipeGridCard
                    key={recipe.id as string}
                    id={recipe.id as string}
                    title={recipe.title as string}
                    description={recipe.description as string | null}
                    category={recipe.category as string}
                    difficulty={recipe.difficulty as "easy" | "medium" | "hard"}
                    cooking_time={recipe.cooking_time as number | null}
                    image_url={recipe.image_url as string | null}
                    isOwner={recipe.user_id === user.id}
                    authorUsername={
                      recipe.user_id !== user.id
                        ? (searchAuthorMap[recipe.user_id as string] ?? "unknown")
                        : undefined
                    }
                  />
                ))}
              </div>
            )}
          </section>
        ) : (
          <>
            {/* ── My Recipes ───────────────────────────────────── */}
            <section className="mb-12">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-stone-900">My Recipes</h2>
                <Link
                  href="/recipes/new"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-orange-500 transition-colors hover:text-orange-600"
                >
                  <ChefHat className="h-4 w-4" />
                  New recipe
                </Link>
              </div>

              {!myRecipes || myRecipes.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white py-12 text-center">
                  <UtensilsCrossed className="mb-3 h-8 w-8 text-stone-300" />
                  <p className="font-semibold text-stone-600">No recipes yet</p>
                  <p className="mt-1 text-sm text-stone-400">Share your first creation!</p>
                  <Link
                    href="/recipes/new"
                    className="mt-4 rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
                  >
                    Add Recipe
                  </Link>
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {myRecipes.map((recipe) => (
                    <RecipeGridCard
                      key={recipe.id as string}
                      id={recipe.id as string}
                      title={recipe.title as string}
                      description={recipe.description as string | null}
                      category={recipe.category as string}
                      difficulty={recipe.difficulty as "easy" | "medium" | "hard"}
                      cooking_time={recipe.cooking_time as number | null}
                      image_url={recipe.image_url as string | null}
                      isOwner
                    />
                  ))}
                </div>
              )}
            </section>

            {/* ── Community Recipes ────────────────────────────── */}
            <section>
              <h2 className="mb-4 text-lg font-semibold text-stone-900">Community Recipes</h2>

              {!communityRecipes || communityRecipes.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white py-16 text-center">
                  <UtensilsCrossed className="mb-3 h-8 w-8 text-stone-300" />
                  <p className="font-semibold text-stone-600">No community recipes yet</p>
                  <p className="mt-1 text-sm text-stone-400">Be the first to share one!</p>
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {communityRecipes.map((recipe) => (
                    <RecipeGridCard
                      key={recipe.id as string}
                      id={recipe.id as string}
                      title={recipe.title as string}
                      description={recipe.description as string | null}
                      category={recipe.category as string}
                      difficulty={recipe.difficulty as "easy" | "medium" | "hard"}
                      cooking_time={recipe.cooking_time as number | null}
                      image_url={recipe.image_url as string | null}
                      authorUsername={communityAuthorMap[recipe.user_id as string] ?? "unknown"}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
