import Link from "next/link";
import { Search, TrendingUp, Sparkles, ArrowRight } from "lucide-react";
import Navbar from "@/components/navbar";
import RecipeCard, { RecipeCardProps } from "@/components/recipe-card";

// ─── Mock data ────────────────────────────────────────────────────────────────

const categories = [
  { name: "Breakfast", emoji: "🥞", slug: "breakfast" },
  { name: "Lunch", emoji: "🥗", slug: "lunch" },
  { name: "Dinner", emoji: "🍝", slug: "dinner" },
  { name: "Desserts", emoji: "🍰", slug: "desserts" },
  { name: "Snacks", emoji: "🥨", slug: "snacks" },
  { name: "Drinks", emoji: "🍹", slug: "drinks" },
  { name: "Vegan", emoji: "🥦", slug: "vegan" },
  { name: "Soups", emoji: "🍲", slug: "soups" },
];

const latestRecipes: RecipeCardProps[] = [
  {
    id: "1",
    title: "Creamy Tuscan Chicken Pasta",
    description:
      "A rich and creamy pasta dish with sun-dried tomatoes, spinach, and tender chicken in a garlic cream sauce.",
    category: "Dinner",
    difficulty: "Medium",
    prepTime: 15,
    cookTime: 25,
    servings: 4,
    rating: 4.8,
    ratingCount: 124,
    author: "Maria G.",
  },
  {
    id: "2",
    title: "Fluffy Japanese Pancakes",
    description:
      "Ultra-thick and fluffy souffle-style pancakes that are light as clouds and perfect for a weekend brunch.",
    category: "Breakfast",
    difficulty: "Medium",
    prepTime: 20,
    cookTime: 15,
    servings: 2,
    rating: 4.9,
    ratingCount: 87,
    author: "James K.",
  },
  {
    id: "3",
    title: "Homemade Hummus",
    description:
      "Smooth and velvety homemade hummus with tahini, roasted garlic, and a drizzle of good olive oil.",
    category: "Snacks",
    difficulty: "Easy",
    prepTime: 10,
    cookTime: 0,
    servings: 6,
    rating: 4.7,
    ratingCount: 210,
    author: "Leila R.",
  },
  {
    id: "4",
    title: "Mango Coconut Chia Pudding",
    description:
      "A refreshing no-cook dessert layered with creamy coconut chia pudding and fresh mango.",
    category: "Desserts",
    difficulty: "Easy",
    prepTime: 10,
    cookTime: 0,
    servings: 3,
    rating: 4.6,
    ratingCount: 65,
    author: "Priya S.",
  },
];

const popularRecipes: RecipeCardProps[] = [
  {
    id: "5",
    title: "Classic Beef Tacos",
    description:
      "Seasoned ground beef in crispy shells topped with fresh pico de gallo, cheese, and sour cream.",
    category: "Dinner",
    difficulty: "Easy",
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    rating: 4.9,
    ratingCount: 512,
    author: "Carlos M.",
  },
  {
    id: "6",
    title: "Avocado Toast with Poached Egg",
    description:
      "Creamy smashed avocado on sourdough toast topped with a perfectly poached egg and chilli flakes.",
    category: "Breakfast",
    difficulty: "Easy",
    prepTime: 5,
    cookTime: 10,
    servings: 1,
    rating: 4.8,
    ratingCount: 389,
    author: "Sophie L.",
  },
  {
    id: "7",
    title: "Thai Green Curry",
    description:
      "Aromatic green curry with coconut milk, vegetables, and jasmine rice. Ready in under 30 minutes.",
    category: "Dinner",
    difficulty: "Medium",
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    rating: 4.7,
    ratingCount: 301,
    author: "Nong P.",
  },
  {
    id: "8",
    title: "Chocolate Lava Cake",
    description:
      "Individual molten chocolate cakes with a gooey liquid center. An impressive dessert in just 20 minutes.",
    category: "Desserts",
    difficulty: "Medium",
    prepTime: 10,
    cookTime: 12,
    servings: 4,
    rating: 4.9,
    ratingCount: 447,
    author: "Emma B.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <main>
        {/* ── Hero ──────────────────────────────────────────────────── */}
        <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-600">
              <Sparkles className="h-3.5 w-3.5" />
              Community-driven recipes
            </p>
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
              Discover recipes you&apos;ll{" "}
              <span className="text-orange-500">love to cook</span>
            </h1>
            <p className="mb-8 text-lg text-stone-500">
              Browse thousands of recipes shared by home cooks and food
              enthusiasts. Save favorites, rate dishes, and share your own
              creations.
            </p>

            {/* Search bar */}
            <form className="mx-auto flex max-w-xl items-center gap-2 rounded-full border border-stone-200 bg-stone-50 p-1.5 shadow-sm">
              <Search className="ml-3 h-5 w-5 shrink-0 text-stone-400" />
              <input
                type="search"
                placeholder="Search recipes, ingredients, or tags…"
                className="flex-1 bg-transparent py-1 text-sm text-stone-700 placeholder-stone-400 outline-none"
              />
              <button
                type="submit"
                className="rounded-full bg-orange-500 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600"
              >
                Search
              </button>
            </form>

            {/* Quick tags */}
            <div className="mt-5 flex flex-wrap justify-center gap-2 text-sm">
              {["Pasta", "Chicken", "Vegetarian", "Quick & Easy", "Desserts"].map(
                (tag) => (
                  <Link
                    key={tag}
                    href={`/recipes?q=${encodeURIComponent(tag)}`}
                    className="rounded-full border border-stone-200 bg-white px-3 py-1 text-stone-500 transition-colors hover:border-orange-300 hover:text-orange-500"
                  >
                    {tag}
                  </Link>
                ),
              )}
            </div>
          </div>
        </section>

        {/* ── Categories ────────────────────────────────────────────── */}
        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-6 text-xl font-bold text-stone-900">
              Browse by Category
            </h2>
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
              {categories.map(({ name, emoji, slug }) => (
                <Link
                  key={slug}
                  href={`/recipes?category=${slug}`}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-stone-200 bg-white py-4 text-center shadow-sm transition-all hover:border-orange-300 hover:shadow-md"
                >
                  <span className="text-2xl">{emoji}</span>
                  <span className="text-xs font-medium text-stone-700">
                    {name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Latest Recipes ────────────────────────────────────────── */}
        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xl font-bold text-stone-900">
                <Sparkles className="h-5 w-5 text-orange-400" />
                Latest Recipes
              </h2>
              <Link
                href="/recipes?sort=latest"
                className="flex items-center gap-1 text-sm font-medium text-orange-500 hover:text-orange-600"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {latestRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} {...recipe} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Popular Recipes ───────────────────────────────────────── */}
        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xl font-bold text-stone-900">
                <TrendingUp className="h-5 w-5 text-orange-400" />
                Popular Recipes
              </h2>
              <Link
                href="/recipes?sort=popular"
                className="flex items-center gap-1 text-sm font-medium text-orange-500 hover:text-orange-600"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {popularRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} {...recipe} />
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Banner ────────────────────────────────────────────── */}
        <section className="mx-4 mb-16 overflow-hidden rounded-3xl bg-orange-500 px-8 py-14 text-center sm:mx-6 lg:mx-8">
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-3 text-3xl font-bold text-white">
              Share your recipes with the world
            </h2>
            <p className="mb-8 text-orange-100">
              Join thousands of home cooks. Create an account to upload your own
              recipes, save favorites, and connect with other food lovers.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/signup"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-orange-500 transition-colors hover:bg-orange-50"
              >
                Create Free Account
              </Link>
              <Link
                href="/recipes"
                className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Browse Recipes
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer className="border-t border-stone-200 bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-stone-400 sm:flex-row">
          <p className="font-semibold text-stone-700">RecipeHub</p>
          <p>© {new Date().getFullYear()} RecipeHub. All rights reserved.</p>
          <nav className="flex gap-5">
            <Link href="/about" className="hover:text-stone-700">
              About
            </Link>
            <Link href="/privacy" className="hover:text-stone-700">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-stone-700">
              Terms
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
