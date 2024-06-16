
import { AuthenticateWithRedirectCallback } from '@clerk/nextjs'

const page = () => {
 
  return (
    <AuthenticateWithRedirectCallback  redirectUrl={"/googleAuthLoader"}/>
  )
}

export default page