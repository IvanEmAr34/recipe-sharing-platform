import Link from "next/link";
import { Clock, Star, Users } from "lucide-react";

export interface RecipeCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  prepTime: number;
  cookTime: number;
  servings: number;
  rating: number;
  ratingCount: number;
  author: string;
  imageUrl?: string;
}

const difficultyColor: Record<RecipeCardProps["difficulty"], string> = {
  Easy: "bg-green-100 text-green-700",
  Medium: "bg-amber-100 text-amber-700",
  Hard: "bg-red-100 text-red-700",
};

export default function RecipeCard({
  id,
  title,
  description,
  category,
  difficulty,
  prepTime,
  cookTime,
  servings,
  rating,
  ratingCount,
  author,
  imageUrl,
}: RecipeCardProps) {
  const totalTime = prepTime + cookTime;

  return (
    <Link
      href={`/recipes/${id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Image placeholder */}
      <div className="relative h-48 w-full overflow-hidden bg-stone-100">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100">
            <span className="text-5xl">🍽️</span>
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-medium text-stone-700 backdrop-blur-sm">
          {category}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 font-semibold leading-snug text-stone-900 group-hover:text-orange-500">
            {title}
          </h3>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${difficultyColor[difficulty]}`}
          >
            {difficulty}
          </span>
        </div>
        <p className="line-clamp-2 text-sm text-stone-500">{description}</p>

        <div className="mt-auto flex items-center justify-between pt-3 text-xs text-stone-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {totalTime} min
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {servings}
            </span>
          </div>
          <div className="flex items-center gap-1 font-medium text-amber-500">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-stone-700">{rating.toFixed(1)}</span>
            <span className="text-stone-400">({ratingCount})</span>
          </div>
        </div>

        <p className="text-xs text-stone-400">by {author}</p>
      </div>
    </Link>
  );
}
