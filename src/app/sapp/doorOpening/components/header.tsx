'use client'

import Image from "next/image";
import { useRouter } from "next/navigation";

const HeaderPage = () => {
  const router=useRouter();
  return (
        <div className="bg-white text-black flex justify-center items-center pt-10 relative w-full">
        <Image
          src='/images/leftArrowGreen.png'
          alt='left'
          className="w-9 h-9 absolute left-4 top-8"
          width={1000}
          height={1000}
          onClick={()=>router.push('/sapp/dashBoard2')}
        />
        <Image
          src='/images/24sjuIcon.webp'
          alt='24Sju'
          className="w-20 h-20"
          width={1000}
          height={1000}
        />
      </div>
      
    )
}

export default HeaderPage;