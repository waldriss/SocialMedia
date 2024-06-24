import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import Link from 'next/link'
import { buttonVariants } from '../ui/button'
import { cn } from '@/lib/utils'
import { TopUser } from '@/lib/types/user'
import Image from 'next/image'
import profilesvg from "@public/svgs/profile.svg"

const TopAccount = ({user}:{user:TopUser}) => {
  
  return (
    <section className='bg-bgShade1  lg:w-44 px-2  xl:min-w-[50%] py-8 rounded-3xl border border-1px border-borderPrimary'>
    <div className="flex flex-col gap-y-5  items-center justify-center space-x-2">
        <Avatar className='w-14 h-14 border-borderPrimary border-3 border-solid'>
        <AvatarImage className="object-cover" src={user.userImage} />
        <AvatarFallback><Image alt=''  className='w-full h-full p-1 bg-borderPrimary' src={profilesvg.src} height={100} width={100}/></AvatarFallback>
        </Avatar>
        
        <div className='flex flex-col font-sans justify-center items-center '>
        <p className="text-sm font-normal text-whiteShade text-center leading-none">{user.name}</p>
        <p className="text-sm text-muted-foreground">@{user.username}</p>
        </div>
        
        <Link href={"/profiles/"+user.id}
        className={cn(
            buttonVariants({ variant:'default', size: "lg" }),"bg-primary rounded-full font-sans")}>
                View 
        </Link>
       
    
    </div>
  

  

    </section>
  )
}

export default TopAccount