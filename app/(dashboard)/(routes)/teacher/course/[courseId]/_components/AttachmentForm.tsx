"use client";

import { Attachment, Course } from "@prisma/client";
import axios from "axios";
import { File, ImageIcon, Loader2, Pencil, PlusCircle, Trash } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import * as z from "zod";

import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
}

const formSchema = z.object({
  url: z.string().min(1),
});

export const AttachmentForm = ({
  initialData,
  courseId,
}: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deleting,setDeleting]=useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values);
      toast.success("Image updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const  handleDelete= async (id:string)=>{
    setDeleting(true)
    try {
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
      toast.success("Attachment Deleted succesfully")
      router.refresh();
    } catch (error) {
      toast.error("Something Went Wrong!")
    }
    finally{
      setDeleting(false)
    }
  }

  return (
    <div className="mt-6 border bg-slate-200 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course image
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add an File
            </>
          )}
          {!isEditing && initialData.imageUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit image
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && <p>No Attachments...</p>}
          {initialData.attachments.length > 0 && (
            <div className="space-y-2">
              {initialData.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex  p-3 border-sky-200 bg-slate-200 justify-between"
                >
                  <div className="flex space-x-5">
                    <File className="h-4 w-4   " />
                    <p className="text-xs line-clamp-1">{attachment.name}</p>
                  </div>
                  {
                    (!deleting) ? (<button onClick={() => handleDelete(attachment.id)}>
                    <Trash className="h-4 w-4 text-rose-700 hover:scale-150 transition" />
                  </button>) :
                  (<Loader2  className="animate-spin" strokeWidth={1.5} />)
                  }
                  
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {isEditing && (
        <div>
          <FileUpload
            endPoint="courseAttachment"
            onChange={(url) => {
              if (url) {
                onSubmit({ url: url });
              }
            }}
          />
        </div>
      )}
    </div>
  );
};
