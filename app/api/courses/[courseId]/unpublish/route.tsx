import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: { courseId: string };
}

export async function PATCH(req: NextRequest, { params }: Props) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unautorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });
    if (!course) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const unPublishedCourse = await db.course.update({
      where: {
        id: params.courseId,
        userId,
      },
      data: {
        isPublished: false,
      },
    });
    return NextResponse.json(unPublishedCourse);
  } catch (error) {
    console.log("Course Unpublish:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
