import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ChefHat } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import RecipeForm from "@/components/recipe-form";
import { createClient } from "@/lib/supabase/server";
import { updateRecipe } from "@/app/actions/recipes";

export default async function EditRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: recipe } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", id)
    .single();

  if (!recipe) notFound();
  if (recipe.user_id !== user.id) redirect(`/recipes/${id}`);

  const boundUpdateRecipe = updateRecipe.bind(null, id);

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <Link
          href={`/recipes/${id}`}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-stone-500 transition-colors hover:text-stone-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to recipe
        </Link>

        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
            <ChefHat className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-stone-900">Edit Recipe</h1>
            <p className="text-sm text-stone-500">Update your recipe details</p>
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <RecipeForm
            action={boundUpdateRecipe}
            initialData={recipe}
            submitLabel="Save changes"
          />
        </div>
      </main>
    </div>
  );
}
