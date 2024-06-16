import Image from 'next/image'
import React from 'react'
import nodatasvg from'@public/svgs/nodata.svg'
const Nodata = ({className,svgClassName}:{className?:string,svgClassName?:string}) => {
  return (
    <div className={'w-full flex flex-col items-center justify-start '+className}>
   <Image src={nodatasvg.src} className={'mt-8 '+svgClassName} alt='' height={150} width={150} />
   <h3 className='text-xl font-sans-serif text-[#9086a1] font-bold pt-5'> Looks Like there are no posts here.</h3>
    </div>
 
  )
}

export default Nodata