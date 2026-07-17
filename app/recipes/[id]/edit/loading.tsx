import { NavbarSkeleton, RecipeFormSkeleton } from "@/components/skeletons";

export default function EditRecipeLoading() {
  return (
    <div className="min-h-screen bg-stone-50">
      <NavbarSkeleton />
      <RecipeFormSkeleton />
    </div>
  );
}
