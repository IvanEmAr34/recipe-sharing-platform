import Link from "next/link";
import { ChefHat } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <ChefHat className="h-8 w-8 text-orange-500" />
        <span className="text-2xl font-bold text-stone-900">RecipeHub</span>
      </Link>
      {children}
    </div>
  );
}
