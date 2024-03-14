import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { ArrowDownRightFromCircle, ArrowLeft, Trash } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { ChapterTitleForm } from "./_components/ChapterTitleForm";
import { ChapterDescriptionForm } from "./_components/ChapterDescriptionForm";
import { ChapterVideoForm } from "./_components/ChapterVideoForm";
import ChapterActions from "./_components/ChapterActions";

const page = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }

  const chapter = await db.chapter.findUnique({
    where: {
      courseId: params.courseId,
      id: params.chapterId,
    },
    include: { muxData: true },
  });

  if (!chapter) {
    return redirect("/");
  }

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];

  const totalFeilds = requiredFields.length;

  const completeFeilds = requiredFields.filter(Boolean).length;

  const completionText = `(${completeFeilds} / ${totalFeilds})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="w-full">
          <Link
            href={`/teacher/course/${params.courseId}`}
            className="flex items-center text-sm hover:opacity-75 transition mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to course Setup
          </Link>
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">Chapter Creation</h1>
              <span>Complete all fields {completionText}</span>
            </div>
            <ChapterActions courseId={params.courseId}
            chapterId={params.chapterId}/>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex gap-x-2 items-baseline">
            <ArrowDownRightFromCircle className="size-[25px]" />
            <h2 className="text-2xl mt-10">Customize your Chapter</h2>
          </div>
          <ChapterTitleForm
            initialData={chapter}
            courseId={params.courseId}
            chapterId={params.chapterId}
          />
          <ChapterVideoForm
            initialData={chapter}
            courseId={params.courseId}
            chapterId={params.chapterId}
          />
        </div>
        <ChapterDescriptionForm
          initialData={chapter}
          courseId={params.courseId}
          chapterId={params.chapterId}
        />
      </div>
    </div>
  );
};

export default page;
