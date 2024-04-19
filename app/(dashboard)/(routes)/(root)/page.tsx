import { CoursesList } from "@/components/CoursesList";
import { getDashboardCourses } from "@/lib/GetDashBoardCourses";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import InfoCard from "./_components/InfoCard";
import { Clock } from "lucide-react";

export default async function Dashboard() {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }
  const { completedCourses, coursesInProgress } = await getDashboardCourses(
    userId
  );
  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          icon={Clock}
          label="In Progress"
          numberOfItems={coursesInProgress.length}
        />
        <InfoCard
          icon={Clock}
          label="Completed"
          numberOfItems={completedCourses.length}
        />
      </div>
      <CoursesList items={[...coursesInProgress, ...completedCourses]} />
    </div>
  );
}
