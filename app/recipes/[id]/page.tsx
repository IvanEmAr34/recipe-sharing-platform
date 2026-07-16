import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock, ChefHat, ArrowLeft, User } from "lucide-react";
import Navbar from "@/components/navbar";
import DeleteRecipeButton from "@/components/delete-recipe-button";
import { createClient } from "@/lib/supabase/server";

const difficultyStyle = {
  easy: "bg-green-100 text-green-700",
  medium: "bg-amber-100 text-amber-700",
  hard: "bg-red-100 text-red-700",
} as const;

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: recipe } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", id)
    .single();

  if (!recipe) notFound();

  const { data: author } = await supabase
    .from("profiles")
    .select("username, full_name, email")
    .eq("id", recipe.user_id)
    .single();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isOwner = user?.id === recipe.user_id;

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        {/* Back */}
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-stone-500 transition-colors hover:text-stone-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        {/* Hero image */}
        <div className="relative mb-6 h-64 w-full overflow-hidden rounded-2xl bg-stone-100 sm:h-80">
          {recipe.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={recipe.image_url}
              alt={recipe.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100">
              <span className="text-7xl">🍽️</span>
            </div>
          )}
          <span
            className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${difficultyStyle[recipe.difficulty]}`}
          >
            {recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}
          </span>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm space-y-8">
          {/* Header */}
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">
                {recipe.category}
              </span>
              {recipe.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-600"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl font-bold text-stone-900">{recipe.title}</h1>

            {recipe.description && (
              <p className="mt-3 text-stone-600">{recipe.description}</p>
            )}

            {/* Meta row */}
            <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-stone-500">
              {recipe.cooking_time && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {recipe.cooking_time} min
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <ChefHat className="h-4 w-4" />
                {recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}
              </span>
              {!isOwner && (
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  {author?.full_name
                    ? `${author.full_name} (@${author.username})`
                    : author?.username ?? "Unknown chef"}
                </span>
              )}
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <h2 className="mb-3 text-lg font-semibold text-stone-900">
              Ingredients
            </h2>
            <ul className="space-y-2">
              {recipe.ingredients.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-stone-700">
                  <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-orange-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div>
            <h2 className="mb-3 text-lg font-semibold text-stone-900">
              Instructions
            </h2>
            <ol className="space-y-4">
              {recipe.instructions.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <p className="pt-0.5 text-sm text-stone-700 leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Owner actions */}
          {isOwner && (
            <div className="flex gap-3 border-t border-stone-100 pt-6">
              <Link
                href={`/recipes/${recipe.id}/edit`}
                className="rounded-full border border-stone-200 px-5 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-100"
              >
                Edit recipe
              </Link>
              <DeleteRecipeButton recipeId={recipe.id} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
