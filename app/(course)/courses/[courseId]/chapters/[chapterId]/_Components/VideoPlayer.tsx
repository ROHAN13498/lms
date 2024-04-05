"use client";

import axios from "axios";
import MuxPlayer from "@mux/mux-player-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

import { CreateToken } from "@/app/(dashboard)/(routes)/teacher/course/[courseId]/chapters/[chapterId]/_components/CreateToken";

import { cn } from "@/lib/utils";
import { title } from "process";

interface VideoPlayerProps {
  playbackId: string;
  courseId: string;
  chapterId: string;
  nextChapterId?: string;
  isLocked: boolean;
  completeOnEnd: boolean;
  title: string;
}
const VideoPlayer = ({
  playbackId,
  courseId,
  chapterId,
  nextChapterId,
  isLocked,
  completeOnEnd,
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  const onEnd = async() => {
    try {
      if (completeOnEnd) {
        await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`,{
          isCompleted:true
        });

        toast.success("Progress Updated");

        if(nextChapterId){
          router.push(`/courses/${courseId}/chapters/${nextChapterId}`)
        }
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.log("[VIdeoPLayerEnd:]", error);
    }
  };

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const tokenValue = await CreateToken(playbackId);
        setToken(tokenValue);
      } catch (error) {
        console.error("Error Creating TOken token:", error);
      }
    };

    fetchToken();
  }, [playbackId]);
  return (
    <div>
      <div className="relative aspect-video">
        {!isReady && !isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
            <Loader2 className="h-8 w-8 animate-spin text-secondary" />
          </div>
        )}
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
            <Lock className="h-8 w-8" />
            <p className="text-sm">This chapter is locked</p>
          </div>
        )}
        {!isLocked && token && (
          <MuxPlayer
            title={title}
            className={cn(!isReady && "hidden")}
            onCanPlay={() => {
              setIsReady(true);
            }}
            onEnded={onEnd}
            autoPlay
            playbackId={playbackId}
            tokens={{ playback: token }}
          />
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
