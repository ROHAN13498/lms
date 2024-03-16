import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import Mux from "@mux/mux-node";


const {video} = new Mux({
    tokenId: process.env.MUX_TOKEN_ID,
    tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

interface Props{
    params:{courseId:string};
}

export async function PATCH(req:NextRequest,{params}:Props) {
    try {
        
        const courseId=params.courseId;
    
        const {userId}=auth();

        const values=await req.json();
    
        if(!userId){
            return  NextResponse.json({message:"Unauthorised"},{status:401})
        }

        const course=await db.course.findUnique({
            where:{
                id:courseId
            }
        })

        if(!course){
            return NextResponse.json({message:"Course not found"},{status:404});
        }

        const updateCourse=await db.course.update({
            where:{
                id:courseId,
                userId
            },
            data:{
                ...values
            }
        })

        
        return NextResponse.json({updateCourse});
        
    } catch (error) {
        console.log("{COURSEID]: ",error)
        return NextResponse.json({message:"Internal error"},{status:500});
    }

}

export async function DELETE(req:NextRequest,{params}:Props) {
    try {
        const {userId}=auth()

        if(!userId){
            return new NextResponse("Unauthorised",{status:401})
        }

        const course=await db.course.findUnique({
            where:{
                id:params.courseId,
                userId
            },
            include:{
                chapters:{
                    include:{
                        muxData:true
                    }
                },
                attachments:true
            }
        })
        if(!course){
            return new NextResponse("Not found",{status:404});
        }

        for(const chapter of course.chapters){
            if(chapter.muxData?.assetId){
                await video.assets.delete(chapter.muxData.chapterId)
            }
        }

        const deletedCourse=await db.course.delete({
            where:{
                id:params.courseId
            }
        })
        return  NextResponse.json(deletedCourse)
    } catch (error) {
        console.log("Chapter Delete:",error);
        return new NextResponse("Internal Server Error",{status:500})
    }
}
