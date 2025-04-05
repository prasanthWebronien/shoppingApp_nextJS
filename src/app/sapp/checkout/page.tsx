'use client'

import axios from "axios"
import Image from "next/image"
import { useRouter } from "next/navigation"
import React, { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { TypeProduct, SaleRuleProduct, CartProduct, CheckOutProduct, SaleRuleDetail } from "@/types/product";
import { findTotal, fetchVMProducts } from '@/utils/helpers';
import ArrowLeftIcon from "../components/icons/ArrowLeftIcon";
import UserIcon from "../components/icons/UserIcon";

const CheckoutPage = () => {
    // let Total: number = 0;
    const route = useRouter();
    const { data: session } = useSession();
    const [total, setTotal] = useState<number>(0);
    const [storeID, setStoreID] = useState<string>('');
    const [clicked, setClicked] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [currency, setCurrency] = useState<string>('SEK');
    const [accessTOken, setAccessToken] = useState<string>('');
    const [isProductfetched, setisProductfetched] = useState<boolean>(false);
    const [products, setProducts] = useState<TypeProduct[]>([]);
    const [checkOutProducts, setCheckoutProducts] = useState<CheckOutProduct[]>([]);
    const [cartProducts, setCartProducts] = useState<CartProduct[]>([]);
    const environment = process.env.NEXT_PUBLIC_APP_ENVIRONMENT
    const productPurchaseAPI_URL = process.env.NEXT_PUBLIC_APP_AUTH_API_URL

    useEffect(() => {
        if (!session?.user.fname && !session?.user.doorOpend) {
            route.push("/sapp");
        }

        const addedProducts: CartProduct[] = JSON.parse(localStorage.getItem("cart") || '[]');

        if (addedProducts.length === 0) {
            route.push('/sapp/products');
        }

        const aToken = session?.user?.aToken ?? '';
        const rToken = session?.user?.rToken ?? '';
        const store = localStorage.getItem('storeID') || '';

        setStoreID(store);
        setAccessToken(aToken);
        setCartProducts(addedProducts);
        setTotal(Number(findTotal(addedProducts, '+')));
        const storedCurrency = localStorage.getItem('currency');
        if (storedCurrency) {
            setCurrency(storedCurrency);
        }
        fetchProduct(store, aToken, addedProducts, rToken);
    }, []);

    const fetchProduct = async (store: string, aToken: string, addedProducts: CartProduct[], rToken: string) => {
        try {

            const fetchedProducts: TypeProduct[] = await fetchVMProducts(store, setLoading, setProducts, aToken, setisProductfetched, addedProducts, rToken);

            const updatedCartProduct: CartProduct[] = addedProducts.map((cartItem) => {
                const matchingProduct = fetchedProducts.find(
                    (product: TypeProduct) => product._id === cartItem.productID
                );

                if (matchingProduct) {
                    return {
                        ...cartItem,
                        picture: matchingProduct.picture,
                        title: matchingProduct.title,
                    };
                }
                return cartItem;
            });

            setCartProducts(updatedCartProduct);
            const proArr: CheckOutProduct[] = updatedCartProduct.map((pro) => ({
                productId: pro.productID,
                quantity: pro.productType === "saleRule" ? pro.totalCount : pro.productCount,
            }));

            setCheckoutProducts(proArr);
        } catch (error: unknown) {
            if (
                typeof error === 'object' &&
                error !== null &&
                'status' in error &&
                (error as { status: number }).status === 401
            ) {
                // const newToken = await refreshAccessToken();
                // if (newToken) {
                //     fetchProduct();  // Retry fetching after refreshing token
                // }
            }
        }
        finally {
            setLoading(false);
        }
    };

    const checkStatus = async (responseID: string) => {
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms)); // Helper function to delay
        let status = '';

        // Loop to keep calling the API until the status is 'done'
        while (status !== 'done') {
            try {
                const response = await axios.get(
                    `${productPurchaseAPI_URL}/storedatasync/erp-task/${session?.user.id}/${responseID}`,
                    {
                        headers: {
                            'accept': 'application/json',
                            'env': environment,
                            'Authorization': `Bearer ${accessTOken}`,  // Ensure correct token name here
                            'Content-Type': 'application/json'
                        }
                    }
                );

                status = response.data.status;
                if (status !== 'done') {
                    await delay(5000); // Wait for 5 seconds before retrying
                }

            } catch (error) {
                console.error('Error checking status:', error);
                break; // Optionally, break the loop if there's an error with the request
            }
        }

        return true;
    };

    const handleCheckout = async () => {
        setClicked(true);
        const response = await axios.post(`${productPurchaseAPI_URL}/storedatasync/erp-task`,
            {
                storeId: storeID,
                userId: session?.user.id,
                goal: "dispense",
                details: {
                    products: checkOutProducts
                }
            },
            {
                headers: {
                    'accept': 'application/json',
                    'env': environment,
                    'Authorization': `Bearer ${accessTOken}`,
                    'Content-Type': 'application/json'
                }
            }
        )
        const responseID: string = response.data.id;
        const isDispenced = await checkStatus(responseID);
        setClicked(true);

        console.log(response);
        if (isDispenced) {
            localStorage.removeItem('cart');
            localStorage.removeItem('total');
            setProducts([]);
            route.push('/sapp/payment-success');
        }
    };

    return (
        <div className="h-[100dvh] flex flex-col px-6 font-poppins relative bg-white">
            <div className="flex items-center justify-between h-20 py-8 first-line:fixed top-0 left-0 w-full z-10 bg-white">
                <ArrowLeftIcon className="text-buttonColor h-10 w-10" onClick={() => route.push(`/sapp/products`)} />
                <h1 className="text-black font-bold text-xl">Checkout</h1>
                <UserIcon className="text-buttonColor h-8 w-8" onClick={() => route.push(`/sapp/settings`)} />
            </div>

            {loading && isProductfetched ? (
                <div className="flex flex-1 items-center justify-center">
                    <div className="loader border-t-4 border-buttonColor rounded-full w-12 h-12 animate-spin"></div>
                </div>
            ) : (

                <div className="mt-5 flex-1 flex flex-col overflow-y-auto w-full pb-20">

                    {cartProducts
                        ?.filter((product) => product.productType !== "saleRule") // Filter out products with productType === "saleRule"
                        .map((product) => (
                            <div
                                key={product.productID}
                                className="flex justify-between items-center border-2 border-gray-300 rounded-lg px-4 py-2 mb-4"
                            >
                                <div className="flex items-center gap-2">
                                    <Image src={product.picture ? product.picture : `/images/grocery.png`}
                                        alt='' className="w-14 h-16 object-cover"
                                        width={100} height={100}
                                    />
                                    <div className="flex flex-col">
                                        <span className="font-bold text-black">{product.title}</span>
                                        <span className="text-lightBlack">Qty: {product.productCount}</span>
                                        <span className="text-buttonColor font-semibold text-lg">
                                            {product.price + ' ' + currency}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex font-semibold items-center justify-center gap-2 border-2 border-gray-400 rounded-full px-8 py-4 h-4">
                                    <span className="text-black">{product.productCount}</span>
                                    <span className="text-black">x</span>
                                    <span className="text-black">{parseFloat((product.price / product.productCount).toFixed(2))}</span>
                                </div>
                            </div>
                        ))}

                    {cartProducts
                        .filter(pro => pro.productType === 'saleRule')
                        .map((pro: SaleRuleProduct, index) => {
                            // Step 1: Calculate total before rendering
                            let total = pro.totalCount;

                            // Reduce total count by subtracting quantities from applied sale rules
                            pro.saleRuleDetails.forEach((rule: any) => {
                                if (rule.isSaleApplied) {
                                    total -= (rule.productQuantiy * rule.saleRule.count);
                                }
                            });

                            return (
                                <div key={index} className="">
                                    {/* Step 2: Render Green Divs (Applied Sale Rules) */}
                                    {pro.saleRuleDetails.map((rule: any, ruleIndex: number) => (
                                        rule.isSaleApplied && (
                                            <div key={ruleIndex} className="flex justify-between items-center border-2 border-buttonColor rounded-lg px-4 py-2 mb-4">
                                                <div className="flex items-center gap-2">

                                                    <Image src={pro.picture ? pro.picture : `/images/grocery.png`}
                                                        alt='' className="w-14 h-16 object-cover"
                                                        width={100} height={100}
                                                    />

                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-black">{pro.title}</span>
                                                        <span className="text-lightBlack">Qty: {rule.productQuantiy * rule.saleRule.count}</span>
                                                        <span className="text-buttonColor font-semibold text-lg">{(rule.productQuantiy * rule.saleRule.price) + ' ' + currency}</span>
                                                    </div>
                                                </div>
                                                <div className="flex font-semibold items-center justify-center gap-2 border-2 border-gray-400 rounded-full px-8 py-4 h-4">
                                                    <span className="text-black">{rule.productQuantiy}</span>
                                                    <span className="text-black">x</span>
                                                    <span className="text-black">{rule.saleRule.price.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        )
                                    ))}

                                    {/* Step 3: Render Red Div (Remaining Quantity) */}
                                    {total > 0 && (
                                        <div className="flex justify-between items-center border-2 border-red-300 rounded-lg px-4 py-2 mb-4">
                                            <div className="flex items-center gap-2">
                                                <Image src={pro.picture ? pro.picture : `/images/grocery.png`}
                                                    alt='' className="w-14 h-16 object-cover"
                                                    width={100} height={100}
                                                />
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-black">{pro.title}</span>
                                                    <span className="text-lightBlack">Qty: {total}</span>
                                                    <span className="text-buttonColor font-semibold text-lg">{(total * pro.productPrice) + ' ' + currency}</span>
                                                </div>
                                            </div>
                                            <div className="flex font-semibold items-center justify-center gap-2 border-2 border-gray-400 rounded-full px-8 py-4 h-4">
                                                <span className="text-black">{total}</span>
                                                <span className="text-black">x</span>
                                                <span className="text-black">{pro.productPrice}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    <div className="flex justify-center items-center fixed bottom-0 left-0 w-full z-10 pb-5 bg-white">
                        <button
                            onClick={handleCheckout}
                            className={`bg-buttonColor text-black tracking-wider text-white text-center rounded-full px-32 py-5 ${clicked ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={clicked} // Disable the button after click
                        >
                            {clicked ? "Processing..." : `Pay ${total} -  ${currency}`} {/* Show 'Processing...' after click */}
                        </button>
                    </div>
                </div>
            )}

            {clicked &&
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-5 pb-5 font-poppins z-20">
                    <div className="flex flex-1 items-center justify-center">
                        <div className="loader border-t-4 border-buttonColor rounded-full w-12 h-12 animate-spin"></div>
                    </div>
                </div>
            }
        </div>
    )
}

export default CheckoutPage;