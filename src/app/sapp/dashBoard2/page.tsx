'use client'

import Image from "next/image";
import Cart from './components/cart';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import NotNeartoStore from './components/nodoor';
import { fetchStoresUtils } from '@/utils/helpers';

const dashBoardPage = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const [noDoor, setNodoor] = useState<boolean>(false);
    const [cartShow, setShowCar] = useState<boolean>(false);
    const distance = process.env.NEXT_PUBLIC_APP_DISTANCE;
    const [doorStatus, setDoorStatus] = useState<string>('');

    const handleOpenDoorCLick = () => {
        let accessToken = session?.user?.aToken ?? '';
        let refreshToken = session?.user?.rToken ?? '';
        findNeayByStore(accessToken, refreshToken);
    }

    const findNeayByStore = async (accessToken: string, refreshToken: string) => {
        let stores = await fetchStoresUtils(accessToken, refreshToken, 'getCurrectLocatiow');
        let storeDistance = parseInt(stores?.[0]?.distance ?? "0");
 
        if (storeDistance <= Number(distance)) {
            let storeID=stores?.[0].id || '';
            localStorage.setItem('storeID',storeID);
            router.push('doorOpening')
        } else {
            router.push('dashBoard2');
            setNodoor(true);
            localStorage.setItem('doorStatus', 'NotNear');
        }
    }

    const menuClick = (menu: string) => {
        doorStatus
        if (menu == 'Scan Products' && doorStatus) {
            router.push('products2/scanProducts')
        }
        else if (menu == 'No Barcode Products' && doorStatus) {
            router.push('products2/noBarcodeProducts')
        } else if (menu == 'Smart Fridge' && doorStatus) {
            router.push('products2/FridgeProducts')
        }
        else if (menu == 'Vending Machine' && doorStatus) {
            router.push('products2/vmProducts')
        }
        else{
            alert('you must be inside teh store');
        }
    }

    useEffect(() => {
        let doorStatus = localStorage.getItem('doorStatus') || '';
        setDoorStatus(doorStatus);
    }, [])

    return (
        <>
            <div className="h-[100dvh] w-full bg-gray-100 flex flex-col items-center font-poppins">
                <div className="flex justify-center bg-buttonColor h-20 w-full py-4 rounded-b-2xl relative bg-buttonColor relative text-white">
                    <Image src='/images/24sjuIcon.webp' alt='24Sju' width={1000} height={1000} className=" w-20 h-20" />
                </div>

                <div className="grid grid-cols-2 gap-4 justify-center items-center flex-1 gap-2">
                    <div className="flex flex-col items-center justify-center gap-3 bg-white rounded-2xl px-5 py-5 w-44 h-44 shadow-md hover:bg-buttonColor group"
                        onClick={() => menuClick('Scan Products')}>
                        <Image src='/images/barcode-scan.png' alt='vm imag' width={1000} height={1000} className="w-20 h-20" />
                        <span className="text-buttonColor text-lg tracking-wider text-center group-hover:text-white">Scan Products</span>
                    </div>


                    <div className="flex flex-col items-center justify-center gap-3 bg-white rounded-2xl px-5 py-5 w-44 h-44 shadow-md hover:bg-buttonColor hover:text-white group"
                        onClick={() => menuClick('No Barcode Products')}>
                        <Image src='/images/noBarcode.png' alt='vm imag' width={1000} height={1000} className="w-20 h-20" />
                        <span className="text-buttonColor text-lg tracking-wider text-center group-hover:text-white">No Barcode Products</span>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-3 bg-white rounded-2xl px-5 py-5 w-40 h-40 shadow-md hover:bg-buttonColor hover:text-white group"
                        onClick={() => menuClick('Vending Machine')}>
                        <Image src='/images/VM.png' alt='vm imag' width={1000} height={1000} className="w-16 h-16" />
                        <span className="text-buttonColor text-lg tracking-wider text-center whitespace-nowrap group-hover:text-white">Vending Machine</span>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-3 bg-white rounded-2xl px-5 py-5 w-40 h-40 shadow-md hover:bg-buttonColor hover:text-white group"
                        onClick={() => menuClick('Smart Fridge')}>
                        <Image src='/images/fridge.png' alt='vm imag' width={1000} height={1000} className="w-16 h-16" />
                        <span className="text-buttonColor text-lg tracking-wider group-hover:text-white">Smart Fridge</span>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-3 bg-white rounded-2xl px-5 py-5 w-40 h-40 shadow-md hover:bg-buttonColor hover:text-white group"
                        onClick={() => router.push('/sapp/stores')}>
                        <Image src='/images/store.png' alt='vm imag' width={1000} height={1000} className="w-16 h-16" />
                        <span className="text-buttonColor text-lg tracking-wider text-center group-hover:text-white">Stores</span>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-3 bg-white rounded-2xl px-5 py-5 w-40 h-40 shadow-md hover:bg-buttonColor hover:text-white group"
                        onClick={() => router.push('/sapp/settings/history2')}>
                        <Image src='/images/history.png' alt='vm imag' width={1000} height={1000} className="w-16 h-16" />
                        <span className="text-buttonColor text-lg tracking-wider group-hover:text-white">History</span>
                    </div>
                </div>

                <div className="flex justify-center items-center gap-3 h-36">
                    <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center ">
                        <Image src='/images/setting-alt.png' alt='' className="rounded-full w-16 h-16 bg-white" width={1000} height={1000} 
                        onClick={()=>router.push('/sapp/settings')}/>
                    </div>

                    <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center"
                        onClick={handleOpenDoorCLick}>
                        <Image
                            src='/images/smart-door.png'
                            alt=''
                            className="rounded-full h-20 w-12 object-contain"
                            width={1000}
                            height={1000}
                        />
                    </div>

                    <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center">
                        <Image src='/images/basket.png' alt='' className="rounded-full w-16 h-16 bg-white" width={1000} height={1000}
                            onClick={() => setShowCar(true)} />
                    </div>
                </div>
            </div>

            {noDoor && <NotNeartoStore setNoDoor={setNodoor} />}

            {cartShow && <Cart setShowCar={setShowCar} />}
        </>
    )
}

export default dashBoardPage;