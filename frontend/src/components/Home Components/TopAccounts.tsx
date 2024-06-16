"use client"
import TopAccount from './TopAccount'
import { TopUser } from '@/lib/types/user'
import { useGetTopUsers } from '@/lib/react-query/queries'
import { useAuth } from '@clerk/nextjs'

const TopAccounts = ({InitialtopUsers,userId,token}:{InitialtopUsers:TopUser[],userId:string,token:string|null}) => {
  const { getToken } = useAuth();
  const {data:users}=useGetTopUsers(userId,InitialtopUsers,getToken) as {data:TopUser[]}
  return (
    <section className='overflow-y-scroll customScrollBar_dark   w-full mt-[110px] hidden lg:block'>

    <section className='grid grid_auto pt-[62px] pb-4 gap-y-5 gap-x-1 pl-[18px] pr-0 justify-items-center  '>
      {users.slice(0,6).map((user)=><TopAccount key={user.id} user={user} />)}
      
     
      
     
    </section>

    </section>
  )
}

export default TopAccounts