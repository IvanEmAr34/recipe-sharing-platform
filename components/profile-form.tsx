"use client";

import { useActionState } from "react";
import { updateProfile, type ProfileState } from "@/app/actions/profile";
import type { Profile } from "@/lib/supabase/types";

export default function ProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction, isPending] = useActionState<ProfileState, FormData>(
    updateProfile,
    null
  );

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}
      {state?.message && (
        <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          {state.message}
        </div>
      )}

      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-stone-700 mb-1.5"
        >
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          defaultValue={profile.username}
          required
          className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          placeholder="chef_mario"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-stone-700 mb-1.5"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={profile.email ?? ""}
          className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="full_name"
          className="block text-sm font-medium text-stone-700 mb-1.5"
        >
          Full name
        </label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          defaultValue={profile.full_name ?? ""}
          className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          placeholder="Your full name"
        />
      </div>

      <div>
        <label
          htmlFor="bio"
          className="block text-sm font-medium text-stone-700 mb-1.5"
        >
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={3}
          defaultValue={profile.bio ?? ""}
          className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100 resize-none"
          placeholder="Tell us a little about yourself…"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-orange-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
      >
        {isPending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
