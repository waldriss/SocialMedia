import { TExplorePost } from '@/lib/types/Post'
import { getServerSideExplorePosts, getServerSideExploreUsers } from '@/lib/api/serverSideRequests'
import ExploreContainer from './components/ExploreContainer'
import { TExploreUser } from '@/lib/types/user'
import { auth } from '@clerk/nextjs'
import LoadingSvg from '@/components/Generalcomponents/LoadingSvg'



interface TSearchParams{
  search?:string
}
const PostsPage = async({searchParams}:{searchParams:TSearchParams}) => {
  const {getToken,sessionClaims}=auth()
  

  const token = await getToken()
   

 
  let posts:TExplorePost[]=[]
  let users:TExploreUser[]=[]

  if(sessionClaims?.userId&&token){

    const [postsResponse, usersResponse] = await Promise.all([
      getServerSideExplorePosts(searchParams.search || '',token,sessionClaims.userId),
      getServerSideExploreUsers(searchParams.search || '',token,sessionClaims.userId),
     
    ]);
    posts=postsResponse;
    users=usersResponse



  }
 
  
  

  return (
    <article className='pb-32 md:pb-0 relative px-10 sm:px-4 md:px-6 lg:px-10 xl:px-16 pt-28 md:pt-8 min-h-screen'>
     <h1 className=" pl-[9px] text-4xl font-sans font-bold w-full text-whiteShade"> Explore </h1>
     {sessionClaims?.userId&&token?<ExploreContainer  users={users} search={searchParams.search} posts={posts}/>:
      <LoadingSvg
      className={`block h-36 w-36 mt-16`}
    />}
     




    </article>
  )
}

export default PostsPage