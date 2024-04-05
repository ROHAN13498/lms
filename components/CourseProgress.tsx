import React from "react";
import { Progress } from "./ui/progress";

interface Props {
  value?: number;
}

const CourseProgress = ({ value }: Props) => {
  return (
    <div className="flex flex-col">
      <Progress className="h-2" value={value} />
      <p className="font-medium text-sky-700 mt-1">
        {Math.round(value!)}% Complete
      </p>
    </div>
  );
};

export default CourseProgress;
