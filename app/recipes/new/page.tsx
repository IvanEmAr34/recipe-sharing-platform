import { redirect } from "next/navigation";
import { ChefHat } from "lucide-react";
import Navbar from "@/components/navbar";
import RecipeForm from "@/components/recipe-form";
import { createClient } from "@/lib/supabase/server";
import { createRecipe } from "@/app/actions/recipes";

export default async function NewRecipePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
            <ChefHat className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-stone-900">New Recipe</h1>
            <p className="text-sm text-stone-500">Share your creation with the community</p>
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <RecipeForm action={createRecipe} submitLabel="Publish Recipe" />
        </div>
      </main>
    </div>
  );
}
