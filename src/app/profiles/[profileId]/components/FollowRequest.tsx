"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAcceptFollow, useDeleteFollow } from "@/lib/react-query/mutations";

import { FollowerOrfollowed } from "@/lib/types/user";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import profilesvg from "@public/svgs/profile.svg"
const FollowRequest = ({
  followerOrFollowed,
  profileId,
  type,
  isProfileOfAuth,
}: {
  followerOrFollowed: FollowerOrfollowed;
  profileId: number;
  type: string;
  isProfileOfAuth?: boolean;
}) => {
  
  const [displayComponent, setdisplayComponent] = useState(true);
  const { getToken } = useAuth();

  const { mutateAsync: acceptFollow } = useAcceptFollow(getToken);
  const { mutateAsync: deleteFollow } = useDeleteFollow(getToken);

  const handleAccept = async () => {
    setdisplayComponent(false);
    acceptFollow({
      followerId: followerOrFollowed.id,
      followedId: profileId,
    });
  };
  const handleReject = async () => {
    setdisplayComponent(false);
    deleteFollow({
      followerId: followerOrFollowed.id,
      followedId: profileId,
    });
  };
  const handleRemove = async () => {
    if (type === "accepted_followers") {
      setdisplayComponent(false);
      deleteFollow({
        followerId: followerOrFollowed.id,
        followedId: profileId,
      });
    } else {
      setdisplayComponent(false);
      deleteFollow({
        followerId: profileId,
        followedId: followerOrFollowed.id,
      });
    }
  };
  return displayComponent ? (
    <>
      <div className="flex justify-between items-center px-2">
        <Link
          href={"/profiles/" + followerOrFollowed.id}
          className="flex items-center space-x-3 font-sans-serif2  "
        >
          <Avatar className="w-12 h-12">
            <AvatarImage src={followerOrFollowed.userImage} />
            <AvatarFallback className="text-black">
            <Image alt=''  className='w-full h-full p-1 bg-borderPrimary' src={profilesvg.src} height={100} width={100}/>
            </AvatarFallback>
          </Avatar>

          <div>
            <p className="text-sm font-semibold text-whiteShade leading-none">
              {followerOrFollowed.name}
            </p>
            <p className="text-sm text-muted-foreground">
              @{followerOrFollowed.username}
            </p>
          </div>
        </Link>
        {isProfileOfAuth && (
          <div className="flex gap-x-4 font-sans">
            {type === "pending" ? (
              <>
                <Button
                  onClick={handleAccept}
                  size={"lg"}
                  className="rounded-full"
                >
                  Accept
                </Button>
                <Button
                  onClick={handleReject}
                  size={"lg"}
                  className="rounded-full bg-secondary hover:bg-[#2e3142]"
                >
                  Reject
                </Button>
              </>
            ) : (
              <Button
                onClick={handleRemove}
                size={"lg"}
                className="rounded-full bg-secondary hover:bg-[#2e3142]"
              >
                Remove
              </Button>
            )}
          </div>
        )}
      </div>
      <Separator className="bg-[#1d1f2a] " />
    </>
  ) : (
    <></>
  );
};

export default FollowRequest;
