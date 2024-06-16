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

const FollowRequestsList = ({
  followRequestsList,
  profileId,
}: {
  followRequestsList: FollowedRequest[];
  profileId: number;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative">
          <Button className="relative hidden lg:inline-flex bg-secondary hover:bg-[#2e3142] rounded-full py-6 px-6">
            <UsersRound className="mr-2 h-5 w-6" />
            <span className="text-base font-sans"> Follow requests </span>
            {followRequestsList.length > 0 && (
              <span className="absolute text-[12px] -bottom-1 -right-1 bg-primary rounded-full flex justify-center items-center h-5 w-5">
                {followRequestsList.length}
              </span>
            )}
          </Button>
          <UsersRound className="inline-block lg:hidden text-whiteShade cursor-pointer w-8 h-8 md:w-9 md:h-9" />
          {followRequestsList.length > 0 && (
            <span className="absolute text-[12px] -bottom-2 -right-2 text-whiteShade bg-primary rounded-full flex lg:hidden justify-center items-center h-5 w-5">
              {followRequestsList.length}
            </span>)}
        </div>
      </DialogTrigger>
      <DialogContent className="!rounded-lg    min-w-[80%] sm:h-auto sm:max-h-[600px] lg:min-w-[750px] overflow-y-scroll border-none text-white  customScrollBar_dark bg-gradient-to-t from-backgroundgrad1 to-backgroundgrad2 ">
        <DialogHeader>
          <DialogTitle className="text-whiteShade mb-3 font-sans ">
            Follow requests List
          </DialogTitle>
          <Separator className="bg-[#1d1f2a] mb-2" />
        </DialogHeader>
        <section className="flex flex-col gap-y-3 mb-3">
          {followRequestsList.map((followRequest) => (
            <FollowRequest
              key={followRequest.follower.id}
              followerOrFollowed={followRequest.follower}
              profileId={profileId}
              type="pending"
              isProfileOfAuth
            />
          ))}
        </section>
      </DialogContent>
    </Dialog>
  );
};

export default FollowRequestsList;
