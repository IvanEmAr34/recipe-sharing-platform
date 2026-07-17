import { NavbarSkeleton, ProfileSkeleton } from "@/components/skeletons";

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-stone-50">
      <NavbarSkeleton />
      <ProfileSkeleton />
    </div>
  );
}
