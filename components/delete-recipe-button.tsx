"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteRecipe } from "@/app/actions/recipes";

export default function DeleteRecipeButton({ recipeId }: { recipeId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Are you sure you want to delete this recipe? This action cannot be undone.")) return;
    startTransition(async () => {
      await deleteRecipe(recipeId);
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="inline-flex items-center gap-2 rounded-full border border-red-200 px-5 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
    >
      <Trash2 className="h-4 w-4" />
      {isPending ? "Deleting…" : "Delete recipe"}
    </button>
  );
}
