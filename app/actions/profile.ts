"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ProfileState = { error?: string; message?: string } | null;

export async function updateProfile(
  _prevState: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated." };

  const username = (formData.get("username") as string).trim();
  const email = (formData.get("email") as string).trim();
  const full_name = (formData.get("full_name") as string).trim();
  const bio = (formData.get("bio") as string).trim();

  if (!username) return { error: "Username is required." };

  const { error } = await supabase
    .from("profiles")
    .update({
      username,
      email: email || null,
      full_name: full_name || null,
      bio: bio || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    if (error.code === "23505") return { error: "That username is already taken." };
    return { error: error.message };
  }

  revalidatePath("/profile");
  revalidatePath("/", "layout");
  return { message: "Profile updated." };
}
