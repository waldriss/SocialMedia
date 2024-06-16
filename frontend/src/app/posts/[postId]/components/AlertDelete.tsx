import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2 } from 'lucide-react'
const AlertDelete = ({handleDelete}:{handleDelete: () => Promise<void>}) => {
  return (
    <AlertDialog>
    <AlertDialogTrigger asChild>
    <Trash2 className="w-6 h-6 sm:h-7 sm:w-7 text-primary cursor-pointer " />
    </AlertDialogTrigger>
    <AlertDialogContent className='border-none'>
      <AlertDialogHeader>
        <AlertDialogTitle className='text-whiteShade font-sans'>Are you sure?</AlertDialogTitle>
        <AlertDialogDescription className='font-sans-serif2'>
          This action cannot be undone. This will permanently delete your
          post.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel className='bg-secondary hover:bg-[#2e3142] hover:text-whiteShade font-sans text-whiteShade border-none'>Cancel</AlertDialogCancel>
        <AlertDialogAction className='border-none font-sans' onClick={handleDelete} >Continue</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
  )
}

export default AlertDelete