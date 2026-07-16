"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type RecipeState = { error?: string } | null;

export async function createRecipe(
  _prevState: RecipeState,
  formData: FormData
): Promise<RecipeState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated." };

  const { title, description, cooking_time_raw, cooking_time, difficulty, category, image_url, tags, ingredients, instructions } = parseFormData(formData);

  if (!title) return { error: "Title is required." };
  if (!category) return { error: "Category is required." };
  if (ingredients.length === 0) return { error: "Add at least one ingredient." };
  if (instructions.length === 0) return { error: "Add at least one instruction step." };
  if (!["easy", "medium", "hard"].includes(difficulty))
    return { error: "Invalid difficulty." };
  if (cooking_time_raw && (isNaN(cooking_time!) || cooking_time! <= 0))
    return { error: "Cooking time must be a positive number." };

  const { data, error } = await supabase
    .from("recipes")
    .insert({
      user_id: user.id,
      title,
      description: description || null,
      ingredients,
      instructions,
      cooking_time,
      difficulty,
      category,
      image_url: image_url || null,
      tags,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  redirect(`/recipes/${data.id}`);
}

function parseFormData(formData: FormData) {
  const title = ((formData.get("title") as string) ?? "").trim();
  const description = ((formData.get("description") as string) ?? "").trim();
  const cooking_time_raw = ((formData.get("cooking_time") as string) ?? "").trim();
  const difficulty = formData.get("difficulty") as "easy" | "medium" | "hard";
  const category = ((formData.get("category") as string) ?? "").trim();
  const image_url = ((formData.get("image_url") as string) ?? "").trim();
  const tags_raw = ((formData.get("tags") as string) ?? "").trim();

  const ingredients = (formData.getAll("ingredients") as string[])
    .map((s) => s.trim())
    .filter(Boolean);

  const instructions = (formData.getAll("instructions") as string[])
    .map((s) => s.trim())
    .filter(Boolean);

  const cooking_time = cooking_time_raw ? parseInt(cooking_time_raw, 10) : null;

  const tags = tags_raw
    ? tags_raw.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  return { title, description, cooking_time_raw, cooking_time, difficulty, category, image_url, tags, ingredients, instructions };
}

export async function updateRecipe(
  id: string,
  _prevState: RecipeState,
  formData: FormData
): Promise<RecipeState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated." };

  // Verify ownership
  const { data: existing } = await supabase
    .from("recipes")
    .select("user_id")
    .eq("id", id)
    .single();

  if (!existing || existing.user_id !== user.id)
    return { error: "Not authorized." };

  const { title, description, cooking_time_raw, cooking_time, difficulty, category, image_url, tags, ingredients, instructions } = parseFormData(formData);

  if (!title) return { error: "Title is required." };
  if (!category) return { error: "Category is required." };
  if (ingredients.length === 0) return { error: "Add at least one ingredient." };
  if (instructions.length === 0) return { error: "Add at least one instruction step." };
  if (!["easy", "medium", "hard"].includes(difficulty))
    return { error: "Invalid difficulty." };
  if (cooking_time_raw && (isNaN(cooking_time!) || cooking_time! <= 0))
    return { error: "Cooking time must be a positive number." };

  const { error } = await supabase
    .from("recipes")
    .update({ title, description: description || null, ingredients, instructions, cooking_time, difficulty, category, image_url: image_url || null, tags })
    .eq("id", id);

  if (error) return { error: error.message };

  redirect(`/recipes/${id}`);
}

export async function deleteRecipe(id: string): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated.");

  // Verify ownership before deleting
  const { data: existing } = await supabase
    .from("recipes")
    .select("user_id")
    .eq("id", id)
    .single();

  if (!existing || existing.user_id !== user.id)
    throw new Error("Not authorized.");

  await supabase.from("recipes").delete().eq("id", id);

  redirect("/dashboard");
}
