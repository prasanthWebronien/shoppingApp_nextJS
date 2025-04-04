'use client'

import axios from "axios"
import Image from "next/image";
import { Shop } from '@/types/product';
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import UserIcon from "../../components/icons/UserIcon";
import ArrowLeftIcon from "../../components/icons/ArrowLeftIcon";
import SearchIcon from '../../components/icons/SearchIcon';
import { fetchStoresUtils } from '@/utils/helpers';

const CallSupportPage = () => {
    const router = useRouter();
    const [stores, setStores] = useState<Shop[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [tempStores, setTeampstores] = useState<Shop[]>([]);
    const [filteredShops, setFilteredShops] = useState<Shop[]>([]);
    const { data: session } = useSession();

    const fetchStores = useCallback(async () => {
        try {
            const accessToken = session?.user?.aToken ?? '';
            const refrestToken = session?.user?.rToken ?? '';
            const fetchedStores = await fetchStoresUtils(accessToken, refrestToken,'getCurrectLocatio1');
            setFilteredShops(fetchedStores || []);
            setStores(fetchedStores || []);
            setTeampstores(fetchedStores || []);
        } catch (error) {
            console.error("Error fetching stores:", error);
            setFilteredShops([]);
        } finally {
            setLoading(false);
        }
    }, [session?.user?.aToken]);

    useEffect(() => {
        let doorStatus=localStorage.getItem('door')|| '';

        if (!session?.user.fname)  {
            router.push("/sapp");
        }
        fetchStores();
    }, [fetchStores, router, session?.user.fname]);


    const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {

        setLoading(true);
        try {
            const query = e.target.value.toLowerCase();

            if (query === '') {
                await fetchStores();
                return;
            }

            const filtered = tempStores.filter((store: Shop) =>
                store.name.toLowerCase().includes(query)
            );

            setLoading(false);
            setStores(filtered);

        } catch (error) {
            console.error("Error in handleSearchChange:", error);
        }
    };

    const handleIconclick = () => {
        localStorage.setItem('selectedStoreId', stores[0].id);
        router.push('/sapp/settings');
    }

    return (

        <div className="h-[100dvh] font-poppins bg-white flex flex-col">
            {/* Top section: Back + Title + User Icon + Image */}
            <div className="px-7 h-1/2 flex flex-col">
                <div className="flex items-center justify-between h-20">
                    <ArrowLeftIcon className="h-10 w-10 text-buttonColor" onClick={handleIconclick} />
                    <h1 className="text-black font-bold text-xl">Call Support</h1>
                    <UserIcon className="h-10 w-10 text-buttonColor" onClick={() => { router.push(`profile`) }} />
                </div>

                <div className="flex-1 flex justify-center items-center">
                    <Image src='/images/support.png' alt='' className="h-60 w-60" width={1000} height={1000} />
                </div>
            </div>

            {/* Bottom section: Search + Scrollable Store List */}
            <div className="flex h-1/2 min-h[50dvh] flex-col px-5">
                {/* Search bar */}
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <strong className="text-xl font-bold text-black">Select a store</strong>
                    </div>

                    <div className="flex items-center justify-center">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search"
                                onChange={handleSearchChange}
                                className="w-full bg-white text-black font-semibold py-3 px-5 border-2 border-buttonColor outline-none text-left rounded-full focus:ring-2 focus:ring-buttonColor transition-all"
                            />
                            <SearchIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-buttonColor" />
                        </div>
                    </div>
                </div>

                {/* Scrollable list */}
                <div className="flex flex-col gap-3 overflow-y-auto mt-5">
                    {loading ? (
                        <div className="flex flex-1 items-center justify-center">
                            <div className="loader border-t-4 border-buttonColor rounded-full w-12 h-12 animate-spin"></div>
                        </div>
                    ) : (
                        stores.map((shop: Shop, index: number) => (
                            <div
                                key={index}
                                onClick={() => router.push(`call-support/${shop.id}`)}
                                className="bg-gray-100 rounded-lg px-4 py-2 flex justify-between items-center border-b mt-2"
                            >
                                <div className="flex gap-2 items-center">
                                    <Image src='/images/location-sharp.png' alt='' className="h-8 w-8" width={1000} height={1000} />
                                    <div className="flex flex-col">
                                        <strong className="text-buttonColor text-lg font-semibold">{shop.name}</strong>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className={`rounded-md px-2 py-1 font-semibold text-white ${shop.status === "open" ? "bg-buttonColor" : "bg-yellow-500"}`}>
                                        {shop.status === "open" ? "Open" : "Coming Soon"}
                                    </span>
                                    <span className="text-lg font-semibold">{shop.distance}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>

    )
}

export default CallSupportPage;