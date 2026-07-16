"use client";

import { useActionState, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { RecipeState } from "@/app/actions/recipes";

const CATEGORIES = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Dessert",
  "Snack",
  "Appetizer",
  "Soup",
  "Salad",
  "Drink",
  "Other",
];

const inputClass =
  "w-full rounded-lg border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100";

const labelClass = "block text-sm font-medium text-stone-700 mb-1.5";

interface RecipeFormProps {
  action: (prevState: RecipeState, formData: FormData) => Promise<RecipeState>;
  initialData?: {
    title?: string;
    description?: string | null;
    category?: string;
    difficulty?: "easy" | "medium" | "hard";
    cooking_time?: number | null;
    image_url?: string | null;
    ingredients?: string[];
    instructions?: string[];
    tags?: string[];
  };
  submitLabel?: string;
}

export default function RecipeForm({ action, initialData, submitLabel = "Publish Recipe" }: RecipeFormProps) {
  const [state, formAction, isPending] = useActionState<RecipeState, FormData>(
    action,
    null
  );

  const [ingredients, setIngredients] = useState<string[]>(
    initialData?.ingredients?.length ? initialData.ingredients : [""]
  );
  const [instructions, setInstructions] = useState<string[]>(
    initialData?.instructions?.length ? initialData.instructions : [""]
  );

  function updateIngredient(index: number, value: string) {
    setIngredients((prev) => prev.map((v, i) => (i === index ? value : v)));
  }

  function addIngredient() {
    setIngredients((prev) => [...prev, ""]);
  }

  function removeIngredient(index: number) {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  }

  function updateInstruction(index: number, value: string) {
    setInstructions((prev) => prev.map((v, i) => (i === index ? value : v)));
  }

  function addInstruction() {
    setInstructions((prev) => [...prev, ""]);
  }

  function removeInstruction(index: number) {
    setInstructions((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className={labelClass}>
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={initialData?.title ?? ""}
          className={inputClass}
          placeholder="e.g. Classic Spaghetti Carbonara"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className={labelClass}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={initialData?.description ?? ""}
          className={`${inputClass} resize-none`}
          placeholder="A short summary of your recipe…"
        />
      </div>

      {/* Category + Difficulty */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className={labelClass}>
            Category <span className="text-red-500">*</span>
          </label>
          <select id="category" name="category" required defaultValue={initialData?.category ?? ""} className={inputClass}>
            <option value="">Select…</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="difficulty" className={labelClass}>
            Difficulty <span className="text-red-500">*</span>
          </label>
          <select
            id="difficulty"
            name="difficulty"
            defaultValue={initialData?.difficulty ?? "easy"}
            required
            className={inputClass}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Cooking time + Image URL */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="cooking_time" className={labelClass}>
            Cooking time (minutes)
          </label>
          <input
            id="cooking_time"
            name="cooking_time"
            type="number"
            min={1}
            defaultValue={initialData?.cooking_time ?? ""}
            className={inputClass}
            placeholder="e.g. 30"
          />
        </div>

        <div>
          <label htmlFor="image_url" className={labelClass}>
            Image URL
          </label>
          <input
            id="image_url"
            name="image_url"
            type="url"
            defaultValue={initialData?.image_url ?? ""}
            className={inputClass}
            placeholder="https://…"
          />
        </div>
      </div>

      {/* Ingredients */}
      <div>
        <p className={labelClass}>
          Ingredients <span className="text-red-500">*</span>
        </p>
        <div className="space-y-2">
          {ingredients.map((value, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                name="ingredients"
                type="text"
                value={value}
                onChange={(e) => updateIngredient(i, e.target.value)}
                className={inputClass}
                placeholder={`Ingredient ${i + 1}`}
              />
              {ingredients.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeIngredient(i)}
                  className="shrink-0 rounded-lg p-2 text-stone-400 transition hover:bg-red-50 hover:text-red-500"
                  aria-label="Remove ingredient"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addIngredient}
          className="mt-2 flex items-center gap-1.5 text-sm font-medium text-orange-500 transition hover:text-orange-600"
        >
          <Plus className="h-4 w-4" />
          Add ingredient
        </button>
      </div>

      {/* Instructions */}
      <div>
        <p className={labelClass}>
          Instructions <span className="text-red-500">*</span>
        </p>
        <div className="space-y-2">
          {instructions.map((value, i) => (
            <div key={i} className="flex gap-2">
              <span className="mt-2.5 shrink-0 text-xs font-bold text-stone-400 w-5 text-right">
                {i + 1}.
              </span>
              <textarea
                name="instructions"
                rows={2}
                value={value}
                onChange={(e) => updateInstruction(i, e.target.value)}
                className={`${inputClass} resize-none flex-1`}
                placeholder={`Step ${i + 1}`}
              />
              {instructions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeInstruction(i)}
                  className="shrink-0 rounded-lg p-2 text-stone-400 transition hover:bg-red-50 hover:text-red-500 self-start mt-1"
                  aria-label="Remove step"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addInstruction}
          className="mt-2 flex items-center gap-1.5 text-sm font-medium text-orange-500 transition hover:text-orange-600"
        >
          <Plus className="h-4 w-4" />
          Add step
        </button>
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="tags" className={labelClass}>
          Tags{" "}
          <span className="text-xs text-stone-400 font-normal">
            (comma-separated)
          </span>
        </label>
        <input
          id="tags"
          name="tags"
          type="text"
          defaultValue={initialData?.tags?.join(", ") ?? ""}
          className={inputClass}
          placeholder="e.g. Italian, pasta, quick"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-orange-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
      >
        {isPending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
