"use client";
import AnimatedHeart from "@/components/Generalcomponents/AnimatedHeart";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRef } from "react";
import CommentForm from "./CommentForm";
import { Liker, Sharer } from "@/lib/types/Post";
import Share from "@/components/Generalcomponents/Share";

const PostActions = ({
  postId,
  userId,
  likers,
  sharers,

}: {
  postId: number;
  userId?: string | null;
  likers:Liker[],
  sharers:Sharer[],

}) => {
  const submitRef = useRef<HTMLButtonElement>(null);
  const handleClick = () => {
    if (submitRef.current) {
      submitRef.current.click();
    }
  };

  return (
    <section className=" font-sans-serif2">
      <Separator className="bg-[#171821] mt-3 " />
      <CommentForm postId={postId} userId={userId} submitRef={submitRef} />

      <div className=" gap-x-2 relative flex justify-start items-center pt-2">
        <div className="flex justify-start items-center ">
          {<AnimatedHeart  postId={postId} likers={likers} subclass='!w-[52px] mb-1'/>}
        </div>
        <Share className="w-8 h-8 text-whiteShade" sharers={sharers} postId={postId}/>
       
        <Button
          onClick={handleClick}
          className="absolute font-sans right-0 rounded-full px-7 py-5"
        >
          {" "}
          Publish
        </Button>
      </div>
    </section>
  );
};

export default PostActions;
