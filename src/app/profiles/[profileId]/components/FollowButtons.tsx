import { Button } from "@/components/ui/button";
import { useDeleteFollow, useFollow } from "@/lib/react-query/mutations";

import { FollowedRequest } from "@/lib/types/user";
import { useAuth } from "@clerk/nextjs";
import { UserRoundMinus, UserRoundPlus, UserRoundX } from "lucide-react";
import React, { useEffect, useState } from "react";

const FollowButtons = ({
  AuthId,
  profileId,
  AuthenticatedFollowRequest,
}: {
  AuthId: string;
  profileId: number;
  AuthenticatedFollowRequest?: FollowedRequest
}) => {
  const [followRequestState, setfollowRequestState] = useState<string|undefined>(
    "init"
  );
  const { getToken } = useAuth();
  const { mutateAsync: follow } = useFollow(getToken);

  const { mutateAsync: deletefollow } = useDeleteFollow(getToken);

  useEffect(() => {
   
      if (followRequestState != AuthenticatedFollowRequest?.state&&followRequestState==="init") {
        setfollowRequestState(AuthenticatedFollowRequest?.state);
   


    }
   
  }, [AuthenticatedFollowRequest]);

  const handleFollow = async () => {
    if (!followRequestState) {
        setfollowRequestState("pending");
       follow({
        followerId: parseInt(AuthId),
        followedId: profileId,
      });
    } else {
        setfollowRequestState(undefined);
       deletefollow({
        followerId: parseInt(AuthId),
        followedId: profileId,
      });
    }
  };

  const FollowRequestStateStyles = () => {
    if (followRequestState != AuthenticatedFollowRequest?.state&&followRequestState==="init")
      return "hidden";
    if (!followRequestState) {
      return "bg-primary";
    } else {
      if (followRequestState == "pending") {
        return "bg-primary";
      } else {
        return "bg-primary";
      }
    }
  };
  const checkFollowRequestState = () => {
    if (!followRequestState) {
      return (
        <>
          <UserRoundPlus className="mr-2 h-5 w-6" />
          <span className="text-sm sm:text-base"> Follow</span>
        </>
      );
    } else {
      if (followRequestState == "pending") {
        return (
          <>
            <UserRoundX className="mr-2 h-5 w-6" />
            <span className="text-sm sm:text-base"> Cancel Request</span>
          </>
        );
      } else {
        return (
          <>
            <UserRoundMinus className="mr-2 h-5 w-6" />
            <span className="text-sm sm:text-base"> Unfollow</span>
          </>
        );
      }
    }
  };

  return (
    <Button
      onClick={handleFollow}
      className={`${FollowRequestStateStyles()}  transform active:scale-75 transition-all duration-250 cursor-pointer rounded-full py-5 px-6 sm:py-6 sm:px-6 font-sans`}
    >
      {checkFollowRequestState()}
    </Button>
  );
};
export default FollowButtons;
