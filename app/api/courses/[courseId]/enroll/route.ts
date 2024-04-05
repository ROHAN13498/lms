import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest,{params}:{params:{courseId:string}}) {
    const {userId}=auth();
    if(!userId){
        return new NextResponse("Unauthorised",{status:401})
    }
    await db.purchase.create({
        data: {
          courseId: params.courseId,
          userId: userId,
        }
    });
    return NextResponse.json({message:"Enrolled Successfully"})

}