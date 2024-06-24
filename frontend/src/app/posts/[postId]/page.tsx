

import { getServerSidePostDetails } from '@/lib/api/serverSideRequests'
import { TPostDetails } from '@/lib/types/Post'
import PostInfosContainer from './components/PostInfosContainer'
import { auth } from '@clerk/nextjs'

const PostInfosPage = async({params:{postId}}:{params:{postId:string}}) => {
  const {getToken}=auth()
  const token=await getToken()

  const post:TPostDetails=await getServerSidePostDetails(postId,token);
 
  

  
  return (
    <article className='  pl-4 pr-3 sm:pl-8 sm:pr-6 xl:pl-5 xl:pr-3 pt-28 md:pt-10 pb-28 md:pb-6 '>
       
        {
          postId&&<PostInfosContainer  postId={postId}  post={post}/>
        }
      

        


    </article>
  )
}

export default PostInfosPage