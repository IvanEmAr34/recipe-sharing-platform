/** Reusable skeleton primitives for loading states. */

/** A generic pulsing block */
function Bone({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-lg bg-stone-200 ${className}`} />;
}

/** Mimics the sticky Navbar */
export function NavbarSkeleton() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Bone className="h-7 w-32" />
        <div className="flex items-center gap-3">
          <Bone className="h-8 w-24 rounded-full" />
          <Bone className="h-8 w-20 rounded-full" />
        </div>
      </div>
    </header>
  );
}

/** Single recipe grid card skeleton */
export function RecipeCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      <Bone className="h-44 w-full rounded-none" />
      <div className="flex flex-col gap-3 p-4">
        <Bone className="h-4 w-3/4" />
        <Bone className="h-3 w-full" />
        <Bone className="h-3 w-2/3" />
        <div className="mt-2 flex items-center justify-between">
          <Bone className="h-3 w-16" />
          <Bone className="h-3 w-12" />
        </div>
      </div>
    </div>
  );
}

/** Dashboard — two-section grid skeleton */
export function DashboardSkeleton() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header row */}
      <div className="mb-8 flex items-center justify-between">
        <div className="space-y-2">
          <Bone className="h-7 w-36" />
          <Bone className="h-4 w-52" />
        </div>
        <div className="flex gap-3">
          <Bone className="h-10 w-48 rounded-full" />
          <Bone className="h-10 w-32 rounded-full" />
        </div>
      </div>

      {/* My Recipes section */}
      <div className="mb-12">
        <Bone className="mb-4 h-5 w-28" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <RecipeCardSkeleton key={i} />)}
        </div>
      </div>

      {/* Community section */}
      <div>
        <Bone className="mb-4 h-5 w-40" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <RecipeCardSkeleton key={i} />)}
        </div>
      </div>
    </main>
  );
}

/** Recipe detail page skeleton */
export function RecipeDetailSkeleton() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Bone className="mb-6 h-4 w-32" />

      {/* Hero */}
      <Bone className="mb-6 h-64 w-full rounded-2xl sm:h-80" />

      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm space-y-8">
        {/* Tags + title */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <Bone className="h-5 w-20 rounded-full" />
            <Bone className="h-5 w-16 rounded-full" />
          </div>
          <Bone className="h-8 w-3/4" />
          <Bone className="h-4 w-full" />
          <Bone className="h-4 w-5/6" />
          <div className="flex gap-5 pt-1">
            <Bone className="h-4 w-16" />
            <Bone className="h-4 w-16" />
            <Bone className="h-4 w-24" />
          </div>
        </div>

        {/* Ingredients */}
        <div className="space-y-2">
          <Bone className="h-5 w-28 mb-3" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <Bone className="h-2 w-2 rounded-full shrink-0" />
              <Bone className={`h-3 ${i % 2 === 0 ? "w-3/4" : "w-1/2"}`} />
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="space-y-4">
          <Bone className="h-5 w-28 mb-3" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <Bone className="h-7 w-7 rounded-full shrink-0" />
              <div className="flex-1 space-y-2 pt-1">
                <Bone className="h-3 w-full" />
                <Bone className="h-3 w-4/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

/** Profile page skeleton */
export function ProfileSkeleton() {
  return (
    <main className="mx-auto max-w-lg px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <Bone className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Bone className="h-6 w-32" />
          <Bone className="h-4 w-48" />
        </div>
      </div>

      {/* Form card */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <Bone className="h-3.5 w-20" />
            <Bone className="h-10 w-full" />
          </div>
        ))}
        <Bone className="mt-2 h-10 w-full rounded-full" />
      </div>
    </main>
  );
}

/** New / Edit recipe form skeleton */
export function RecipeFormSkeleton() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <Bone className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Bone className="h-6 w-36" />
          <Bone className="h-4 w-52" />
        </div>
      </div>

      {/* Form card */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm space-y-6">
        {/* Title */}
        <div className="space-y-1.5">
          <Bone className="h-3.5 w-12" />
          <Bone className="h-10 w-full" />
        </div>
        {/* Description */}
        <div className="space-y-1.5">
          <Bone className="h-3.5 w-24" />
          <Bone className="h-20 w-full" />
        </div>
        {/* Category + Difficulty */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Bone className="h-3.5 w-20" />
            <Bone className="h-10 w-full" />
          </div>
          <div className="space-y-1.5">
            <Bone className="h-3.5 w-20" />
            <Bone className="h-10 w-full" />
          </div>
        </div>
        {/* Ingredients */}
        <div className="space-y-2">
          <Bone className="h-3.5 w-24" />
          {Array.from({ length: 3 }).map((_, i) => <Bone key={i} className="h-10 w-full" />)}
        </div>
        {/* Instructions */}
        <div className="space-y-2">
          <Bone className="h-3.5 w-24" />
          {Array.from({ length: 3 }).map((_, i) => <Bone key={i} className="h-16 w-full" />)}
        </div>
        <Bone className="h-10 w-full rounded-full" />
      </div>
    </main>
  );
}
