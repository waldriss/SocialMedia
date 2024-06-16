"use client"
import Comment from './Comment'
import { TComment } from '@/lib/types/Post'


const Comments = ({comments,userId}:{comments:TComment[],userId?: string | null}) => {

  return (
    <>
    <h3 className='text-whiteShade text-medium font-sans font-semibold pt-2'>Comments</h3>

    
    <section className='mt-2 overflow-y-scroll h-48 flex flex-col px-1 gap-y-3 customScrollBar_dark '>
        {comments.map((comment)=><Comment  key={comment.id} userId={userId} comment={comment}/>)}
        
      
    

    </section>
    </>
  )
}

export default Comments