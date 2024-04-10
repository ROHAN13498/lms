import { Category, Chapter, Course } from "@prisma/client";
import { db } from "./db";
import { getProgress } from "./get-progress";

type CourseWithProgressWithCategory = Course & {
    category: Category;
    chapters: Chapter[];
    progress?: number ;
}

type DashboardCourses = {
    completedCourses: CourseWithProgressWithCategory[];
    coursesInProgress: CourseWithProgressWithCategory[];
}

export const getDashboardCourses = async (userId: string): Promise<DashboardCourses> => {
    try {
        const purchasedCourses = await db.purchase.findMany({
            where: {
                userId: userId
            },
            select: {
                course: {
                    include: {
                        category: true,
                        chapters: true
                    }
                }
            }
        });

        const courses=purchasedCourses.map((puchase)=>puchase.course) as CourseWithProgressWithCategory[]

        for (let course of courses){
            const progress=await getProgress(userId,course.id);
            course["progress"]=progress
        }

        const completedCourses=courses.filter((course)=>course.progress===100);
        const coursesInProgress=courses.filter((course)=>(course.progress ?? 0) <100)
        return {
            completedCourses,
            coursesInProgress
        };
    } catch (error) {
        console.log("[GETDASHBOARDCOURSES]:", error);
        return {
            completedCourses: [],
            coursesInProgress: []
        };
    }
}
