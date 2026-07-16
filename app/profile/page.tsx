import { redirect } from "next/navigation";
import { User } from "lucide-react";
import Navbar from "@/components/navbar";
import ProfileForm from "@/components/profile-form";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/supabase/types";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Upsert so existing users without a profile row still get one.
  await supabase.from("profiles").upsert(
    {
      id: user.id,
      username: user.email!.split("@")[0],
    },
    { onConflict: "id", ignoreDuplicates: true }
  );

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login");

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
            <User className="h-6 w-6 text-orange-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-stone-900">Your Profile</h1>
            <p className="text-sm text-stone-500">{user.email}</p>
          </div>
        </div>

        {/* Edit form */}
        <div className="rounded-2xl border border-stone-200 bg-white px-8 py-8 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold text-stone-900">
            Edit profile
          </h2>
          <ProfileForm profile={profile as Profile} />
        </div>

        {/* Account info */}
        <div className="mt-6 rounded-2xl border border-stone-200 bg-white px-8 py-6 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold text-stone-900">
            Account info
          </h2>
          <p className="text-sm text-stone-500">
            Member since{" "}
            {new Date(profile.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </main>
    </div>
  );
}
