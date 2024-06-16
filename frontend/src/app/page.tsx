import { auth } from "@clerk/nextjs";

import { IPost } from "@/lib/types/Post";
import { TopUser } from "@/lib/types/user";
import PostsContainer from "@/components/Home Components/PostsContainer";
import TopAccountsContainer from "@/components/Home Components/TopAccountsContainer";
import LoadingSvg from "@/components/Generalcomponents/LoadingSvg";
import { Suspense } from "react";
import HomeHeader from "@/components/Home Components/HomeHeader";



export default async function Home() {
  const {sessionClaims}=auth()
  
  let posts: IPost[] = [];
  let TopUsers: TopUser[] = [];
 
 
  const LoadingPosts = (
    <div className="h-screen w-full lg:min-w-[73%] lg:w-[73%]  xl:min-w-[65%] xl:w-[65%] ">
      <LoadingSvg className="h-32 w-32 mt-32 " />
    </div>
  );
  const LoadingTopAccounts = (
    <div className="w-full hidden lg:block">
      <LoadingSvg className="h-32 w-32 mt-32 " />
    </div>
  );

  return (
    <section className="relative">
      <div className="  absolute  w-full z-20 hidden md:flex">
      {sessionClaims?.userId && ( <HomeHeader userId={sessionClaims.userId}/>)}

      
      </div>

      <section className="flex flex-shrink h-screen !pb-0  sm:pb-2">
        {sessionClaims?.userId && (
          <>
            <Suspense fallback={LoadingPosts}>
              <PostsContainer userId={sessionClaims.userId} />
            </Suspense>
            <Suspense fallback={LoadingTopAccounts}>
              <TopAccountsContainer userId={sessionClaims.userId} />
            </Suspense>
          </>
        )}
      </section>
    </section>
  );
}
