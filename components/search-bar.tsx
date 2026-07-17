"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";

const CATEGORIES = [
  "Breakfast", "Lunch", "Dinner", "Dessert", "Snack",
  "Appetizer", "Soup", "Salad", "Drink", "Other",
];

const DIFFICULTIES = [
  { value: "easy",   label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard",   label: "Hard" },
];

const selectClass =
  "rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [text, setText] = useState(searchParams.get("q") ?? "");
  const [showFilters, setShowFilters] = useState(() =>
    ["category", "difficulty", "time_min", "time_max"].some((k) => searchParams.has(k))
  );
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep text in sync with URL (back/forward nav)
  useEffect(() => {
    setText(searchParams.get("q") ?? "");
  }, [searchParams]);

  /** Build a new URL preserving all current params and changing one key. */
  function pushParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/dashboard?${params.toString()}`);
  }

  function handleTextSubmit(e: React.FormEvent) {
    e.preventDefault();
    pushParam("q", text.trim());
  }

  function handleClearAll() {
    setText("");
    router.push("/dashboard");
  }

  const hasFilters =
    searchParams.get("category") ||
    searchParams.get("difficulty") ||
    searchParams.get("time_min") ||
    searchParams.get("time_max");

  const hasAny = text || hasFilters;

  return (
    <div className="flex w-full flex-col gap-2">
      {/* ── Search row ── */}
      <div className="flex items-center gap-2">
        <form onSubmit={handleTextSubmit} className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Search recipes…"
            className="w-full rounded-full border border-stone-200 bg-white py-2.5 pl-10 pr-10 text-sm text-stone-900 placeholder-stone-400 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          />
          {text && (
            <button
              type="button"
              onClick={() => { setText(""); pushParam("q", ""); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-stone-400 transition hover:text-stone-700"
              aria-label="Clear text"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>

        {/* Toggle filters button */}
        <button
          type="button"
          onClick={() => setShowFilters((v) => !v)}
          className={`shrink-0 flex items-center gap-1.5 rounded-full border px-3.5 py-2.5 text-sm font-medium transition ${
            hasFilters
              ? "border-orange-400 bg-orange-50 text-orange-600"
              : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Filters</span>
          {hasFilters && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
              {[
                searchParams.get("category"),
                searchParams.get("difficulty"),
                searchParams.get("time_min") || searchParams.get("time_max"),
              ].filter(Boolean).length}
            </span>
          )}
        </button>

        {hasAny && (
          <button
            type="button"
            onClick={handleClearAll}
            className="shrink-0 rounded-full border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-500 transition hover:bg-stone-100"
          >
            Clear
          </button>
        )}
      </div>

      {/* ── Filter row ── */}
      {showFilters && (
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-stone-200 bg-white p-3">
          {/* Category */}
          <select
            value={searchParams.get("category") ?? ""}
            onChange={(e) => pushParam("category", e.target.value)}
            className={selectClass}
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Difficulty */}
          <div className="flex items-center gap-1 rounded-lg border border-stone-200 bg-stone-50 p-1">
            {DIFFICULTIES.map(({ value, label }) => {
              const active = searchParams.get("difficulty") === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => pushParam("difficulty", active ? "" : value)}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                    active
                      ? "bg-white text-stone-900 shadow-sm"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Cooking time range */}
          <div className="flex items-center gap-1.5 text-sm text-stone-500">
            <span className="text-xs font-medium">Time (min):</span>
            <input
              type="number"
              min={1}
              defaultValue={searchParams.get("time_min") ?? ""}
              placeholder="Min"
              onBlur={(e) => pushParam("time_min", e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  pushParam("time_min", (e.target as HTMLInputElement).value);
                }
              }}
              className="w-16 rounded-lg border border-stone-200 bg-stone-50 px-2 py-1.5 text-xs text-stone-900 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100"
            />
            <span className="text-xs font-medium">Time (max):</span>
            <input
              type="number"
              min={1}
              defaultValue={searchParams.get("time_max") ?? ""}
              placeholder="Max"
              onBlur={(e) => pushParam("time_max", e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  pushParam("time_max", (e.target as HTMLInputElement).value);
                }
              }}
              className="w-16 rounded-lg border border-stone-200 bg-stone-50 px-2 py-1.5 text-xs text-stone-900 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100"
            />
          </div>
        </div>
      )}
    </div>
  );
}
