import Image from 'next/image'
import loading from '@public/svgs/Dual Ring-0.7s-200px.svg'
import whiteLoading from '@public/svgs/loadingWhite.svg'
const LoadingSvg = ({className,isWhite}:{className?:string,isWhite?:boolean}) => {
    return (
      !isWhite?
      <Image className={`${className} mx-auto`} height={250} width={250} src={loading.src} alt={loading.src}/>
      :
      <Image className={`${className} mx-auto`} height={250} width={250} src={whiteLoading.src} alt={whiteLoading.src}/>

      )
  }

export default LoadingSvg