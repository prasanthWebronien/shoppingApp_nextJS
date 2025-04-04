'use client'


import Image from "next/image";

const HeaderPage = () => {
    return (
        <div className="bg-white text-black flex justify-center items-center pt-10 relative w-full">
        <Image
          src='/images/leftArrowGreen.png'
          alt='left'
          className="w-7 h-7 absolute left-4 top-8"
          width={1000}
          height={1000}
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