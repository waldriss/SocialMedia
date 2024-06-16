"use client"
import { NextUIProvider } from '@nextui-org/system';
import React from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
const Providers = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {

    const queryClient = new QueryClient()

  return (
    <NextUIProvider className='h-full'>
      <ClerkProvider>
      <QueryClientProvider client={queryClient}>

      
        {children}
        </QueryClientProvider>
        </ClerkProvider>
    </NextUIProvider>


  )
}

export default Providers