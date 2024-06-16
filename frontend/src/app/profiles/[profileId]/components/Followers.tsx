import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FollowedRequest } from "@/lib/types/user";
import { UsersRound } from "lucide-react";
import React from "react";
import FollowRequest from "./FollowRequest";
import { Separator } from "@/components/ui/separator";

const Followers = ({
  followRequestsList,
  profileId,
  isProfileOfAuth,
}: {
  followRequestsList: FollowedRequest[];
  profileId: number;
  isProfileOfAuth?: boolean;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex-col font-sans text-primary  flex justify-center items-center cursor-pointer ">
          <span className="font-bold text-base sm:text-xl lg:text-[28px]">
            {" "}
            {followRequestsList.length}
          </span>
          <span className="font-medium text-sm sm:text-base lg:text-2xl "> Followers</span>
        </div>
      </DialogTrigger> 
      <DialogContent className="!rounded-lg    min-w-[80%] sm:h-auto sm:max-h-[600px] lg:min-w-[750px] overflow-y-scroll border-none text-white  customScrollBar_dark bg-gradient-to-t from-backgroundgrad1 to-backgroundgrad2 ">
        <DialogHeader>
          <DialogTitle className="text-whiteShade  mb-2 font-sans ">
            Followers List
          </DialogTitle>
          <Separator className="bg-[#1d1f2a] mb-2" />
        </DialogHeader>
        <section className="flex flex-col gap-y-3 mb-3 ">
          {followRequestsList.map((followRequest) => (
            <FollowRequest
              isProfileOfAuth={isProfileOfAuth}
              key={followRequest.follower.id}
              followerOrFollowed={followRequest.follower}
              profileId={profileId}
              type="accepted_followers"
            />
          ))}
        </section>
      </DialogContent>
    </Dialog>
  );
};
export default Followers;
