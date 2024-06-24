import Image from "next/image";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import AnimatedHeart from "./AnimatedHeart";
import { TUserPost } from "@/lib/types/user";
import Link from "next/link";
import { TExplorePost } from "@/lib/types/Post";
import Share from "./Share";
import profilesvg from "@public/svgs/profile.svg";
import { Skeleton } from "../ui/skeleton";
const ExplorePost = ({
  subclass,
  isprofilePage,
  post,
}: {
  subclass?: string;
  isprofilePage?: boolean;
  post: TUserPost | TExplorePost;
}) => {
  const explorePost = post as TExplorePost;
  const [loadedImage,setLoadedImage]=useState(false);
  return (
    <Link
      key={post.id}
      href={"/posts/" + post.id}
      className={
        `  block cursor-pointer relative bg-transparent ${
          isprofilePage ? "overflow-hidden" : "border-1 border-borderPrimary "
        } rounded-3xl  h-auto w-auto aspect-square ` + subclass
      }
    >
      <Image
        alt="OM"
        className={`w-full h-full object-cover transition-opacity !duration-400 ${loadedImage?"opacity-1":"opacity-0"} ${
          !isprofilePage && "rounded-3xl"
        }`}
        width={800}
        height={800}
        src={post.postImage}
        onLoad={()=>setLoadedImage(true)}
      />
      <Skeleton
        className={`aspect-square w-full h-full rounded-3xl absolute top-0 ${loadedImage?"hidden":"block"}`}
      />

      {!isprofilePage && loadedImage&&  (
        <div
          className={
            " absolute font-sans rounded-b-3xl -bottom-[0px] px-6 pt-4 h-[88px] flex justify-between  w-full bg-gradient-to-t from-backgroundgrad2 to-transparent  "
          }
        >
          <div className="flex items-center space-x-2  ">
            <Avatar className="w-9 h-9">
              <AvatarImage className="object-cover" src={explorePost.poster.userImage} />
              <AvatarFallback>
                {" "}
                <Image
                  alt=""
                  className="w-full h-full p-1 bg-borderPrimary"
                  src={profilesvg.src}
                  height={100}
                  width={100}
                />
              </AvatarFallback>
            </Avatar>

            <div></div>
          </div>
          <div className=" gap-x-2 relative flex justify-end items-center">
            <div className="flex justify-start items-center">
              <AnimatedHeart
                subclass="!w-[45px]"
                postId={explorePost.id}
                likers={explorePost.liked_posts}
              />
              <span className="-ml-[6px] text-sm font-medium text-white">
                {" "}
                {explorePost.liked_posts.length}
              </span>
            </div>

            <Share
              className="w-6 h-6 text-white"
              postId={explorePost.id}
              sharers={explorePost.shared_posts}
            />
          </div>
        </div>
      )}
    </Link>
  );
};

export default ExplorePost;
