import Link from "next/link";
import { Clock } from "lucide-react";

const difficultyStyle = {
  easy: "bg-green-100 text-green-700",
  medium: "bg-amber-100 text-amber-700",
  hard: "bg-red-100 text-red-700",
} as const;

interface RecipeGridCardProps {
  id: string;
  title: string;
  description: string | null;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  cooking_time: number | null;
  image_url: string | null;
  isOwner?: boolean;
  authorUsername?: string;
}

export default function RecipeGridCard({
  id,
  title,
  description,
  category,
  difficulty,
  cooking_time,
  image_url,
  isOwner,
  authorUsername,
}: RecipeGridCardProps) {
  return (
    <Link
      href={`/recipes/${id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative h-44 w-full overflow-hidden bg-stone-100">
        {image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image_url}
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

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 font-semibold leading-snug text-stone-900 group-hover:text-orange-500">
            {title}
          </h3>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${difficultyStyle[difficulty]}`}
          >
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </span>
        </div>

        {description && (
          <p className="line-clamp-2 text-sm text-stone-500">{description}</p>
        )}

        <div className="mt-auto flex items-center justify-between pt-3 text-xs text-stone-400">
          {cooking_time ? (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {cooking_time} min
            </span>
          ) : (
            <span />
          )}
          {isOwner ? (
            <span className="rounded-full bg-orange-50 px-2 py-0.5 text-orange-500 font-medium">
              Mine
            </span>
          ) : authorUsername ? (
            <span className="font-medium text-stone-500">by {authorUsername}</span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
