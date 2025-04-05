'use client'

import React, { useEffect, useState, useRef } from "react"
import Image from "next/image"
import axios from "axios"
import { Shop } from "@/types/product";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { updateDoorOpenedSession } from "@/lib/auth/updateDoorOpenedSession";
import { fetchStoresUtils } from '@/utils/helpers';
import { refreshSession } from "@/lib/auth/refreshSession";
const DoorOpening = () => {
    const maxRetries = 5;
    const retryRef = useRef(0);
    const [status, setStatus] = useState("checking");
    const router = useRouter();
    const { data: session } = useSession();
    const [store, setStore] = useState<Shop | null>(null);
    const [position, setPosition] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    const swipeContainerRef = useRef<HTMLDivElement | null>(null);
    const apiUrl = process.env.NEXT_PUBLIC_APP_AUTH_API_URL
    const environment = process.env.NEXT_PUBLIC_APP_ENVIRONMENT
    const distance = process.env.NEXT_PUBLIC_APP_DISTANCE;
    const [doorOpeningLoder, setDoorOpeningLoder] = useState(false);
    const [accessToken, setAccessToken] = useState<string>('');
    const [refreshToken, setRefreshToken] = useState<string>('');
    const [storeID, setStoreID] = useState<string>('');
    const [openingDoor, setOpeningDoor] = useState(false);

    const handleTouchStart = () => {
        setIsSwiping(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isSwiping) return;
        const touch = e.touches[0];
        const containerWidth = swipeContainerRef.current?.offsetWidth || 0;
        const maxMove = containerWidth - 80;
        const moveX = Math.min(maxMove, Math.max(0, touch.clientX - 50));

        setPosition(moveX);
    };

    const handleTouchEnd = () => {
        setIsSwiping(false);
        const containerWidth = swipeContainerRef.current?.offsetWidth || 0;
        if (position >= containerWidth - 80) {
            console.log("Swipe completed! Triggering function...");
            onSwipeComplete();
        }

        setTimeout(() => setPosition(0), 300);
    };

    const onSwipeComplete = () => {
        const user = session?.user
        dooropening(accessToken, user, storeID, refreshToken);
    };

    const checkStatus = async (userId: string, taskId: string, storeID: string, aToken: string, rToken: string) => {
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
                setTimeout(() => checkStatus(userId, taskId, storeID, aToken, rToken), 1000);
            } else if (doorStatus === "done") {
                await updateDoorOpenedSession(true);
                localStorage.setItem('doorStatus', 'opened');
                router.push('/sapp/dashBoard2');
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
            }

            if (err.status == 401) {
                const newToken: any = await refreshSession(refreshToken);
                if (newToken != null) {
                    checkStatus(userId, taskId, storeID, aToken, rToken);
                }
            }
        }
        finally {

        }
    };

    const dooropening = async (aToken: string, user: any, storeID: string, refreshToken: string) => {
        setOpeningDoor(true);
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
                checkStatus(userID, taskID, storeID, aToken, refreshToken);
            }
        } catch (error: unknown) {
            if (
                typeof error === "object" &&
                error !== null &&
                "status" in error &&
                (error as { status: number }).status === 401
            ) {
                const newToken: any = await refreshSession(refreshToken);
                if (newToken != null) {
                    dooropening(newToken.token, user, storeID, refreshToken);
                }
            }
            console.error('Error fetching products:', error);
        } finally {

        }
    };

    useEffect(() => {
        setDoorOpeningLoder(true);
        let doorStatus = localStorage.getItem('door') || '';
        let nearByStore = JSON.parse(localStorage.getItem('nearByStore') || 'null');
        setStore(nearByStore);

        setStoreID(localStorage.getItem('storeID') || '');
        let accessToken = session?.user?.aToken ?? '';
        let refreshToken = session?.user?.rToken ?? '';
        setAccessToken(session?.user?.aToken ?? '');
        setRefreshToken(session?.user?.rToken ?? '');
        findNeayByStore(accessToken, refreshToken);
    }, []);

    const findNeayByStore = async (accessToken: string, refreshToken: string) => {
        let stores = await fetchStoresUtils(accessToken, refreshToken, 'getCurrectLocatiow');
        let storeDistance = parseInt(stores?.[0]?.distance ?? "0");

        if (storeDistance <= Number(distance)) {
            setDoorOpeningLoder(false);
        } else {
            router.push('dashBoard2');
            localStorage.setItem('doorStatus', 'NotNear');
        }
    }

    return (
        <>
            {/* Main UI: Always Visible */}
            <div className="h-full flex flex-col justify-between bg-white text-black items-center p-5">
                <div className="flex flex-col items-center mt-32 gap-y-10">
                    <Image src='/images/smart-door.png' alt="" width={1000} height={1000} className="h-32 w-28" />
                    <div className="flex flex-col items-center justify-center gap-y-3">
                        <span>We have detected that you are close to </span>
                        <strong>24 SJU Shop</strong>
                        <strong className="text-xl font-bold">Chennai shop1</strong>
                    </div>
                </div>

                <div
                    ref={swipeContainerRef}
                    className="relative flex items-center justify-between text-white rounded-full bg-buttonColor px-10 py-7 w-full max-w-md mx-auto overflow-hidden"
                >
                    <div
                        className="absolute left-2 bg-white rounded-full p-1 cursor-pointer transition-transform duration-300"
                        style={{ transform: `translateX(${position}px)` }}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <Image src='/images/swipDoor.png' alt='door' className="w-12 h-12" width={1000} height={1000} />
                    </div>

                    <span className="w-full text-center text-xl font-bold">Swipe to open</span>
                </div>
            </div>

            {doorOpeningLoder && (
                <div className="h-[100dvh] flex flex-1 items-center justify-center bg-white">
                    <Image src='/images/loaderGreen.gif' alt='loader' height={1000} width={1000} className="w-20 h-20" />
                </div>
            )}

            {/* Overlay when `openingDoor` is true */}
            {openingDoor && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-5 pb-5 font-poppins z-[100]">
                    <div className="absolute bottom-0 left-0 w-full bg-white text-black rounded-t-lg flex flex-col gap-5 items-center justify-center p-5 h-40">
                        <Image
                            src="/images/loaderGreen.gif"
                            alt="loader"
                            className="h-10 w-10"
                            width={1000}
                            height={1000}
                        />
                        <strong className="w-full text-center font-semibold text-xl">Opening Door...</strong>
                    </div>
                </div>
            )}
        </>

    )
}

export default DoorOpening;