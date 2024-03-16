"use client";

import axios from "axios";
import { Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import AlertPopup from "@/components/modals/AlertPopup";

interface ChapterActionsProps {
  disabled: boolean;
  courseId: string;
  isPublished: boolean;
}

export const ChapterActions = ({
  disabled,
  courseId,
  isPublished,
}: ChapterActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      if (isPublished) {
        await axios.patch(`/api/courses/${courseId}/unpublish`);
        toast.success("Chapter unpublished");
      } else {
        await axios.patch(`/api/courses/${courseId}/publish`);
        toast.success("Chapter published");
      }

      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/courses/${courseId}`);

      toast.success("Chapter deleted");
      router.refresh();
      router.push(`/teacher/course`);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <AlertPopup onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading}>
          Delete
          <Trash className="h-4 w-4" />
        </Button>
      </AlertPopup>
    </div>
  );
};
