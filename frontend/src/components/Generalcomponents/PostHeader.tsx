import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { IPoster } from '@/lib/types/Post'
import Link from 'next/link'
import Image from 'next/image'
import profilesvg from "@public/svgs/profile.svg"

const PostHeader = ({poster,posterId}:{poster:IPoster|undefined,posterId:number|undefined}) => {
  return (
    <Link href={"/profiles/"+posterId} className=" z-[5] flex items-center space-x-2 absolute px-4 py-2 sm:px-7 sm:py-3  mt-4 ml-4 sm:mt-12 sm:ml-12 rounded-full !border-borderPrimary glass2 ">
    <Avatar className='w-9 h-9 sm:w-10 sm:h-10'>
      <AvatarImage className="object-cover" src={poster?.userImage} />
      <AvatarFallback><Image alt=''  className='w-full h-full p-1 bg-borderPrimary' src={profilesvg.src} height={100} width={100}/></AvatarFallback>
    </Avatar>
    
    <div>
      <p className="text-xs sm:text-sm font-sans font-medium text-whiteShade leading-none">{poster?.name}</p>
      <p className="text-xs sm:text-sm font-sans text-whiteShade ">@{poster?.username}</p>
    </div>
    
  </Link>
  )
}

export default PostHeader