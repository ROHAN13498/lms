"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import toast from "react-hot-toast";

interface Props {
  courseId: string;
  price: number | null;
}

const registerCourse = async (courseId: string) => {
  try {
    await axios.post(`/api/courses/${courseId}/enroll`);
    toast.success("Enrolled Successfully");
  } catch (error) {
    console.log("[REGISTER-COURSE]", error);
  }
};
const CourseEnrollButton = ({ price, courseId }: Props) => {
  const formatPrice = (price: number | null): string => {
    if (price !== null) {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
      }).format(price);
    } else {
      return "N/A";
    }
  };
  const handleEnrollClick = () => {
    console.log("CLICK");
    registerCourse(courseId);
  };

  return (
    <div>
      <Button className="w-full md:w-auto" onClick={handleEnrollClick}>
        Enroll For {formatPrice(price)}
      </Button>
    </div>
  );
};

export default CourseEnrollButton;
