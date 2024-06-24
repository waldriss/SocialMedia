import ExplorePost from "@/components/Generalcomponents/ExplorePost";
import Nodata from "@/components/Generalcomponents/Nodata";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TUserPost } from "@/lib/types/user";
import React from "react";

const ProfilePosts = ({
  userPosts,
  userSharedPosts,
}: {
  userPosts: TUserPost[];
  userSharedPosts: TUserPost[];
}) => {
  return (
    <section className="pl-3 pr-1  sm:pl-8 sm:pr-6 lg:pl-[52px]  lg:pr-12">
      <Tabs defaultValue="allPosts" className="w-full text-center  mt-14">
        <TabsList className=" w-[250px] sm:w-[400px] font-sans  mx-auto bg-transparent !text-whiteShade h-11 sm:h-14 p-0">
          <TabsTrigger
            className="text-xs sm:text-base w-1/2 rounded-r-none rounded-l-3xl h-full bg-secondary hover:bg-[#2e3142] active:bg-white !text-whiteShade data-[state=active]:bg-primary "
            value="allPosts"
          >
            Posts
          </TabsTrigger>
          <TabsTrigger
            className="text-xs sm:text-base w-1/2 rounded-l-none rounded-r-3xl h-full bg-secondary hover:bg-[#2e3142] !text-whiteShade data-[state=active]:bg-primary "
            value="sharedPosts"
          >
            Saved Posts
          </TabsTrigger>
        </TabsList>
        <TabsContent value="allPosts">
          {userPosts?.length != 0 ? (
            <div className="my-14 grid grid-cols-3 gap-x-[2px] gap-y-[2px]   justify-items-center max-w-full mx-auto rounded-[50px] overflow-hidden ">
              {userPosts?.map((userPost) => (
                <ExplorePost
                  key={userPost.id}
                  post={userPost}
                  subclass="!rounded-none "
                  isprofilePage
                />
              ))}
            </div>
          ) : (
            <Nodata className="pt-14" />
          )}
        </TabsContent>
        <TabsContent value="sharedPosts">
          {userSharedPosts?.length != 0 ? (
            <div className="my-14 grid grid-cols-3 gap-x-[2px] gap-y-[2px]   justify-items-center max-w-full mx-auto rounded-[50px] overflow-hidden">
              {userSharedPosts?.map((userSharedPost) => (
                <ExplorePost
                  key={userSharedPost.id}
                  post={userSharedPost}
                  subclass="!rounded-none "
                  isprofilePage
                />
              ))}
            </div>
          ) : (
            <Nodata className="pt-14" />
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default ProfilePosts;
