import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import {
  ArrowDownRightFromCircle,
  Banknote,
  LayoutList,
  Paperclip,
} from "lucide-react";

import { AttachmentForm } from "./_components/AttachmentForm";
import { CategoryForm } from "./_components/CategoryForm";
import { ChapterForm } from "./_components/ChapterForm";
import { DescriptionForm } from "./_components/DescriptionForm";
import { ImageForm } from "./_components/ImageForm";
import { PriceForm } from "./_components/PriceForm";
import { TitleForm } from "./_components/TitleForm";

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      userId,
    },
    include: {
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
      attachments: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  if (!course) {
    return redirect("/");
  }

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
    course.chapters.some(chapter=>chapter.isPublished),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Course setup</h1>
          <span className="text-sm text-slate-700">
            Complete all fields {completionText}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex gap-x-2 items-baseline">
            <ArrowDownRightFromCircle className="size-[25px]" />
            <h2 className="text-2xl">Customize your course</h2>
          </div>
          <TitleForm initialData={course} courseId={params.courseId} />
          <DescriptionForm initialData={course} courseId={params.courseId} />
          <ImageForm initialData={course} courseId={params.courseId} />
          <CategoryForm
            initialData={course}
            courseId={params.courseId}
            options={categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
          />
        </div>
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-x-2">
              <LayoutList />
              <h2 className="text-2xl">Course Chapters</h2>
            </div>
            <ChapterForm initialData={course} courseId={params.courseId} />
          </div>
          <div>
            <div>
              <div className="flex items-center gap-x-2">
                <Banknote />
                <div className="text-xl">Price</div>
              </div>
              <PriceForm initialData={course} courseId={params.courseId} />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <Paperclip />
              <h2 className="text-xl">Attachments</h2>
            </div>
            <AttachmentForm initialData={course} courseId={params.courseId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseIdPage;
