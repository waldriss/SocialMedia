"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useDeleteComment } from "@/lib/react-query/mutations";
import { TComment } from "@/lib/types/Post";
import { useAuth } from "@clerk/nextjs";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import profilesvg from "@public/svgs/profile.svg";
const Comment = ({

  comment,
  userId,
}: {
  comment: TComment;
  userId?: string | null;
}) => {
  const { getToken } = useAuth();
 
 
  const {mutateAsync:deleteComment}=useDeleteComment(comment.commented_postId,getToken);
  const handleDeleteComment=async()=>{
    if(userId)
    await deleteComment({commentId:comment.id,userId:userId});
    
  }
  return (
    <section className=" font-sans-serif2 relative border-solid border-1 border-[#191b24] rounded-2xl p-2">
      <div className="flex items-center space-x-2 relative">
      <Link href={`/profiles/${comment.commenterId}`}>
        <Avatar className="w-9 h-9">
          <AvatarImage className="object-cover" src={comment.commenter.userImage} />
          <AvatarFallback>
          <Image alt=''  className='w-full h-full p-1 bg-borderPrimary' src={profilesvg.src} height={100} width={100}/>
          </AvatarFallback>
        </Avatar>
        </Link>
       

        <Link href={`/profiles/${comment.commenterId}`}>
          <p className="text-sm font-semibold text-whiteShade leading-none">
            {comment.commenter.name}
          </p>
          <p className="text-sm text-muted-foreground">
            @{comment.commenter.username}
          </p>
        </Link>
      </div>
      
      <p className="text-whiteShade pt-2  px-2">{comment.body}</p>
      {userId === comment.commenterId.toString() && (
        <X onClick={handleDeleteComment} className="absolute text-[#232633] cursor-pointer top-2 right-2 w-5 h-5" />
      )}

    
    </section>
  );
};

export default Comment;
