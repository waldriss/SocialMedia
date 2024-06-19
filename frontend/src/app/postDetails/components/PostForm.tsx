"use client";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import FileUploader from "./FileUploader";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PostValidation } from "@/lib/validations/postvalidations";
import { Button } from "@/components/ui/button";
import { useCreatePost, useUpdatePost } from "@/lib/react-query/mutations";
import { useAuth, useUser } from "@clerk/nextjs";
import { TPostDetails } from "@/lib/types/Post";
import LoadingSvg from "@/components/Generalcomponents/LoadingSvg";
import { toast } from "sonner";
import { generateUniqueId } from "@/lib/utils";
const PostForm = ({ post }: { post?: TPostDetails}) => {
  const { getToken } = useAuth();
  
  const { user } = useUser();

  const toastContent = (message: string, id: string) => (
    <div className="w-full">
      <h4 className="font-semibold font-sans text-whiteShade text-base ">Posts</h4>
      <div className="flex font-sans-serif2 items-center justify-between w-full">
        <p className="text-muted-foreground text-[0.95rem]">{message}</p>
        <Button className="font-sans" onClick={() => toast.dismiss(id)} size={"sm"}>
          Undo
        </Button>
      </div>
    </div>
  );
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: post?[undefined]:[],
      location: post ? post.location : "",
      tags: post ? post.tags.join(",") : "",
    },
  });

  const {
    mutateAsync: createPost,
    isPending: isPendingCreate,
    error: errorCreate,
  } = useCreatePost(user?.externalId?user.externalId:"",getToken);

  const {
    mutateAsync: updatePost,
    error: errorUpdate,
    isPending: isPendingUpdate,
  } = useUpdatePost(post?.id,user?.externalId?user.externalId:"",getToken);
  const [resetFile, setResetFile] = useState(false);

  const handleSubmit = async (formPost: z.infer<typeof PostValidation>) => {
    
    if (user?.externalId) {
      if (!post) {
        const createdPost = await createPost({
          file: formPost.file,
          caption: formPost.caption,
          location: formPost.location,
          tags: formPost.tags,
          userId: user.externalId,
        });

        if (!createdPost) {
          console.log(errorCreate);
        } else {
          const id = generateUniqueId();
          toast(toastContent("the post has been created successfuly", id), {
            position: "bottom-center",
            id: id,
          });
          form.reset();
          setResetFile(true);
        }
      } else {
        if (user.externalId === post.posterId.toString()) {
          const updatedPost = await updatePost({
            file: formPost.file[0]===undefined ? undefined : formPost.file,
            caption: formPost.caption,
            location: formPost.location,
            tags: formPost.tags,
            userId: user.externalId,
          });

          if (!updatedPost) {
            console.log(errorUpdate?.message);
          } else {
            const id = generateUniqueId();
            toast(toastContent("the post has been updated successfuly", id), {
              position: "bottom-center",
              id: id,
            });
          }
        } else {
          /// impossible its not the poster
        }
      }
    }
  };

  return (
    <>
      <LoadingSvg
        className={`${
          isPendingCreate || isPendingUpdate ? "block" : "hidden"
        } h-36 w-36 mt-32`}
      />
      <Form {...form}>
        <form
          className={`font-sans-serif2 ${
            isPendingCreate || isPendingUpdate ? "hidden" : "block"
          } `}
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <FormField
            control={form.control}
            name="caption"
            render={({ field }) => (
              <FormItem className="pt-7">
                <FormLabel className="text-lg text-whiteShade">
                  Add Caption
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="rounded-lg bg-transparent border-[#2e3142] text-whiteShade"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem className="pt-7">
                <FormLabel className="text-lg text-whiteShade">
                  Add Photos
                </FormLabel>
                <FormControl>
                  <FileUploader
                    resetFile={resetFile}
                    setResetFile={setResetFile}
                    fieldChange={field.onChange}
                    mediaUrl={post?.postImage}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="pt-7">
                <FormLabel className="text-lg text-whiteShade">
                  Add Location
                </FormLabel>
                <FormControl>
                  <Input
                    className="bg-transparent text-whiteShade py-6 border-[#2e3142]"
                    placeholder=""
                    type="text"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem className="pt-7">
                <FormLabel className="text-lg text-whiteShade">
                  Add Tags{" "}
                  <span className="text-muted-foreground text-sm">
                    (enter as tag1,tag2,tag3)
                  </span>
                </FormLabel>
                <FormControl>
                  <Input
                    className="bg-transparent text-whiteShade py-6 border-[#2e3142]"
                    placeholder=""
                    type="text"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full pt-10 text-center">
            <Button type="submit" className="font-sans py-6 px-10 text-base">
              {!post ? "Create Post" : "Update Post"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default PostForm;
