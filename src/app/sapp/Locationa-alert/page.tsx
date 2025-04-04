'use client'

import Image from "next/image";

const LocationPage=()=>{
    return(
        <div className="h-[100dvh] w-full flex flex-col bg-white">

            <div className="h-20 rounded-b-2 bg-buttonColor mb-5 rounded-b-3xl">
            </div>

            <div className="flex flex-col justify-center items-center py-5 h-2/3 gap-5 tracking-wider">
                <Image src='/images/noLocation.png' alt='' className="rounded-fully w-72 h-72" height={1000} width={1000}/>
                <strong className="text-red-500 text-3xl font-bold">No Access to Location</strong>
                <strong className="text-black text-center">Please Enable location permission to unlock all the Awesome features of our App!</strong>
            </div>

            <div className="flex-1 flex justify-center items-center">
                <button className="bg-redColor text-white rounded-fully px-16 py-5 rounded-full text-xl tracking-widest">
                   Enable Location
                </button>
            </div>
        </div>
    )
}

export default LocationPage;