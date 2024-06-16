
import { getServerSidePostDetails } from "@/lib/api/serverSideRequests";
import { TPostDetails } from "@/lib/types/Post";
import { auth } from "@clerk/nextjs";
import ModalPostInfos from "./ModalPostInfos";
import PostInfosInsideModal from "./PostInfosInsideModal";

const page = async ({ params: { postId } }: { params: { postId: string } }) => {
 
  const { getToken } = auth();
  const token = await getToken();

  const post: TPostDetails = await getServerSidePostDetails(postId, token);

  return (
    <ModalPostInfos>
      {postId && (
        <PostInfosInsideModal  postId={postId} post={post} />
      )}
    </ModalPostInfos>
  );
};

export default page;
