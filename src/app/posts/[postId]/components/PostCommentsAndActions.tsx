import { TPostDetails } from "@/lib/types/Post";
import Comments from "./Comments";
import PostActions from "./PostActions";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { UseMutateAsyncFunction, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { generateUniqueId } from "@/lib/utils";
import { QUERY_KEYS } from "@/lib/react-query/queryKeys";
import { useRouter } from "next/navigation";
import { PencilRuler } from "lucide-react";
import AlertDelete from "./AlertDelete";

const PostCommentsAndActions = ({
  post,
  deletePost,
  ismodal
}: {
  ismodal?:boolean;
  post: TPostDetails;
  deletePost: UseMutateAsyncFunction<
    any,
    Error,
    {
      postId: number;
      userId: string;
    },
    unknown
  >;
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const handleDelete = async () => {
    const deletedPost = await deletePost({
      postId: post.id,
      userId: post.posterId.toString(),
    });
    if (deletedPost) {
      if(ismodal) router.back(); else router.push("/");
      
      const id = generateUniqueId();
      toast(toastContent("Post deleted successfully", id), {
        position: "bottom-center",
        id: id,
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST, post.id.toString()],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_EXPLORE_POSTS, post.posterId.toString()],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_HOME_POSTS, post.posterId.toString()],
      });
    }
  };
  const toastContent = (message: string, id: string) => (
    <div className="w-full">
      <h4 className="font-semibold font-sans text-whiteShade text-base ">
        Notification
      </h4>
      <div className="flex font-sans-serif2 items-center justify-between w-full">
        <p className="text-muted-foreground text-[0.95rem]">{message}</p>
        <Button
          className="font-sans"
          onClick={() => toast.dismiss(id)}
          size={"sm"}
        >
          Undo
        </Button>
      </div>
    </div>
  );
  const { user } = useUser();
  return (
    <>
      <Comments comments={post.commented_posts} userId={user?.externalId} />
      <PostActions
        postId={post.id}
        userId={user?.externalId}
        likers={post.liked_posts}
        sharers={post.shared_posts}
      />
      {user?.externalId === post.posterId.toString() && (
        <div className="flex absolute font-sans right-2 top-8 sm:top-7 sm:right-5 gap-x-3 sm:gap-x-4">
          <PencilRuler
            className="w-6 h-6 sm:h-7 sm:w-7 text-primary cursor-pointer "
            onClick={() => router.push(`/postDetails/${post.id}`)}
          />

          <AlertDelete handleDelete={handleDelete} />
        </div>
      )}
    </>
  );
};

export default PostCommentsAndActions;
