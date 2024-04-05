"use client";

import { auth } from "@clerk/nextjs";
import { Button } from "./ui/button";
import axios from "axios";
import toast from "react-hot-toast";

const registerCourse = async (courseId: string) => {
  try {
    await axios.post(`/api/courses/${courseId}/enroll`);
    toast.success("Enrolled Successfully");
  } catch (error) {
    console.log("[REGISTER-COURSE]", error);
  }
};

const Enroll = ({ courseId }: { courseId: string }) => {
  const handleEnrollClick = () => {
    console.log("CLICK");
    registerCourse(courseId);
  };

  return (
    <div>
      <Button onClick={handleEnrollClick}>Enroll</Button>
    </div>
  );
};

export default Enroll;
