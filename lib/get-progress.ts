import { db } from "./db";

export const getProgress = async (userId: string, courseId: string) => {
  try {
    const chapters = await db.chapter.findMany({
      where: {
        courseId: courseId,
      },
      select: {
        id: true,
      },
    });
    const chaptersIds = chapters.map((chapter) => chapter.id);
    const CompletedChapters=await db.userProgress.count({
        where:{
            userId:userId,
            chapterId:{
                in:chaptersIds
            },
            isCompleted:true
        }
    })
    const percentage=(CompletedChapters/chaptersIds.length)*100;
    return percentage
  } catch (error) {
    console.log("[GET_PROGRESS:]",error)
  }
};
