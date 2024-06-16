
import { ImagePlus } from 'lucide-react'
import PostForm from './components/PostForm'


const page = async() => {


  
  return (
  <article className=' px-10 lg:px-20 pt-8 pb-44 md:py-8 '>
  <h1 className=" mb-14 font-sans  text-whiteShade text-4xl font-bold w-full flex items-center gap-x-3 ">
  <ImagePlus className='h-9 w-9 text-whiteShade'/> Create Post</h1>

  <PostForm />

  



  </article>
  )
}

export default page