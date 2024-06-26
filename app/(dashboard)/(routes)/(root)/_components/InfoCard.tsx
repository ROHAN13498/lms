import { LucideIcon } from "lucide-react"

interface InfoCardProps{
    numberOfItems:number,
    label:string,
    icon:LucideIcon
}
const InfoCard = ({icon:Icon,label,numberOfItems}:InfoCardProps) => {
  return (
    <div className="border rounded-md flex items-center gap-x-2 p-3 text-sky-700">
        <Icon />
        <div>
            <p className="font-medium">
            {label}
            </p>
            <p className="text-gray-500 text-sm">
                {numberOfItems} {numberOfItems===1 ? "Course" : "Courses"}
            </p>
        </div>
    </div>
  )
}

export default InfoCard