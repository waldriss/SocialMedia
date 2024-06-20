"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";

import { cn, generateUniqueId } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Button, buttonVariants } from "../ui/button";
import { toast } from "sonner";

interface NavProps {
  isCollapsed: boolean;
  links: {
    title: string;
    label?: string;
    icon: LucideIcon;
    variant: "default";
    active: boolean;
    url: string;
  }[];
}


export function Nav({ links, isCollapsed }: NavProps) {

  const toastContent = (message: string, id: string) => (
    <div className="w-full">
      <h4 className="font-sans font-semibold text-whiteShade text-base ">
        Futur features
      </h4>
      <div className="font-sans-serif2 flex items-center justify-between w-full">
        <p className="text-muted-foreground text-[0.95rem]">{message}</p>
        <Button
          className="font-sans"
          onClick={() => toast.dismiss(id)}
          size={"sm"}
        >
          Undo
        </Button>
      </div>
    </div>
  );
  const handleclickOnMessages=(event:any)=>{

    event.preventDefault();
    const id = generateUniqueId();
    toast(
      toastContent(
        "real-time chat feature is not yet available.",
        id
      ),
      { position: "bottom-center", id: id }
    );

  }
  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-6 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) =>
          isCollapsed ? (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                onClick={link.title==="Messages" ? handleclickOnMessages : undefined} 

                  href={link.url}
                  className={cn(
                    buttonVariants({ variant: link.variant, size: "icon" }),
                    "h-12 w-12   rounded-[5px]",
                    link.variant === "default" &&
                      link.active &&
                      "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white",
                    !link.active &&
                      "bg-transparent text-whiteShade hover:bg-[rgb(255,255,255,0.02)]"
                  )}
                >
                  <link.icon className="md:stroke-1 lg:stroke-2 h-6 w-6" />
                  <span className="sr-only">{link.title}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {link.title}
                {link.label && (
                  <span className="ml-auto text-muted-foreground">
                    {link.label}
                  </span>
                )}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
            onClick={link.title==="Messages" ? handleclickOnMessages : undefined} 

              key={index}
              href={link.url}
              className={cn(
                buttonVariants({ variant: link.variant, size: "lg" }),
                link.variant === "default" &&
                "justify-start min-w-0 font-sans font-medium pl-5 md:text-sm lg:text-base  py-7 rounded-[5px]",
                !link.active &&
                  "bg-transparent text-whiteShade hover:bg-[rgb(255,255,255,0.02)]"
              )}
            >
              <link.icon className="mr-3 md:stroke-1 lg:stroke-2 min-h-6 min-w-6 w-6 h-6" />
              {link.title}
              {link.label && (
                <span
                  className={cn(
                    "ml-auto",
                    link.variant === "default" &&
                      link.active &&
                      "text-background dark:text-white"
                  )}
                >
                  {link.label}
                </span>
              )}
            </Link>
          )
        )}
      </nav>
    </div>
  );
}
