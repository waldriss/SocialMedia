import { useSharePost, useUnsharePost } from "@/lib/react-query/mutations";

import { Sharer } from "@/lib/types/Post";
import { useAuth, useUser } from "@clerk/nextjs";
import { BookmarkPlus } from "lucide-react";

const Share = ({
  sharers,
  postId,
  className,
}: {
  sharers: Sharer[];
  postId: number;
  className?: string;
}) => {
  const { user } = useUser();

  const { getToken } = useAuth();

  const checkIsShared = sharers.some(
    (sharer) => sharer.sharerId.toString() === user?.externalId
  );

  const { mutateAsync: sharePost, isPending: isSharing } = useSharePost(
    user?.externalId ? user.externalId : "",
    getToken
  );
  const { mutateAsync: unsharePost, isPending: isUnsharing } = useUnsharePost(
    user?.externalId ? user.externalId : "",
    getToken
  );

  const handleClick = async (e: any) => {
    e.preventDefault();
    if (!isSharing && !isUnsharing) {
      if (user?.externalId) {
        if (!checkIsShared) {
          await sharePost({
            postId: postId,
            userId: parseInt(user.externalId),
          });
        } else {
          await unsharePost({
            postId: postId,
            userId: parseInt(user.externalId),
          });
        }
      }
    }
  };
  return (
    <BookmarkPlus
      onClick={handleClick}
      className={` ${className} ${
        checkIsShared ? "fill-primary stroke-primary" : "stroke-whiteShade"
      } transform active:scale-75 transition-transform cursor-pointer `}
    />
  );
};

export default Share;
