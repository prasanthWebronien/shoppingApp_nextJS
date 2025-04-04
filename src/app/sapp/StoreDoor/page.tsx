'use client'

import axios from "axios";
import Image from "next/image";
import { Shop } from "@/types/product";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useEffect, useState, useRef } from "react";
import { fetchStoresUtils } from "@/utils/helpers";
import UserIcon from "../components/icons/UserIcon";
import ArrowLeftIcon from "../components/icons/ArrowLeftIcon";
import { updateDoorOpenedSession } from "@/lib/auth/updateDoorOpenedSession";


const loginData = {
    login_type: "bankid",
    login_id: "199609052387",
    login_name: "Jegan",
    device_type: "android",
};

const StoreDoor = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const [store, setStore] = useState<Shop | null>(null);
    const apiUrl = process.env.NEXT_PUBLIC_APP_AUTH_API_URL
    const environment = process.env.NEXT_PUBLIC_APP_ENVIRONMENT
    const [accessToken, setAccessToken] = useState<string>('');
    const [refreshToken, setRefreshToken] = useState<string>('');
    const [storeID, setStoreID] = useState<string>('');
    const [status, setStatus] = useState("checking");
    const retryRef = useRef(0);
    const maxRetries = 5;
    const [doorOpeningLoder, setDoorOpeningLoder] = useState(false);

    useEffect(() => {
        let doorStatus = localStorage.getItem('door') || '';
        let nearByStore = JSON.parse(localStorage.getItem('nearByStore') || 'null');
        setStore(nearByStore);
        
        if (!session?.user.fname && doorStatus != 'opened') {
            router.push("/sapp");
        }

        setStoreID(localStorage.getItem('storeID') || '');
        setAccessToken(session?.user?.aToken ?? '');
        setRefreshToken(session?.user?.rToken ?? '');
    }, []);

    const handleClick = async () => {
        const user = session?.user
        dooropening(accessToken, user, storeID);
    };

    const handleArrowClick = () => {
        if (session?.user.fname) {
            router.push('/sapp/dashBoard');
        }
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
            //  let doorStatus='done';

            if (doorStatus === "new") {
                setTimeout(() => checkStatus(userId, taskId, storeID, aToken), 1000);
            } else if (doorStatus === "done") {
                await updateDoorOpenedSession(true);
                localStorage.setItem('door', 'opened');
                router.push('/sapp/dashBoard');
            } else if (doorStatus === "banned") {
                router.push('/sapp/StoreDoor/banned');
            } else {
                router.push('/sapp/StoreDoor/doorOpening_failed');
            }

        } catch (err: any) {
            if (err.response && err.response.status === 404 && retryRef.current < maxRetries) {
                retryRef.current += 1;
                setTimeout(checkStatus, 1000);
            } else {
                setStatus("error");
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
                setDoorOpeningLoder(true);
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
                    <div className="h-[100dvh] flex flex-col px-10 pb-10 font-poppins bg-white">
                        {/* Header */}
                        <div className="flex text-buttonColor items-center justify-between relative h-20">
                            <ArrowLeftIcon className="text-buttonColor" onClick={handleArrowClick} />
                            <h1 className="text-black font-bold text-xl">Door Opening</h1>
                            <UserIcon className="text-buttonColor w-10 h-10" onClick={() => router.push(`/sapp/settings`)} />
                        </div>

                        {/* Remaining content - fills the rest of the screen */}
                        <div className="flex flex-col justify-between flex-1">
                            <div className="flex flex-col gap-3 items-center mt-10">
                                <strong className="text-2xl font-bold text-black">You are near to</strong>
                                <h1 className="text-2xl font-bold text-buttonColor">{store?.name}</h1>
                            </div>

                            <div className="flex flex-col items-center gap-5">
                                <Image src='/images/location.png' alt='' className="h-36 w-36" width={1000} height={1000} />
                                <h1 className="text-center text-lg font-bold text-black tracking-wider">Make sure you are in front of the store before you choose to Open Door</h1>
                            </div>

                            <div className='flex flex-col gap-5'>
                                <button className="bg-buttonColor px-10 py-4 text-white rounded-full" onClick={handleClick}
                                >Open Door</button>
                                <button className="bg-yellow-500 px-10 py-4 text-white rounded-full" onClick={() => router.push('stores')}>Find Other Stores</button>
                            </div>
                        </div>
                    </div>
                )
            }

        </>

    )
}

export default StoreDoor;