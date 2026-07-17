import { NavbarSkeleton, DashboardSkeleton } from "@/components/skeletons";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-stone-50">
      <NavbarSkeleton />
      <DashboardSkeleton />
    </div>
  );
}
