"use client";

import { cn } from "@/lib/utils";
import { PlayCircle,Lock } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

interface Props {
  label: string;
  id: string;
  courseId: string;
  isLocked: boolean;
}
const CourseSidebarItem = ({ label, id, courseId,isLocked }: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  const Icon = isLocked ? Lock :  PlayCircle;


  const isActive = pathname.includes(id);

  const onClick = () => {
    router.push(`/courses/${courseId}/chapters/${id}`);
  };
  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20 w-full",
        isActive && "text-slate-700 bg-slate-200/20 hover:text-slate-700"
      )}
    >
      <div className="flex items-center gap-x-2 py-2">
      <Icon
          size={22}
          className={cn(
            "text-slate-500",
            isActive && "text-slate-700",
          )}
        />
        {label}
      </div>
      <div
        className={cn(
          "ml-auto opacity-0 border-2 border-slate-700 h-full transition-all",
          isActive && "opacity-100"
        )}
      />
    </button>
  );
};

export default CourseSidebarItem;
