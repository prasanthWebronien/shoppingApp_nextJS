'use client'

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import ArrowLeftIcon from "../../components/icons/ArrowLeftIcon";
import EditCircleIcon from "../../components/icons/EditCircleIcon";

const ProfilePage = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const [user, setUser] = useState<any | null>(null);

    useEffect(() => {
        if (!session?.user?.fname) {
            router.push("/sapp");
        }

        setUser(session?.user);
    }, [user]);

    return (
        <div>
            {user ? (
                <div className="px-5 py-7 font-poppins h-[100dvh] bg-white gap-y-5">
                    <div className="flex items-center justify-center relative h-8 w-full">
                        <ArrowLeftIcon className="absolute h-10 w-10 left-0 text-buttonColor" onClick={() => { router.push(`/sapp/settings`) }} />
                        <strong className="font-bold text-2xl text-black">Profile</strong>
                    </div>

                    <div className="flex flex-col items-center justify-between flex-1">
                        <div className="flex flex-col items-center gap-3 py-5 h-full w-full rounded-md">
                            <div className="flex items-center justify-center relative">
                                <Image src='/images/Userpic.png' alt="" className="rounded-full text-red-500 w-44 h-44" width={1000} height={1000} />
                                <Image src='/images/edit.svg' alt="" className="h-10 w-9 absolute right-1 bottom-2 text-buttonColor" width={1000} height={1000} />
                            </div>

                            <div className="flex items-center justify-between w-full">
                                <div className="flex flex-col w-1/2 whitespace-nowrap">
                                    <span className="text-buttonColor text-left py-1 border-b-2 border-gray-200 font-semibold">First Name</span>
                                    <strong className="w-1/2 text-left font-bold text-xl py-1 text-black">{user.fname+''}</strong>
                                </div>

                                <div className="flex flex-col w-1/2 whitespace-nowrap">
                                    <span className="text-buttonColor text-left py-1 border-b-2 border-gray-200 font-semibold">Last Name</span>
                                    <strong className="w-1/2 text-left font-bold text-xl py-1 text-black">
                                        {user?.sname ? user.fname : ''}
                                    </strong>
                                </div>
                            </div>

                            <div className="flex flex-col w-full py-3">
                                <span className="text-buttonColor text-left py-1 w-full border-b-2 border-gray-200 font-semibold">Email Address</span>
                                <strong className="w-1/2 text-left font-bold text-xl py-1 text-black">{''}</strong>
                            </div>

                            <div className="flex flex-col w-full py-2">
                                <span className="text-buttonColor w-full text-left py-1 border-b-2 border-gray-200 font-semibold">Mobile Number</span>
                                <strong className="w-1/2 text-left font-bold text-xl py-1 text-black">{ }</strong>
                            </div>

                            <div className="flex items-center justify-center w-full">
                                <button className="bg-buttonColor w-72 h-12 font-semibold text-white text-center rounded-full">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-1 items-center justify-center">
                    <div className="loader border-t-4 border-buttonColor rounded-full w-12 h-12 animate-spin"></div>
                </div>
            )}
        </div>

    );
}
export default ProfilePage;