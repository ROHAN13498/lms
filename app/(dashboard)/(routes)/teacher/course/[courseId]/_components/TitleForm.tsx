"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import toast from "react-hot-toast";
import { Course } from "@prisma/client";

const TitleForm = ({
  initialData,
  courseId,
}: {
  initialData: Course;
  courseId: string;
}) => {
  const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { title: initialData.title },
  });

  const router = useRouter();

  const { handleSubmit } = form;

  const onSubmit = async (data: { title: string }) => {
    try {
      if (data.title != initialData.title) {
        await axios.patch(`/api/courses/${courseId}`, data);
        toast.success("Course updated succesfully");
        router.refresh();
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="flex items-center justify-between">
        Title: {initialData.title}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">
              <div className="flex">
                <Pencil className="size-[20px] mr-1" />
                <p>Edit</p>
              </div>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Edit Title</SheetTitle>
              <SheetDescription>
                Make changes to your Title here. Click save when you're done.
              </SheetDescription>
            </SheetHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Form {...form}>
                <form className="space-y-8 mt-8">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. 'Advanced web development'"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          What will you teach in this course?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
              <SheetFooter>
                <SheetClose asChild>
                  <Button type="submit" onClick={() => router.refresh()}>
                    Save changes
                  </Button>
                </SheetClose>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default TitleForm;
