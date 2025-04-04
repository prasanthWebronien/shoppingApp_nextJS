// app/call-support/[storeId]/page.tsx
'use client';

import axios from "axios"
import Image from "next/image";
import { Shop } from '@/types/product';
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { fetchStoresUtils } from '@/utils/helpers';
import UserIcon from "../../../components/icons/UserIcon";
import PhoneIcon from "../../../components/icons/PhoneIcon";
import { useEffect, useState, useCallback, use } from "react";
import ArrowLeftIcon from "../../../components/icons/ArrowLeftIcon";

interface Props {
    params: Promise<{ storeId: string }>; // Notice: it's a Promise now!
}

const StoreDetailsPage = (props: Props) => {

    const router = useRouter();
    const { data: session } = useSession();
    const [store, setStore] = useState<Shop>();
    const [loading, setLoading] = useState<boolean>(true);
    const { storeId } = use(props.params); // 👈 unwrapping with React.use()

    const fetchStores = useCallback(async () => {
        try {
            const accessToken = session?.user?.aToken ?? '';
            const refrestToken = session?.user?.rToken ?? '';
            const fetchedStores = await fetchStoresUtils(accessToken, refrestToken, 'getCurrectLocatio1');
            const Result = fetchedStores?.find((store) => store.id == storeId);
            setStore(Result);
        } catch (error) {
            console.error("Error fetching stores:", error);
        } finally {
            setLoading(false);
        }
    }, [session?.user?.aToken, session?.user?.rToken, storeId]);

    useEffect(() => {
     
        if (!session?.user.fname) {
            router.push("/sapp");
        }

        fetchStores();
    }, []);

    return (
        <>
            {
                !store ? (
                    <div className="h-[100dvh] flex flex-1 items-center justify-center bg-white">
                        <div className="loader border-t-4 border-buttonColor rounded-full w-12 h-12 animate-spin"></div>
                    </div>
                ) : (
                    <div className="h-[100dvh] flex flex-col px-5 bg-white">
                        <div className="flex flex-col">
                            <div className="flex items-center justify-between h-20">
                                <ArrowLeftIcon className="h-10 w-10 text-buttonColor" onClick={() => { router.push(`/sapp/settings/call-support`) }} />
                                <h1 className="text-black font-bold text-xl">Call Support</h1>
                                <UserIcon className="h-10 w-10 text-buttonColor" onClick={() => { router.push(`/sapp/settings/profile`) }} />
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col items-center justify-center">
                            <div className="h-1/2 flex flex-col justify-center items-center gap-5">
                                <Image src='/images/support.png' alt='' className="w-44 h-44" width={1000} height={1000} />

                                <h1 className="4xl font-bold color-black text-black">How can we help you?</h1>

                                <p className="text-center text-black">
                                    Are you Experiencing any problems with our 24 SJU APP. We are here to help so please get in touch with us.
                                </p>

                                <button className="flex gap-1 items-center justify-center bg-buttonColor text-white px-16 py-3 rounded-full cursor-pointer text-lg">
                                    <PhoneIcon className="text-white h-6 w-6" onClick={() => { '' }} /> Contact 24 SJU Support
                                </button>
                            </div>

                            <div className="h-1/2 flex flex-col items-center justify-center gap-12">
                                <h1 className="text-lg text-black">CONTACT THE STORE</h1>

                                <div key={1} onClick={() => { '' }} className="bg-gray-100 rounded-lg px-32 py-4 flex justify-between items-center border-b">
                                    <div className="flex gap-2 items-center">
                                        <Image src='/images/location-sharp.png' alt='' className="h-8 w-8" width={1000} height={1000} />
                                        <strong className="text-buttonColor text-lg font-semibold">{store.name}</strong>
                                    </div>
                                </div>

                                <button className="flex gap-1 justify-center items-center bg-buttonColor text-white px-24 py-3 rounded-full text-xl tracking-wider">
                                    <PhoneIcon className="text-white h-6 w-6" onClick={() => console.log('Icon clicked')} /> {store.contact_no}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
};

export default StoreDetailsPage;