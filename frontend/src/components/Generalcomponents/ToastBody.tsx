import { generateUniqueId } from '@/lib/utils';
import React from 'react'
import { toast } from 'sonner';
import { Button } from '../ui/button';

const ToastBody = ({message,title,id}:{message:string,title:string,id:string}) => {
    
  return (
    <div className="w-full">
    <h4 className="font-semibold text-whiteShade text-base ">
      {title}
    </h4>
    <div className="flex items-center justify-between w-full">
      <p className="text-muted-foreground text-[0.95rem]">{message}</p>
      <Button onClick={() => toast.dismiss(id)} size={"sm"}>
        Undo
      </Button>
    </div>
  </div>
  )
}

export default ToastBody