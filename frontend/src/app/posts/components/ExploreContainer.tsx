"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TExplorePost } from "@/lib/types/Post";
import ExplorePostsContainer from "./ExplorePostsContainer";
import ExploreUsersContainer from "./ExploreUsersContainer";
import { TExploreUser } from "@/lib/types/user";
import { useRouter } from "next/navigation";

const ExploreContainer = ({
    posts,
    search,
    users,

  }: {
    posts: TExplorePost[];
    users:TExploreUser[];
    search?: string;
  }) => {
    const router = useRouter();

  return (
    <Tabs defaultValue="posts" className="pl-[9px] w-full ">
      <TabsList className="w-52 font-sans absolute right-16 top-9 bg-transparent !text-whiteShade h-10 p-0">
        
        <TabsTrigger
          className="w-1/2 rounded-r-none rounded-l-xl h-full bg-secondary active:bg-white !text-whiteShade data-[state=active]:bg-primary "
          value="posts"
          onClick={()=>router.push("/posts")}
        >
          Posts
        </TabsTrigger>
        <TabsTrigger
          className="w-1/2 rounded-l-none rounded-r-xl h-full bg-secondary !text-whiteShade data-[state=active]:bg-primary "
          value="users"
          onClick={()=>router.push("/posts")}
        >
          Users
        </TabsTrigger>
      </TabsList>
      <TabsContent value="posts">
      <ExplorePostsContainer  search={search} posts={posts}/>
      
      </TabsContent>
      <TabsContent value="users">
        <ExploreUsersContainer  initialUsers={users} search={search} />
        
      </TabsContent>
    </Tabs>
  );
};

export default ExploreContainer;
