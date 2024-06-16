"use client";
import { useEffect } from "react";
import Image from "next/image";

import { TPostDetails } from "@/lib/types/Post";
import { useGetPost } from "@/lib/react-query/queries";
import { Button } from "@/components/ui/button";
import { CornerUpLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/react-query/queryKeys";
import { useDeletePost } from "@/lib/react-query/mutations";

import { useAuth } from "@clerk/nextjs";
import PostInfos from "@/app/posts/[postId]/components/PostInfos";
import { useMediaQuery } from "@/lib/hooks/mediaqueryhook";
const PostInfosInsideModal = ({
  post,
  postId,

}: {
  post: TPostDetails;
  postId: string;

}) => {
  const { getToken } = useAuth();

  const { data: postData } = useGetPost(postId, post, getToken);
  const {
    mutateAsync: deletePost,
    isPending: isDeletingPost,
    isSuccess,
  } = useDeletePost(getToken);
  const queryClient = useQueryClient();
  /*useEffect(() => {
    queryClient.setQueryData([QUERY_KEYS.GET_POST, postId], post);
  }, [post]);*/

  const router = useRouter();
  const ismd = useMediaQuery("(min-width: 768px)");
  return ismd ? (
    <section className="  w-full flex-col items-center lg:h-[664px] bg-[#0d0d12] rounded-3xl lg:flex-row flex lg:items-stretch overflow-hidden border-solid border border-1px border-borderPrimary">
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-5 ">
        <Image
          alt="OM"
          className="object-cover object-center h-full w-full rounded-2xl"
          width={800}
          height={800}
          src={postData.postImage}
        />
      </div>

      <PostInfos ismodal deletePost={deletePost} post={postData} />
    </section>
  ) : (
    <>
    
        <div className="flex items-center">
          <Button
            className="text-whiteShade"
            onClick={router.back}
            variant={"link"}
          >
            <CornerUpLeft className="mr-2 h-8 w-8" />{" "}
            <span className="text-2xl font-sans">Back</span>
          </Button>
        </div>

        <section className="  w-full flex-col items-center xl:h-[664px] bg-[#0d0d12] mt-7 rounded-3xl xl:flex-row flex xl:items-stretch overflow-hidden border-solid border border-1px border-borderPrimary">
          <div className="w-full xl:w-1/2 flex flex-col justify-center items-center p-5 ">
            <Image
              alt="OM"
              className="object-cover object-center h-full w-full rounded-2xl"
              width={800}
              height={800}
              src={postData.postImage}
            />
          </div>

          <PostInfos deletePost={deletePost} post={postData} />
        </section>
      </>
   
  );
};

export default PostInfosInsideModal;
