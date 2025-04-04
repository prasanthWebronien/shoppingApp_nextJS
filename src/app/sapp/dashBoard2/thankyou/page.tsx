'use client'

import Image from "next/image"
import { useRouter } from "next/navigation"

const ThankyouPage = () => {

    const route = useRouter();
    return (
        <div className="bg-white text-black flex flex-col p-5 justify-between items-center h-[100dvh] py-10">
            <div className="flex flex-col gap-1 justify-center items-center w-full">
                <Image src='/images/24sjuIcon.webp' alt='24SJU' width={1000} height={1000} className="w-20 h-20 mb-5" />
                <strong>Thank You</strong>
                <span>for shopping at 24 sju</span>
            </div>

            <div className="flex flex-col gap-3 justify-center items-center w-full">
                <Image src='/images/circle-wavy-check-fill.png' alt='done' width={1000} height={1000} className="w-20 h-20" />
                <strong>Your purchase is completed</strong>
            </div>

            <div className="flex flex-col gap-3 justify-center items-center w-full">
                <button className="bg-buttonColor text-white text-center  w-[250px] py-3 rounded-full "
                onClick={()=>route.push('')}>See receipt</button>
                <button className="bg-yellow-500 text-white text-center w-[250px] py-3 rounded-full" 
                onClick={()=>route.push('/sapp/dashBoard2')}>Go to Dhashboard</button>
            </div>
        </div>
    )
}

export default ThankyouPage;