"use client"
import { useEffect } from 'react';
import PostSearch from './PostSearch';
import { useGetExploreUsers } from '@/lib/react-query/queries';
import ExploreUser from './ExploreUser';
import LoadingSvg from '@/components/Generalcomponents/LoadingSvg';
import { Button } from '@/components/ui/button';
import { TExploreUser } from '@/lib/types/user';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/react-query/queryKeys';
import { UseAuthenticatedUser } from '@/lib/store/store';
import { useAuth } from '@clerk/nextjs';

const ExploreUsersContainer = ({
    initialUsers,
    search,

  }: {
    search?: string;
    initialUsers:TExploreUser[],
  }) => {
    const {authenticatedUser}=UseAuthenticatedUser();
    const { getToken } = useAuth();

  const { data, hasNextPage, fetchNextPage,isFetchingNextPage} = useGetExploreUsers(initialUsers,
    search,getToken,authenticatedUser?.id.toString()
  );
  
  const exploreUsers:TExploreUser[]=data?[].concat(...data.pages):[];
  
  
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.setQueriesData(
      { queryKey: [QUERY_KEYS.GET_EXPLORE_USERS] },
      (data: any) => {
        return {
          pages: initialUsers,
          pageParams: [1],
        };
      }
    );
  }, [initialUsers,search]);

  return (
    <section className="w-full mb-8">
    <PostSearch  search={search} />
    <div className=" mt-16 flex justify-between items-center">
      <h2 className=" text-3xl font-medium font-sans text-whiteShade  "> Users</h2>
      
    </div>
    <section className="flex flex-col gap-y-3 mb-3 py-10   mx-auto">
      {exploreUsers.map((exploreUser: TExploreUser) => (
        <ExploreUser key={exploreUser.id} exploreUser={exploreUser} />
      ))}
    </section>
    <div className="w-full text-center">
      {hasNextPage &&
        (isFetchingNextPage ? (
          <LoadingSvg className="w-20 h-20" />
        ) : (
          <Button
            className="text-base px-8 py-6"
            onClick={() => fetchNextPage()}
          >
            Load More
          </Button>
        ))}
    </div>
  </section>
  )
}

export default ExploreUsersContainer