"use client";
import { useEffect } from "react";

import ExplorePost from "@/components/Generalcomponents/ExplorePost";
import { TExplorePost } from "@/lib/types/Post";
import PostSearch from "./PostSearch";
import { useGetExplorePosts } from "@/lib/react-query/queries";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/react-query/queryKeys";
import { Button } from "@/components/ui/button";
import LoadingSvg from "@/components/Generalcomponents/LoadingSvg";
import { UseAuthenticatedUser } from "@/lib/store/store";
import { useAuth } from "@clerk/nextjs";
import Nodata from "@/components/Generalcomponents/Nodata";

const ExplorePostsContainer = ({
  posts,
  search,

}: {
  posts: TExplorePost[];
  search?: string;

}) => {
  const { getToken } = useAuth();
  
  
  const queryClient = useQueryClient();
  const { authenticatedUser } = UseAuthenticatedUser();

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useGetExplorePosts(
      posts,
      search,
      getToken,
      authenticatedUser?.id.toString()
    );
  const scrollPosts: TExplorePost[] = data?[].concat(...data.pages):[];

  useEffect(() => {
    queryClient.setQueriesData(
      {
        queryKey: [
          QUERY_KEYS.GET_EXPLORE_POSTS,
          authenticatedUser?.id.toString(),
        ],
      },
      (data: any) => {
       
       
        return {
          pages: [posts],
          pageParams: [1],
        };
      }
    );
  }, [posts, search]);

  return (
    <section className="w-full mb-8">
      <PostSearch search={search} />
      <div className=" mt-16 flex justify-between items-center">
        <h2 className=" text-3xl font-medium font-sans text-whiteShade  ">
          {" "}
          Posts
        </h2>
        {/*<SelectExplorePosts />*/}
      </div>
      {scrollPosts.length!=0?<section className="grid  gap-x-2 gap-y-2 py-10 justify-items-center max-w-full grid-cols-1 sm:grid-cols-3  md:grid-cols-2 lg:grid-cols-3 mx-auto">
        {scrollPosts.map((scrollPost: TExplorePost) => (
          <ExplorePost key={scrollPost.id} post={scrollPost} />
        ))}
      </section>
      :<Nodata/>}
      <div className="w-full text-center">
        {hasNextPage &&
          (isFetchingNextPage ? (
            <LoadingSvg className="w-20 h-20" />
          ) : (
            <Button
              className="text-base px-8 py-6"
              onClick={() => fetchNextPage()}
            >
              Load More
            </Button>
          ))}
      </div>
    </section>
  );
};

export default ExplorePostsContainer;
