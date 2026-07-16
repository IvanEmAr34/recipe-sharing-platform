import Link from "next/link";
import { ChefHat, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/actions/auth";

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single()
    : { data: null };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <ChefHat className="h-7 w-7 text-orange-500" />
          <span className="text-xl font-bold text-stone-900">RecipeHub</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/recipes"
            className="text-sm font-medium text-stone-600 transition-colors hover:text-orange-500"
          >
            Recipes
          </Link>
          <Link
            href="/recipes?sort=popular"
            className="text-sm font-medium text-stone-600 transition-colors hover:text-orange-500"
          >
            Popular
          </Link>
          <Link
            href="/categories"
            className="text-sm font-medium text-stone-600 transition-colors hover:text-orange-500"
          >
            Categories
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            aria-label="Search"
            className="rounded-full p-2 text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900"
          >
            <Search className="h-5 w-5" />
          </button>
          {user ? (
            <>
              <Link
                href="/profile"
                className="hidden text-sm font-medium text-stone-600 transition-colors hover:text-stone-900 sm:inline-flex"
              >
                {profile?.username ?? user.email}
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="rounded-full border border-stone-200 px-4 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden text-sm font-medium text-stone-600 transition-colors hover:text-stone-900 sm:inline-flex"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
