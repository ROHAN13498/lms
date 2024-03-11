import { db } from "@/lib/db";
import Mux from "@mux/mux-node"
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server"

const { Video } = new Mux(process.env.MUX_TOKEN_ID!,process.env.MUX_TOKEN_SECRET!);

export async function PATCH(req:NextRequest,{params}:{params:{chapterId:string,courseId:string}}){

    try {
        const {chapterId,courseId}=params;
    
        const {userId}=auth()
    
        if(!userId){
            return new NextResponse("Unauthorised",{status:401})
        }
        
        const data=await req.json();

        const course=await db.course.findUnique({
            where:{
                id:courseId,
                // userId
            }
        })

        if(!course){
            return new NextResponse("Unauthorised",{status:401})
        }

        const chapter=await db.chapter.update({
            where:{
                id:chapterId,
                courseId:courseId
            },
            data:{
                ...data
            }
        })
        if(chapter.videoUrl){
            const existingMuxdata=await db.muxData.findFirst({
                where:{
                    chapterId:params.chapterId
                }
            })
            if(existingMuxdata){
                await  Video.Assets.del(existingMuxdata.assetId)

                await db.muxData.delete({
                    where:{
                        id: existingMuxdata.id
                    }
                })

            }

            const asset=await Video.Assets.create({
                input:chapter.videoUrl,
                playback_policy:"public",
                test:false,
                
            })
        

            await db.muxData.create({
                data:{
                    chapterId:params.chapterId,
                    assetId:asset.id,
                    playbackId:asset.playback_ids?.[0]?.id
                }
            })
        }
        
        return NextResponse.json(chapter);

    } catch (error) {
        console.log("Chapters",error)
    }

}