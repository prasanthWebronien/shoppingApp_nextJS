'use client'

import Image from "next/image";
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import React, { useState, useEffect } from "react";
import { checkStatus } from '@/utils/helpers';

const DispensingPage = () => {
    const route = useRouter();
    const { data: session } = useSession();

    useEffect(() => {
        const aToken = session?.user?.aToken ?? '';
        const rToken = session?.user?.rToken ?? '';
        const userID = session?.user.id ?? '';
        const responseID = localStorage.getItem('responseID') || '';

        callCheckOut(responseID,aToken,userID,rToken);
        route.push('dispenseAlert');
    }, [])

    const callCheckOut = async (responseID: string, aToken: string, userID: string, rToken: string) => {
        await checkStatus(responseID, aToken, userID, rToken);
    }

    return (
        <div className="h-[100dvh] flex flex-col justify-center items-center bg-white font-poppins gap-20">
            <Image src='/images/VM-GIF.gif' alt="vmGif" width={1000} height={1000} className="w-[400px] h-[390px]" />

            <div className="w-full flex flex-col justify-center items-center gap-5">
                <strong className="text-center text-buttonColor text-xl font-bold">Fueling your cravings, <br /> one at a time</strong>
                <Image src='/images/24sjuIcon.webp' alt='' className="w-20 h-20" width={1000} height={1000} />
            </div>
        </div>
    )
}

export default DispensingPage;