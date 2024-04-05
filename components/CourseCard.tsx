import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Button } from "./ui/button";
import Enroll from "./Enroll";
import CourseProgress from "./CourseProgress";

interface CourseCardProps {
  id: string;
  title: string;
  imageUrl: string;
  chaptersLength: number;
  price: number;
  progress?: number | null;
  category: string;
}

export const CourseCard = ({
  id,
  title,
  imageUrl,
  chaptersLength,
  price,
  progress,
  category,
}: CourseCardProps) => {
  return (
    <div>
      <Link href={`/courses/${id}`}>
        <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
          <div className="relative w-full aspect-video rounded-md overflow-hidden">
            <Image fill className="object-cover" alt={title} src={imageUrl} />
          </div>
          <div className="flex flex-col pt-2">
            <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
              {title}
            </div>
            <p className="text-xs text-muted-foreground">{category}</p>
            <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
              <div className="flex items-center gap-x-1 text-slate-500">
                <BookOpen size={"18"} />
                <span>
                  {chaptersLength}{" "}
                  {chaptersLength === 1 ? "Chapter" : "Chapters"}
                </span>
              </div>
            </div>
            {progress !== null ? (
              <div>
                <CourseProgress value={progress} />
              </div>
            ) : (
              <p className="text-md md:text-sm font-medium text-slate-700">
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                }).format(price)}
                {/* <Enroll courseId={id} /> */}
              </p>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};
