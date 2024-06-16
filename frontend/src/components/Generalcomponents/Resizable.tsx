"use client";
import React from "react";
import { TooltipProvider } from "../ui/tooltip";
import { ResizablePanel, ResizablePanelGroup } from "../ui/resizable";
import SideNav from "./SideNav";
import { TNotification } from "@/lib/types/Notification";
import { AuthenticatedUser } from "@/lib/types/user";
import BottomNav from "./BottomNav";
import { TopNav } from "./TopNav";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";

interface ResizableProps {
  defaultLayout: number[] | undefined;
  defaultCollapsed: boolean;
  navCollapsedSize: number;
  notifications: TNotification[];
  token: string | null;
  authenticatedUser?: AuthenticatedUser;

  children: React.ReactNode;
}
const Resizable = ({
  defaultLayout = [265, 440],
  defaultCollapsed = false,
  navCollapsedSize,
  notifications,
  token,
  authenticatedUser,

  children,
}: ResizableProps) => {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes
          )}`;
        }}
        className="h-screen  items-stretch"
      >
        {pathname != "/auth" &&
          pathname != "/googleAuthLoader" &&
          pathname != "/ssocallback" && (
            <SideNav
              defaultLayout={defaultLayout}
              defaultCollapsed={defaultCollapsed}
              navCollapsedSize={4}
              notifications={notifications}
              initialAuthenticatedUser={authenticatedUser}
              token={token}
            />
          )}

        <ResizablePanel defaultSize={80} minSize={30}>
          <div
            id="scrollableResizable"
            className={`${pathname === "/"&&'hidescrollbar'} max-h-screen  min-h-screen overflow-auto sm:overflow-y-scroll customScrollBar_dark bg-gradient-to-t from-backgroundgrad1 to-backgroundgrad2`}
          >
            {pathname != "/auth" &&
              pathname != "/googleAuthLoader" &&
              pathname != "/ssocallback" && (
                <TopNav notifications={notifications} />
              )}

            {children}

            {pathname != "/auth" &&
              pathname != "/googleAuthLoader" &&
              pathname != "/ssocallback" && <BottomNav />}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
};

export default Resizable;
