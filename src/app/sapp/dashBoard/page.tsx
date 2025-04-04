'use client'

import Image from "next/image";
import { useRouter } from "next/navigation";
import { fetchStoresUtils } from "@/utils/helpers"
import React, { useState, useEffect, use } from "react";
import { CartProduct } from "@/types/product";
import { signIn, useSession, getSession } from "next-auth/react";


const DashBoard = () => {
    const [doorStatus, setDoorStatus] = useState<string>('');
    const { data: session } = useSession();
    const router = useRouter();
    const Distance = 15000

    useEffect(() => {
        if (!session?.user.sname) {
            router.push("/sapp");
        }
        let doorStatus = localStorage.getItem('door') || '';
        setDoorStatus(doorStatus);
    }, []);

    const handleButtomMenuClick = async (action: string) => {
        const cartProducts: CartProduct[] = JSON.parse(localStorage.getItem('cart') || '[]');

        if (action == 'openDoor') {
            let nearbyStore: any | null = JSON.parse(localStorage.getItem('nearByStore') || 'null');
            if (nearbyStore && nearbyStore.distanceInKm <= Number(Distance)) {
                localStorage.setItem('storeID', nearbyStore.id);
                router.push('/sapp/StoreDoor');
            }
        }
        else if ((action == 'cart')) {
            if (cartProducts.length > 0) {
                router.push('/sapp/checkout');
            }
        } else {
            router.push('/sapp/settings')
        }
    }

    const handleDashboardMenuClick = (action: string) => {
        if (action == 'vmp') {
            if (doorStatus != 'opened') {
                alert('Your not inside the shop');
                return;
            }
            router.push('/sapp/products');
        }
    }

    return (
        <div className="h-[100dvh] w-full bg-gray-100 flex flex-col items-center">
            <div className="bg-buttonColor h-20 w-full py-4 rounded-b-2xl relative bg-buttonColor relative text-white">
                
            </div>

            <div className="flex justify-center items-center flex-1 gap-2">
                <div className="flex flex-col items-center justify-center gap-3 bg-white rounded-2xl px-5 py-5 w-44 h-44"
                    onClick={() => {
                        if (doorStatus === 'opened') {
                            router.push('/sapp/products');
                        } else {
                            handleDashboardMenuClick('vmp');
                        }
                    }}
                >
                    <Image src='/images/VM.png' alt='vm imag' width={1000} height={1000} className="w-20 h-20" />
                    <span className="text-buttonColor text-lg tracking-wider text-center">Vending Machine</span>
                </div>

                <div className="flex flex-col items-center justify-center gap-3 bg-white rounded-2xl px-5 py-5 w-44 h-44" onClick={() => router.push('/sapp/stores')}>
                    <Image src='/images/location.png' alt='vm imag' width={1000} height={1000} className="w-20 h-20" />
                    <span className="text-buttonColor text-lg tracking-wider">Stores</span>
                </div>
            </div>

            <div className="flex justify-center items-center gap-3 h-36">
                <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center"
                    onClick={() => handleButtomMenuClick('settings')}>
                    <Image src='/images/setting-alt.png' alt='' className="rounded-full w-16 h-16 bg-white" width={1000} height={1000} />
                </div>

                <div className="bg-white w-28 h-28 rounded-full flex items-center justify-center"
                    onClick={() => handleButtomMenuClick('openDoor')}>
                    <Image src='/images/Door.png' alt='' className="rounded-full h-20 w-20" width={1000} height={1000} />
                </div>

                <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center"
                    onClick={() => handleButtomMenuClick('cart')}>
                    <Image src='/images/basket.png' alt='' className="rounded-full w-16 h-16 bg-white" width={1000} height={1000} />
                </div>
            </div>
        </div>
    )
}

export default DashBoard;