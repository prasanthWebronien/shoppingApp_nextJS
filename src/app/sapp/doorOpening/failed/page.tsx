'use client'

import axios from "axios";
import Image from "next/image"
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useState, useEffect, useRef } from "react"
import UserIcon from "../../components/icons/UserIcon";
import ArrowLeftIcon from "../../components/icons/ArrowLeftIcon";
import { updateDoorOpenedSession } from "@/lib/auth/updateDoorOpenedSession";

const DoorOpening_Failed = () => {

    const maxRetries = 5;
    const router = useRouter();
    const retryRef = useRef(0);
    const [user, setUser] = useState<any>(null);
    const { data: session } = useSession();
    const [storeID, setStoreID] = useState<string>('');
    const apiUrl = process.env.NEXT_PUBLIC_APP_AUTH_API_URL
    const environment = process.env.NEXT_PUBLIC_APP_ENVIRONMENT
    const [accessToken, setAccessToken] = useState<string>('');
    const [refreshToken, setRefreshToken] = useState<string>('');
    const [doorOpeningLoder, setDoorOpeningLoder] = useState(false);

    useEffect(() => {
 
        setStoreID(localStorage.getItem('storeID') || '')
        setAccessToken(session?.user?.aToken ?? '');
        setRefreshToken(session?.user?.rToken ?? '');
        setUser(session?.user);
    }, []);

    const handleClickRetryBtn = () => {
        dooropening(accessToken, user, storeID);
    }

    const handleClickGoToBtn = () => {
        router.push('/sapp/stores');
    }

    const checkStatus = async (userId: string, taskId: string, storeID: string, aToken: string) => {
        try {
            const res = await axios.get(`${apiUrl}/storedatasync/erp-task/${userId}/${taskId}`,
                {
                    headers: {
                        Authorization: `Bearer ${aToken}`,
                        Accept: "application/json",
                        env: environment
                    }
                }
            );
            let doorStatus = res.data.status;
            
            if (doorStatus === "new") {
                setTimeout(checkStatus, 1000);
            } else if (doorStatus === "done") {
                setDoorOpeningLoder(false);
                await updateDoorOpenedSession(true);
                localStorage.removeItem('nearByStore');
                router.push('/sapp/products');
            } else if (doorStatus === "banned") {
                setDoorOpeningLoder(false);
                router.push('banned');
            } else {
                setDoorOpeningLoder(false);
            }
        } catch (err: any) {
            if (err.response && err.response.status === 404 && retryRef.current < maxRetries) {
                retryRef.current += 1;
                setTimeout(checkStatus, 1000);
            } else {
                // Show "Try again" message
            }
        }
    };

    const dooropening = async (aToken: string, user: any, storeID: string) => {
     
        try {
            let ipResponse = await axios.get('https://api.ipify.org?format=json');
            const ip = ipResponse.data.ip;

            const response = await axios.post(`${apiUrl}/storedatasync/erp-task`, {
                storeId: storeID,
                userId: user.id,
                goal: "door-open",
                details: {
                    device_type: user.device_type,
                    personalNumber: user.personalNumber,
                    name: user.fname,
                    givenName: user.fname,
                    surname: 4,
                    ipAddress: ip
                }
            },
                {
                    headers: {
                        Authorization: `Bearer ${aToken}`,
                        Accept: "application/json",
                        env: environment
                    }
                }
            );

            if (response.status === 201) {
                let userID = response.data.userId;
                let taskID = response.data.id
                checkStatus(userID, taskID, storeID, aToken);
            }
        } catch (error) {
            console.error('Error in dooropening:', error);
        }
    };

    return (

        <>
        {
            doorOpeningLoder ? (
                <div className="h-[100dvh] flex flex-1 items-center justify-center bg-white">
                        <div className="loader border-t-4 border-buttonColor rounded-full w-12 h-12 animate-spin"></div>
                    </div>
            ) : (
                <div className="h-[100dvh] w-full bg-white px-5 py-2 flex flex-col justify-between relative">
                <div className="flex text-buttonColor items-center justify-between h-20">
                    <ArrowLeftIcon className="text-buttonColor" />
                    <UserIcon className="text-buttonColor w-10 h-10" onClick={() => router.push(`/sapp/settings`)} />
                </div>
    
    
                <div className="flex flex-col items-center gap-3 mt-10">
                    <Image src='/images/DoorNotOppend.png' alt='door not opened' className="w-32 h-36" width={1000} height={1000} />
                    <strong className="text-black text-2xl font-semibold">Door Opening Failed!</strong>
                    <h1 className="text-black text-xl font-semibold">Kindly Try again</h1>
                </div>
    
    
                <div className="flex flex-col gap-3 mb-16">
                    <button onClick={handleClickRetryBtn} className="px-10 py-4 bg-buttonColor text-white font-poppins rounded-full text-lg">Retry</button>
                    <button onClick={handleClickGoToBtn} className="px-10 py-4 bg-yellow-500 text-white font-poppins rounded-full text-lg">Go to Dashboard</button>
                </div>
            </div>
            )
        }
        </>
     
    )
}

export default DoorOpening_Failed;