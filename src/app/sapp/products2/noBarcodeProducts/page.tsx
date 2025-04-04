'use client'


import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import Cart from '../components/cart';
import { useShowCart } from "../context/ShowCartContext";

const categoryPage = () => {
    const { showCart } = useShowCart();
    const router = useRouter();
    const { data: session } = useSession();
    const [storeID, setStoreID] = useState('');
    const [categorys, setCategorys] = useState<any[]>([]);
    const apiUrl = process.env.NEXT_PUBLIC_APP_API_URL!;
    const environment = process.env.NEXT_PUBLIC_APP_ENVIRONMENT!;

    useEffect(() => {
        const store = localStorage.getItem('storeID') || '';
        const aToken = session?.user?.aToken ?? '';
        const rToken = session?.user?.rToken ?? '';
        setStoreID(store);

        fetchProductCategory(store, aToken, rToken);
    }, [])

    const fetchProductCategory = async (storeId: string, accessToken: string, refreshToken: string) => {
        try {
            const response = await axios.get(
                `${apiUrl}/lookup/?shop_id=${storeId}&type=category&parent_id=noneBarcode&limit=200`,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'accept': '*/*',
                        'env': environment,
                    },
                }
            );
            console.log(response.data.data);
            setCategorys(response.data.data);
        } catch (err) {
            console.log(err);
        }
    }

    const handleCategoryClick = (categoryID: string) => {
        const foundCategory = categorys.find(category => category.id === categoryID);
        localStorage.setItem('selectedCategory', JSON.stringify(foundCategory));
        router.push(`noBarcodeProducts/${categoryID}`);
    }

    return (
        <>
            <div className="w-full grid grid-cols-2 gird-rows-3 gap-3 py-24">

                {categorys.map((category) => (
                    <div key={category.id} className="flex flex-col items-center justify-center gap-3 bg-white rounded-2xl px-5 py-5 w-48 h-48 shadow-md hover:bg-buttonColor group"
                        onClick={() => handleCategoryClick(category.id)}>
                        <Image src={category.metaData.picture || '/images/24sjuIcon.webp'} alt={category.value} width={1000} height={1000} className="w-24 h-24" />
                        <span className="text-buttonColor text-lg tracking-wider text-center group-hover:text-white">{category.value}</span>
                    </div>
                ))}

            </div>

            {showCart && <Cart />}
        </>

    )
}

export default categoryPage;