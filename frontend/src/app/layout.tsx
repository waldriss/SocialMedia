import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Generalcomponents/Providers";
import ResizableProvider from "@/components/Generalcomponents/ResizableProvider";
import { Toaster } from "@/components/ui/sonner";
import { Montserrat, Open_Sans } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });


const open_Sans=Open_Sans({subsets:["latin"],display:'swap',
variable:'--font-open-sans-mono',weight:["300","400","700","500","600","800"]});

const montserrat=Montserrat({subsets:["latin"],display:"swap",variable:"--font-montserrat-mono",weight:["300","400","700","900","100","200","500","600","800"]});


export const metadata: Metadata = {
  title: "Imgram",
  description: "Comprehensive social networking site with secure authentication",
};

export default function RootLayout({
  children,
  modal
}: Readonly<{
  children: React.ReactNode;
  modal:React.ReactNode;
}>) {


  
  return (
    <html lang="en">
     
      <body className={`${inter.className} ${montserrat.variable} ${open_Sans.variable} h-full`}>
        <Providers>
          <ResizableProvider>
            {children}
            {modal}
          </ResizableProvider>
          
               
          <Toaster  />
        </Providers>
        

      </body>
     
     
          

     
    </html>
  );
}
