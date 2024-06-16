import { ImagePlus } from 'lucide-react';
import PostForm from '../components/PostForm';
import { getServerSidePostDetails } from '@/lib/api/serverSideRequests';
import { TPostDetails } from '@/lib/types/Post';
import { auth } from '@clerk/nextjs';

const Page = async({params:{postId}}:{params:{postId:string}}) => {
  const {getToken}=auth()
  const token=await getToken()

  const post:TPostDetails=await getServerSidePostDetails(postId,token);
  return (
    <article className=' px-10 lg:px-20 pt-8 pb-44 md:py-8'>
    <h1 className=" mb-14  text-whiteShade text-4xl font-bold font-sans w-full flex items-center gap-x-3 ">
    <ImagePlus className='h-9 w-9 text-whiteShade'/> Edit Post</h1>
  
    <PostForm post={post}/>
  
    
  
  
  
    </article>
  )
}

export default Page