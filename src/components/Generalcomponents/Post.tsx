import PostHeader from './PostHeader'
import PostContent from './PostContent'
import { IPost } from '@/lib/types/Post'

const Post = ({post}:{post:IPost}) => {
  
  //border-[#111118]
  return (
    <section key={post?.id} className='  md:ml-0 relative flex flex-col justify-start items-start gap-y-3  bggradientPost w-full  border-solid  sm:border-b-1 border-borderPrimary shadow-sm '>
      <PostHeader poster={post.poster} posterId={post.posterId} />
      <PostContent post={post} /> 






    </section>
  )
}

export default Post