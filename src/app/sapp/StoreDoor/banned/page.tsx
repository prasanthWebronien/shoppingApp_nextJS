'use client'

import Image from "next/image";
import { useRouter } from "next/navigation";
import CloseIcon from "../../components/icons/CloseIcon";

const BannedPage = () => {
    const router = useRouter();
    return (
        <div className="flex flex-col bg-redColor h-[100dvh] font-poppins px-6">
            <div className="flex items-center justify-end py-6">
                <CloseIcon className="text-white" onClick={() => router.push(`/sapp/stores`)} />
            </div>

            <div className="flex flex-col text-white h-full">
                <div className="flex flex-col h-1/2 justify-end">
                    <div className="flex flex-col justify-center items-center gap-3">
                        <Image src='/images/ban-user.png' alt='' className="w-[150px] h-[150px]" width={1000} height={1000} />
                        <strong className="text-2xl font-bold">You have been Banned!</strong>
                        <p className="text-center text-lg">You have been banned from entering <br /> StoreTech Stores</p>
                    </div>
                </div>

                <div className="flex flex-col justify-end py-10 h-1/2">
                    <div className="flex flex-col justify-center items-center gap-5  bg-white rounded-xl relative py-8">
                        <Image src='/images/Group.png' alt='' className="w-10 h-10 absolute -top-4" width={1000} height={1000} />
                        <strong className="text-black font-semibold text-xl">For more information</strong>

                        <button className="bg-buttonColor text-white text-xl font-semibold tracking-wider text-center rounded-full px-24 py-4 flex items-center justify-center gap-2">
                            <Image src='/images/phone.png' alt="Mail Icon" className="w-5 h-5" width={1000} height={1000} />
                            Call Support
                        </button>

                        <button className="bg-buttonColor text-white text-xl font-semibold tracking-wider text-center rounded-full px-24 py-4 flex items-center justify-center gap-2">
                            <Image src='/images/mail.png' alt="Mail Icon" className="w-5 h-5" width={1000} height={1000} />
                            Mail Support
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BannedPage;