import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";

export const utapi = new UTApi();

interface Props {
  params: { courseId: string; id: string };
}

export async function DELETE(req: NextRequest, { params }: Props) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ Message: "Unauthorised" }, { status: 401 });
    }
    const id = params.id;
    const courseId = params.courseId;

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });

    if (!course) {
      return NextResponse.json(
        { message: "Course not found" },
        { status: 404 }
      );
    }
    if (!course) {
      return NextResponse.json(
        { Message: "Course not found" },
        { status: 404 }
      );
    }

    const attachment = await db.attachment.findUnique({
      where: {
        id,
      },
    });

    await utapi.deleteFiles(attachment?.url?.split("/")?.pop() ?? "");

    const deleteAttachment = await db.attachment.delete({
      where: {
        courseId,
        id,
      },
    });

    return NextResponse.json(deleteAttachment);
  } catch (error) {
    console.log("Attachments delete:", error);
  }
}
