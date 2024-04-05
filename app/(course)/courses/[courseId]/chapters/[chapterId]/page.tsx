// Import necessary modules and components
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";
import { getChapter } from "@/lib/GetChapter";
import VideoPlayer from "./_Components/VideoPlayer";
import CourseEnrollButton from "./_Components/CourseEnrollButton";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import { File } from "lucide-react";
import CourseProgress from "@/components/CourseProgress";
import CourseProgressButton from "./_Components/CourseProgressButton";

const page = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const res = await getChapter({
    userId,
    courseId: params.courseId,
    chapterId: params.chapterId,
  });

  const {
    chapter,
    course,
    muxData,
    attachments,
    nextChapter,
    userProgress,
    purchase,
  } = res;

  if (!chapter || !course) {
    return redirect("/");
  }

  const isLocked = !purchase;
  const completeOnEnd = !purchase && userProgress?.isCompleted;

  return (
    <div>
      {userProgress?.isCompleted && (
        <p>You have Already Completed This Chapter</p>
      )}
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            chapterId={params.chapterId}
            title={chapter.title}
            courseId={params.courseId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId!}
            isLocked={isLocked}
            completeOnEnd={!completeOnEnd}
          />
        </div>
      </div>
      <div className="p-4 flex flex-col md:flex-row items-center justify-between">
        <h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
        {purchase ? (
          <CourseProgressButton
            chapterId={params.chapterId}
            courseId={params.courseId}
            nextChapterId={nextChapter?.id}
            isCompleted={!!userProgress?.isCompleted}
          />
        ) : (
          <div>
            <CourseEnrollButton
              courseId={params.courseId}
              price={course.price}
            />
          </div>
        )}
      </div>
      <Separator />
      <div>
        <Preview value={chapter.description!} />
      </div>
      <div>
        {!!attachments.length && (
          <>
            <Separator />
            <div className="p-4">
              {attachments.map((attachment) => (
                <div>
                  <a
                    key={attachment.id}
                    href={attachment.url}
                    target="_blank"
                    className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline "
                  >
                    <File size={18} />
                    <p>{attachment.name}</p>
                  </a>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default page;
