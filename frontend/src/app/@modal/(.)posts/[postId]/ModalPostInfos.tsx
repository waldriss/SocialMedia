"use client";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog2";
import { useMediaQuery } from "@/lib/hooks/mediaqueryhook";
import { useRouter } from "next/navigation";

import React from "react";

const ModalPostInfos = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(true);

  const router = useRouter();
  const close = () => {
    router.back();
    setOpen(false);
  };
  const ismd = useMediaQuery("(min-width: 768px)");
  return (ismd?
    <Dialog open={open}>
     
        <DialogContent
          className="min-w-[90%] xl:min-w-[80%] h-auto px-0 !py-0 bg-transparent"
          onPointerDownOutside={close}
        >
          {children}
        </DialogContent>
     
    </Dialog>:
    <article className='z-[8] bg-white h-screen   fixed top-0  sm:pl-8  xl:pl-5  pt-20  md:pb-6  bg-gradient-to-t from-backgroundgrad1 to-backgroundgrad2 '>
      <section className="overflow-y-scroll customScrollBar_dark pt-7  h-full w-full pb-32 pr-4 sm:pr-6 xl:pr-3 ">
      {children}
      </section>
    
    </article>
  );
};

export default ModalPostInfos;
