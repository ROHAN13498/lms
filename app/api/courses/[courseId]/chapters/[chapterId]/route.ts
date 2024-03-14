import { db } from "@/lib/db";
import Mux from "@mux/mux-node"
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server"

const {video} = new Mux({
    tokenId: process.env.MUX_TOKEN_ID,
    tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

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
                userId
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
                
                await  video.assets.delete(existingMuxdata.assetId)

                await db.muxData.delete({
                    where:{
                        id: existingMuxdata.id
                    }
                })

            }
            const url=chapter.videoUrl
            const asset = await video.assets.create({
                input: [{url:url}], 
                playback_policy: ["signed"],
                test: false,
              });
              
            console.log
            

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


export async function DELETE(req:NextRequest,{params}:{params:{chapterId:string,courseId:string}}) {

    try {
            const {userId}=auth();
            if(!userId){
                return new NextResponse("Unauthorised",{status:401})
            }
            const course= await db.course.findUnique({
                where:{
                    id:params.courseId,
                    userId
                }
            })    

            if(!course){
                return new NextResponse("Unauthorised",{status:401})
            }

            const chapter=await db.chapter.findUnique({
                where:{
                    id:params.chapterId,
                    courseId:params.courseId,

                }
            })

        if(!chapter){
            return new NextResponse("Not Found",{status:404});
        }

        if(chapter.videoUrl){
            const existingMuxdata=await db.muxData.findFirst({
                where:{
                    chapterId:params.chapterId
                }
            })

            if(existingMuxdata){
                await video.assets.delete(existingMuxdata.assetId)
                await  db.muxData.delete({
                    where:{
                        id:existingMuxdata.id
                    }
                })
            }

        }
        const deleteChapter=await db.chapter.delete({
            where:{
                id:params.chapterId
            }
        });

       const Chapter=await db.chapter.findMany({
        where:{
            courseId:params.courseId
        }
       });

       if(!Chapter.length){
        await db.course.update({
            where:{
                id:params.courseId
            },  
            data:{
                isPublished:false
            }
        })
       }
       return NextResponse.json({deleteChapter})
    } catch (error) {
        console.log("Chpater DELETE:",error);
        return new NextResponse("Internal Sever Error",{status:500})
    }
    
}