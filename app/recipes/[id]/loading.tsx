import { NavbarSkeleton, RecipeDetailSkeleton } from "@/components/skeletons";

export default function RecipeDetailLoading() {
  return (
    <div className="min-h-screen bg-stone-50">
      <NavbarSkeleton />
      <RecipeDetailSkeleton />
    </div>
  );
}
