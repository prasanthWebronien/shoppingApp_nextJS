'use client'

import { useSearch } from "../context/SearchContext";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import ProductUnavailable from '../components/productUnavailable';
import Cart from '../components/cart';
import { useShowCart } from "../context/ShowCartContext";


const FridgeProducts = () => {
    const { searchText, setSearchText, searchResults } = useSearch();
    const router = useRouter();
    const { showCart } = useShowCart();
    const { data: session } = useSession();
    const [storeID, setStoreID] = useState('');
    const apiUrl = process.env.NEXT_PUBLIC_APP_API_URL!;
    const [category, setCategory] = useState<any[]>([]);
    const [sfProducts, setSfProducts] = useState<any[]>([]);
    const [isLoading, setisloading] = useState<boolean>(false);
    const environment = process.env.NEXT_PUBLIC_APP_ENVIRONMENT!;

    useEffect(() => {
        setSearchText('');
        let doorStatus = localStorage.getItem('doorStatus') || '';
        if (!session?.user?.fname && doorStatus !== 'opened') {
            router.push('/sapp/dashBoard2');
        }

        const store = localStorage.getItem('storeID') || '';
        const aToken = session?.user?.aToken ?? '';
        const rToken = session?.user?.rToken ?? '';
        setStoreID(store);

        fetchFridgeProducts(store, aToken, rToken);
    }, [])

    const fetchFridgeProducts = async (storeId: string, accessToken: string, refreshToken: string) => {

        try {
            const response = await axios.get(
                `${apiUrl}fridge/getFridgeProductListByShopId?shopId=${storeId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'accept': '*/*',
                        'env': environment,
                    },
                }
            );

            console.log(response);

        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            {isLoading ? (
                <div>loading</div>
            ) : sfProducts.length === 0 ? (
                <div className="bg-white h-full flex justify-center items-center">
                    <ProductUnavailable />
                </div>
            ) : (
                <div className="bg-white text-black">
                    {/* Your content for when vmProducts has data */}
                </div>
            )}

            {showCart && <Cart />}
        </>
    )
}

export default FridgeProducts;