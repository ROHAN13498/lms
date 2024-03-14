"use client";

import AlertPopup from "@/components/modals/AlertPopup";
import { Chapter } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface ChapterActionsProps {
  courseId: string;
  chapterId: string;
}

const ChapterActions = ({ courseId, chapterId }: ChapterActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/course/${courseId}/chapters/${chapterId}`);
      toast.success("Chapter Delted");
      router.push(`/teacher/courses/${courseId}`);
    } catch (error) {
      toast.error("Something Went Wrong");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <AlertPopup onConfirm={onDelete}>
        <button
          className="flex items-center gap-x-2 bg-black text-white hover:scale-110 transition duration-300 ease-in-out rounded-lg px-3 py-2 text-sm"
          disabled={isLoading}
        >
          Delete
          <Trash className="h-5" />
        </button>
      </AlertPopup>
    </div>
  );
};

export default ChapterActions;
