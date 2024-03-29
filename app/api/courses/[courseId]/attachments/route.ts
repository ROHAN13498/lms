import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest,{params}:{params:{courseId:string}}) {
    try {
        const {userId}=auth()
        const {url}=await req.json();

        if(!userId){
            return new NextResponse("Unauthorised",{status:401})
        }

        const courseOwner=await db.course.findUnique({
            where:{
                id:params.courseId
            }
        })

        if(!courseOwner){
            return new NextResponse("Unauthorised",{status:401}) 
        }

        const attachment = await db.attachment.create({
            data:{
                url,
                name:url.split("/").pop(),
                courseId:params.courseId
            }
        })

        return NextResponse.json(attachment)
    } catch (error) {
        console.log("Attachments",error)
    }
}