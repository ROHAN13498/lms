import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";


export async function PATCH(req:NextRequest,{params}:{params:{courseId:string}}) {
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