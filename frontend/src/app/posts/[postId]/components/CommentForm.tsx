"use client";
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useCommentPost } from "@/lib/react-query/mutations";
import { UseAuthenticatedUser } from "@/lib/store/store";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import profilesvg from "@public/svgs/profile.svg";
const formSchema = z.object({
  body: z.string(),
});

const CommentForm = ({
  submitRef,
  postId,
  userId,
}: {
  postId: number;
  userId?: string | null;
  submitRef: React.RefObject<HTMLButtonElement>;
}) => { 
  const { getToken } = useAuth();
  
 
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const { mutateAsync: commentPost } = useCommentPost(postId,getToken);
 const {authenticatedUser}=UseAuthenticatedUser()
  const handleSubmit = async (CommentFormData: z.infer<typeof formSchema>) => {
    if (postId && userId) {
      await commentPost({
        body: CommentFormData.body,
        postId: postId,
        userId: parseInt(userId),
      });
      form.reset({
        body:""
     });
    }
  };
  return (
    <div className="flex items-center space-x-2 pt-4   ">
      <Avatar className="w-12 h-12">
        <AvatarImage src={authenticatedUser?.userImage} />
        <AvatarFallback> <Image alt=''  className='w-full h-full p-1 bg-borderPrimary' src={profilesvg.src} height={100} width={100}/></AvatarFallback>
      </Avatar>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex-grow">
          <FormField
            control={form.control}
            name="body"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    className="text-whiteShade min-h-14 resize-none  bg-transparent rounded-full "
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <button
            className="invisible absolute"
            ref={submitRef}
            type="submit"
          ></button>
        </form>
      </Form>
    </div>
  );
};

export default CommentForm;
