import { FollowedRequest, FollowerRequest } from "@/lib/types/user";
import React from "react";
import Following from "./Following";
import Followers from "./Followers";

const ProfileStats = ({followers,following,profileId,postsNb,isProfileOfAuth}:{followers:FollowedRequest[],following:FollowerRequest[],profileId:number,postsNb:number,isProfileOfAuth?:boolean}) => {
  const acceptedFollowers=followers?.filter(followers=>followers.state==="accepted");

  const acceptedFollowing=following?.filter(following=>following.state==="accepted");
  

  return (
    <section className="flex justify-end items-center gap-x-3 sm:gap-x-6 lg:gap-x-8 pr-2 sm:pr-6 lg:pr-12 mb-14 text-whiteShade">
      <div className="flex-col font-sans flex justify-center items-center ">
        <span className="font-bold  text-base sm:text-xl lg:text-[28px]"> {postsNb}</span>
        <span className="font-medium text-sm sm:text-base lg:text-2xl"> Posts</span>
      </div>
      <Followers isProfileOfAuth={isProfileOfAuth} profileId={profileId} followRequestsList={acceptedFollowers} />
      <Following isProfileOfAuth={isProfileOfAuth} profileId={profileId} followRequestsList={acceptedFollowing} />
      
    </section>
  );
};

export default ProfileStats;
