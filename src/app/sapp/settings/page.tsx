'use client'

import axios from "axios";
import Image from "next/image";
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import UserIcon from "../components/icons/UserIcon";
import ArrowLeftIcon from "../components/icons/ArrowLeftIcon";

const SettingsPage = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const [user, setUser] = useState<any | null>(null);
    const apiURL = process.env.NEXT_PUBLIC_APP_API_URL;
    const [orderReferenceToken, setOrderReferenceToken] = useState<string>('');
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [doorStatus, setDoorSttaus] = useState<string>('');
    const [isProductIncart, setIsProductIncart] = useState<boolean>(false);

    useEffect(() => {
        if (!session?.user.fname && !session?.user.doorOpend) {
            router.push('/sapp/dashBoard2');
        }

        let storeUser = session?.user ?? null;
        let doorStatus = localStorage.getItem('door') || '';
        setDoorSttaus(doorStatus);
        setOrderReferenceToken(localStorage.getItem('orderReferance') || '');
        setUser(storeUser);

    }, []);

    const userLogout = async (orderReference: string) => {

        try {
            const response = await axios.get(`${apiURL}/bankid/logout?orderRef=${orderReference}`, {
                headers: {
                    'Accept': 'application/json',
                },
            });

            localStorage.removeItem('orderReferance');
            let result = JSON.stringify(response);

        }
        catch (err) {
            console.log(err);
        }
    }

    const handleLogout = (text: string) => {
        if (text === 'yes') {
            document.cookie.split(";").forEach((cookie) => {
                document.cookie = cookie
                    .replace(/^ +/, "")
                    .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            });
        

            if (orderReferenceToken != '/') {
                userLogout(orderReferenceToken);
            }
            localStorage.clear();
            sessionStorage.clear();
            signOut({ callbackUrl: "/sapp" });
        }
        else if (text === 'Go to Cart') {
            router.push('/sapp/checkout');
        }
        setShowPopup(false);
    };

    const handleClickLogoutBtn = () => {
        const cartProduct = localStorage.getItem("cart");
        const cartArray = cartProduct ? JSON.parse(cartProduct) : []; // Convert string to array

        if (cartArray.length > 0) {
            setIsProductIncart(true);
        } else {
            setShowPopup(true);
        }
    };


    return (
        <div>
            <div className="flex flex-col px-6 h-[100dvh] font-poppins bg-white py-4 gap-3">
                <div className="flex items-center justify-center relative py-8 h-10">
                    <ArrowLeftIcon className="absolute h-10 w-10 left-0 text-buttonColor"
                        onClick={() => router.push("/sapp/dashBoard2")} />
                    <strong className="font-bold text-2xl text-black">Settings</strong>
                </div>

                <div className="flex flex-col justify-around flex-1 gap-3">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col items-center justify-center gap-3 py-4 bg-ligghtGray rounded-md">
                            <Image src='/images/loginUser.png' alt='' width={1000} height={1000} className="rounded-full h-36 w-36" />
                            <strong className="text-2xl">{ }</strong>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-start gap-4 py-3 border-b-2 border-gray-300" onClick={() => { router.push(`settings/profile`) }}>
                                <UserIcon className="h-8 w-8 text-buttonColor rounded-full" />
                                <h1 className="font-bold text-xl text-lightBlack">Profile</h1>
                            </div>

                            <div className="flex items-center justify-start gap-4 py-3 border-b-2 border-gray-300" onClick={() => { router.push('settings/history2') }}>
                                <UserIcon className="h-8 w-8 text-buttonColor rounded-full" />
                                <h1 className="font-bold text-xl text-lightBlack">History</h1>
                            </div>

                            <div className="flex items-center justify-start gap-4 py-3 border-b-2 border-gray-300" onClick={() => { router.push('settings/call-support') }}>
                                <UserIcon className="h-8 w-8 text-buttonColor rounded-full" />
                                <h1 className="font-bold text-xl text-lightBlack">Call Store Support</h1>
                            </div>

                            <div className="flex items-center justify-start gap-4 py-3 border-b-2 border-gray-300" onClick={() => { router.push('settings/help') }}>
                                <UserIcon className="h-8 w-8 text-buttonColor rounded-full" />
                                <h1 className="font-bold text-xl text-lightBlack">Help</h1>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center">
                        <button onClick={handleClickLogoutBtn} className="bg-buttonColor text-white text-center rounded-full w-[250px] py-3">Log out</button>
                    </div>
                </div>
            </div>

            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-5 pb-5 font-poppins">
                    <div className="flex flex-col items-center justify-center bg-white rounded-lg w-[300px] h-[200px] gap-5">
                        <div className="flex items-center justify-center flex-col gap-3 w-full">
                            <Image src='/images/no-door.png' alt='' width={1000} height={1000} className="w-10 h-10" />
                            <strong className="tracking-wider font-semibold text-black">Do you wish to log out?</strong>
                        </div>

                        <div className="flex items-center justify-center gap-5 w-full">
                            <button onClick={() => handleLogout('no')} className="text-black text-lg font-semibold bg-gray-200 text-center rounded-full px-12 py-2">No</button>
                            <button onClick={() => handleLogout('yes')} className="text-white text-lg font-semibold hover:bg-red-500 bg-redColor text-center rounded-full px-12 py-2">Yes</button>
                        </div>
                    </div>
                </div>
            )}

            {isProductIncart && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-5 pb-5 font-poppins">
                    <div className="flex flex-col items-center justify-center bg-white rounded-lg w-[375px] h-[220px] gap-5 px-1">
                        <div className="flex tracking-wider items-center justify-center flex-col gap-3 w-full">
                            <strong className="text-center w-full text-xl tracking-wider font-semibold text-black">You have 2 items in your cart</strong>
                            <h2 className="text-center text-lg text-black">If you proceed with log out the products will be discarded</h2>
                        </div>

                        <div className="flex items-center justify-center gap-5 w-full">
                            <button onClick={() => handleLogout('yes')} className="text-black text-lg font-semibold hover:bg-red-500 bg-redColor  text-white text-center rounded-full px-10 py-2">Continue</button>
                            <button onClick={() => handleLogout('Go to Cart')} className="whitespace-nowrap text-buttonColor text-lg font-semibold bg-gray-200 text-center rounded-full px-10 py-2">Go to Cart</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SettingsPage;