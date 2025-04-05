'use client'

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { CheckOutProduct, CartProduct } from "@/types/product";
import { handleDispencing } from '@/utils/helpers';

const CollectProduct = () => {
    const route = useRouter();
    const { data: session } = useSession();
    const [cartProductCount, setCartProductCount] = useState();
    const [storeID, setStoreID] = useState<string>('');
    const [accessToken, setAccessToken] = useState<string>('');
    const [refreshToken, setRefreshToken] = useState<string>('');
    const [checkOutProducts, setCheckoutProducts] = useState<CheckOutProduct[]>([]);

    const handleDispenceClick = async () => {
        let userID = session?.user.id || '';
        localStorage.removeItem('checkOutProduct');

        if (await handleDispencing(checkOutProducts, userID, storeID, accessToken, refreshToken)) {
            route.push('purchase/dispensing');
        }
    }

    useEffect(() => {
        let doorStatus = localStorage.getItem('doorStatus');
        if (!session?.user?.fname && doorStatus != 'opened') {
            route.push("/sapp");
            return;
        }
        const aToken = session?.user?.aToken ?? '';
        const rToken = session?.user?.rToken ?? '';
        const store = localStorage.getItem('storeID') || '';
        setStoreID(store);
        setAccessToken(aToken);
        setRefreshToken(rToken);

        const cartVMProducts: CartProduct[] = JSON.parse(localStorage.getItem("VMcart") || '[]');
        const proArr: CheckOutProduct[] = cartVMProducts.map((pro) => ({
            productId: pro.productID,
            quantity: pro.productType === "saleRule" ? pro.totalCount : pro.productCount,
        }));

        setCheckoutProducts(proArr);
        const parsedProducts: CheckOutProduct[] = proArr;
        const totalQuantity = parsedProducts.reduce((sum: any, item: any) => sum + item.quantity, 0);
        setCartProductCount(totalQuantity);
    }, []);

    return (
        <div className="flex flex-col bg-white h-[100dvh] justify-center items-center px-8 py-5 gap-10 font-poppins">
            <div className="flex flex-col items-center justify-center text-xl font-semibold w-full">
                <h1 className="text-black">You have purchased</h1>
                <h1 className="text-red-500">{cartProductCount}{cartProductCount ? ' Product' : ' Products'}</h1>
                <h1 className="text-black">from the vending machine</h1>
            </div>

            <div className="wi-full flex items-center justify-center">
                <Image src='/images/vendingCollect.png' alt='collectProducts' width={1000} height={1000} className="w-[230px] h-[380px]" />
            </div>

            <div className="flex flex-col bg-gray-200 rounded-lg p-5 items-center justify-center relative  text-lg font-semibold gap-4">
                <Image src='/images/Group.png' alt='collectProducts' width={1000} height={1000} className='w-8 h-8 absolute top-[-13]' />

                <h1 className="text-black text-center">
                    Make sure you are in front of the <br /> Vending Machine before you <br /> Collect your Products.
                </h1>

                <h1 className="text-black text-center">
                    Do not go back or close the app while the products are dispensing
                </h1>
            </div>

            <div className="flex w-full items-center justify-center">
                <button className="bg-buttonColor text-white rounded-full px-20 py-4 text-xl" onClick={handleDispenceClick}>Collect Products</button>
            </div>
        </div>
    )
}

export default CollectProduct;