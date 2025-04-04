'use client'

import axios from "axios"
import Image from "next/image"
import { useRouter } from "next/navigation"
import React, { useState, useEffect } from "react"

const Cart = () => {
    
    const [cartProducts, setCartProducts] = useState<any[]>([]);
    const route = useRouter();
    const handleCountClick = (action: string) => {
        if (action == '-') {

        } else {

        }
    }

    const handleCheckouClick = () => {
        let cartLength = cartProducts.length;
        if (cartLength > 0) {
            route.push('checkout');
        }
        else {
            route.push('dashBoard2');
        }
    }

    useEffect(() => {
        alert(setCartProducts.length);
        let cartProducts = localStorage.getItem('cart');
        let total = localStorage.getItem('total');
    }, [])

    return (
        <div className="flex flex-col bg-white text-black px-5 font-poppins">
            <div className="flex items-center justify-between h-20 fixed top-0 left-0 w-full bg-white px-5">
                <span className="font-semibold text-2xl">Cart</span>
                <Image src='/images/decline.png' alt='close' width={1000} height={1000} className="h-12 w-12" />
            </div>

            {
                setCartProducts.length <= 1 ? (
                    <div className="flex flex-col items-center justify-center text-black w-full my-20 flex-1 px-10 gap-6 min-h-[350px]" >
                        <Image src='/images/emptyCart.png' alt='emptyCart' className="h-36 w-36" width={1000} height={1000} />
                        <strong>Your cart i s empty</strong>
                        <p className="text-center">Looks like you have no items in your cart start  adding products to your cart</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-5 flex-1 overflow-y-auto my-20 ">
                        <div className="flex flex-col gap-3">
                            <div className="w-full flex items-center justify-center gap-3 mb-3">
                                <Image src='/images/discounGreen.png' alt='' className="h-6 w-6 " width={1000} height={1000} />
                                <span className="text-center text-buttonColor text-xl font-bold">Campaign</span>
                            </div>

                            <div className="relative border border-1 border-yellow-500 rounded-lg flex flex-col mb-5">
                                <div className="absolute top-0 left-5 transform -translate-y-1/2  flex bg-yellow-500 w-40 rounded-lg justify-center py-1">
                                    <Image src='/images/discount.png' alt='discout' width={1000} height={1000} className="w-5 h-5" />
                                    <span className="text-black">Buy 9 for 10 SEK</span>
                                </div>
                                <div className="flex items-center justify-between p-3 py-2 rounded-lg  ">
                                    <div className="flex gap-2">
                                        <div className="flex flex-col ietms-center justify-cernter p-5">
                                            <Image src='/images/grocery.png' alt='product' className="h-10 w-10" width={1000} height={1000} />
                                            <span className="bg-red-500 text-white px-2">18+</span>
                                        </div>

                                        <div className="flex flex-col gap-1 items-center justify-center">
                                            <span className="text-xl">Kisan</span>
                                            <p>Lorem 4g</p>
                                            <span className="text-buttonColor">40.00 SEK</span>
                                        </div>
                                    </div>

                                    <div className=" font-semibold text-2xl flex items-center justify-between gap-6 border border-1 border-yellow-500 rounded-full items-center justify-center px-4 py-1">
                                        <button className="text-buttonColor text-center text-3xl">-</button> <span>5</span> <button className="text-buttonColor">+</button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-3 py-2 rounded-lg  ">
                                    <div className="flex gap-2">
                                        <div className="flex flex-col ietms-center justify-cernter p-5">
                                            <Image src='/images/grocery.png' alt='product' className="h-10 w-10" width={1000} height={1000} />
                                            <span className="bg-red-500 text-white px-2">18+</span>
                                        </div>

                                        <div className="flex flex-col gap-1 items-center justify-center">
                                            <span className="text-xl">Kisan</span>
                                            <p>Lorem 4g</p>
                                            <span className="text-buttonColor">40.00 SEK</span>
                                        </div>
                                    </div>

                                    <div className=" font-semibold text-2xl flex items-center justify-between gap-6 border border-1 border-yellow-500 rounded-full items-center justify-center px-4 py-1">
                                        <button className="text-buttonColor text-center text-3xl">-</button> <span>5</span> <button className="text-buttonColor">+</button>
                                    </div>
                                </div>
                            </div>

                            <div className=" relative border border-1 border-yellow-500 rounded-lg">
                                <div className="absolute top-0 left-5 transform -translate-y-1/2  flex bg-yellow-500 w-40 rounded-lg justify-center py-1">
                                    <Image src='/images/discount.png' alt='discout' width={1000} height={1000} className="w-5 h-5" />
                                    <span className="text-black">Buy 9 for 10 SEK</span>
                                </div>
                                <div className="flex items-center justify-between p-3 py-2 rounded-lg  ">
                                    <div className="flex gap-2">
                                        <div className="flex flex-col ietms-center justify-cernter p-5">
                                            <Image src='/images/grocery.png' alt='product' className="h-10 w-10" width={1000} height={1000} />
                                            <span className="bg-red-500 text-white px-2">18+</span>
                                        </div>

                                        <div className="flex flex-col gap-1 items-center justify-center">
                                            <span className="text-xl">Kisan</span>
                                            <p>Lorem 4g</p>
                                            <span className="text-buttonColor">40.00 SEK</span>
                                        </div>
                                    </div>

                                    <div className=" font-semibold text-2xl flex items-center justify-between gap-6 border border-1 border-yellow-500 rounded-full items-center justify-center px-4 py-1">
                                        <button className="text-buttonColor text-center text-3xl">-</button> <span>5</span> <button className="text-buttonColor">+</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <div className="w-full flex items-center justify-center gap-3">
                                <Image src='/images/discounGreen.png' alt='' className="h-6 w-6" width={1000} height={1000} />
                                <span className="text-center text-buttonColor text-xl font-bold">Products</span>
                            </div>

                            <div className="flex flex-col gap-5">
                                <div className="flex items-center justify-between p-3 py-2 border-gray-500 rounded-lg border border-1 border-gray-200">
                                    <div className="flex gap-2">
                                        <div className="flex flex-col ietms-center justify-cernter p-5">
                                            <Image src='/images/grocery.png' alt='product' className="h-10 w-10" width={1000} height={1000} />
                                            <span className="bg-red-500 text-white px-2">18+</span>
                                        </div>

                                        <div className="flex flex-col gap-1 items-center justify-center">
                                            <span className="text-xl">Kisan</span>
                                            <p>Lorem 4g</p>
                                            <span className="text-buttonColor">40.00 SEK</span>
                                        </div>
                                    </div>

                                    <div className=" font-semibold text-2xl flex items-center justify-between gap-6 border border-1 border-yellow-500 rounded-full items-center justify-center px-4 py-1">
                                        <button className="text-buttonColor text-center text-3xl">-</button> <span>5</span> <button className="text-buttonColor">+</button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-3 py-2 border-gray-500 rounded-lg border border-1 border-gray-200">
                                    <div className="flex gap-2">
                                        <div className="flex flex-col ietms-center justify-cernter p-5">
                                            <Image src='/images/grocery.png' alt='product' className="h-10 w-10" width={1000} height={1000} />
                                            <span className="bg-red-500 text-white px-2">18+</span>
                                        </div>

                                        <div className="flex flex-col gap-1 items-center justify-center">
                                            <span className="text-xl">Kisan</span>
                                            <p>Lorem 4g</p>
                                            <span className="text-buttonColor">40.00 SEK</span>
                                        </div>
                                    </div>

                                    <div className=" font-semibold text-2xl flex items-center justify-between gap-6 border border-1 border-yellow-500 rounded-full items-center justify-center px-4 py-1">
                                        <button className="text-buttonColor text-center text-3xl">-</button> <span>5</span> <button className="text-buttonColor">+</button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-3 py-2 border-gray-500 rounded-lg border border-1 border-gray-200">
                                    <div className="flex gap-2">
                                        <div className="flex flex-col ietms-center justify-cernter p-5">
                                            <Image src='/images/grocery.png' alt='product' className="h-10 w-10" width={1000} height={1000} />
                                            <span className="bg-red-500 text-white px-2">18+</span>
                                        </div>

                                        <div className="flex flex-col gap-1 items-center justify-center">
                                            <span className="text-xl">Kisan</span>
                                            <p>Lorem 4g</p>
                                            <span className="text-buttonColor">40.00 SEK</span>
                                        </div>
                                    </div>

                                    <div className=" font-semibold text-2xl flex items-center justify-between gap-6 border border-1 border-yellow-500 rounded-full items-center justify-center px-4 py-1">
                                        <button className="text-buttonColor text-center text-3xl">-</button> <span>5</span> <button className="text-buttonColor">+</button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-3 py-2 border-gray-500 rounded-lg border border-1 border-gray-200">
                                    <div className="flex gap-2">
                                        <div className="flex flex-col ietms-center justify-cernter p-5">
                                            <Image src='/images/grocery.png' alt='product' className="h-10 w-10" width={1000} height={1000} />
                                            <span className="bg-red-500 text-white px-2">18+</span>
                                        </div>

                                        <div className="flex flex-col gap-1 items-center justify-center">
                                            <span className="text-xl">Kisan</span>
                                            <p>Lorem 4g</p>
                                            <span className="text-buttonColor">40.00 SEK</span>
                                        </div>
                                    </div>

                                    <div className=" font-semibold text-2xl flex items-center justify-between gap-6 border border-1 border-yellow-500 rounded-full items-center justify-center px-4 py-1">
                                        <button className="text-buttonColor text-center text-3xl">-</button> <span>5</span> <button className="text-buttonColor">+</button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-3 py-2 border-gray-500 rounded-lg border border-1 border-gray-200">
                                    <div className="flex gap-2">
                                        <div className="flex flex-col ietms-center justify-cernter p-5">
                                            <Image src='/images/grocery.png' alt='product' className="h-10 w-10" width={1000} height={1000} />
                                            <span className="bg-red-500 text-white px-2">18+</span>
                                        </div>

                                        <div className="flex flex-col gap-1 items-center justify-center">
                                            <span className="text-xl">Kisan</span>
                                            <p>Lorem 4g</p>
                                            <span className="text-buttonColor">40.00 SEK</span>
                                        </div>
                                    </div>

                                    <div className=" font-semibold text-2xl flex items-center justify-between gap-6 border border-1 border-yellow-500 rounded-full items-center justify-center px-4 py-1">
                                        <button className="text-buttonColor text-center text-3xl">-</button> <span>5</span> <button className="text-buttonColor">+</button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-3 py-2 border-gray-500 rounded-lg border border-1 border-gray-200">
                                    <div className="flex gap-2">
                                        <div className="flex flex-col ietms-center justify-cernter p-5">
                                            <Image src='/images/grocery.png' alt='product' className="h-10 w-10" width={1000} height={1000} />
                                            <span className="bg-red-500 text-white px-2">18+</span>
                                        </div>

                                        <div className="flex flex-col gap-1 items-center justify-center">
                                            <span className="text-xl">Kisan</span>
                                            <p>Lorem 4g</p>
                                            <span className="text-buttonColor">40.00 SEK</span>
                                        </div>
                                    </div>

                                    <div className=" font-semibold text-2xl flex items-center justify-between gap-6 border border-1 border-yellow-500 rounded-full items-center justify-center px-4 py-1">
                                        <button className="text-buttonColor text-center text-3xl">-</button> <span>5</span> <button className="text-buttonColor">+</button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-3 py-2 border-gray-500 rounded-lg border border-1 border-gray-200">
                                    <div className="flex gap-2">
                                        <div className="flex flex-col ietms-center justify-cernter p-5">
                                            <Image src='/images/grocery.png' alt='product' className="h-10 w-10" width={1000} height={1000} />
                                            <span className="bg-red-500 text-white px-2">18+</span>
                                        </div>

                                        <div className="flex flex-col gap-1 items-center justify-center">
                                            <span className="text-xl">Kisan</span>
                                            <p>Lorem 4g</p>
                                            <span className="text-buttonColor">40.00 SEK</span>
                                        </div>
                                    </div>

                                    <div className=" font-semibold text-2xl flex items-center justify-between gap-6 border border-1 border-yellow-500 rounded-full items-center justify-center px-4 py-1">
                                        <button className="text-buttonColor text-center text-3xl">-</button> <span>5</span> <button className="text-buttonColor">+</button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-3 py-2 border-gray-500 rounded-lg border border-1 border-gray-200">
                                    <div className="flex gap-2">
                                        <div className="flex flex-col ietms-center justify-cernter p-5">
                                            <Image src='/images/grocery.png' alt='product' className="h-10 w-10" width={1000} height={1000} />
                                            <span className="bg-red-500 text-white px-2">18+</span>
                                        </div>

                                        <div className="flex flex-col gap-1 items-center justify-center">
                                            <span className="text-xl">Kisan</span>
                                            <p>Lorem 4g</p>
                                            <span className="text-buttonColor">40.00 SEK</span>
                                        </div>
                                    </div>

                                    <div className=" font-semibold text-2xl flex items-center justify-between gap-6 border border-1 border-yellow-500 rounded-full items-center justify-center px-4 py-1">
                                        <button className="text-buttonColor text-center text-3xl">-</button> <span>5</span> <button className="text-buttonColor">+</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            <div className="w-full h-20 bg-white flex justify-center items-center fixed bottom-0 left-0 w-full ">
                <button className="bg-buttonColor text-white rounded-full text-center px-28 py-4 font-bold text-2xl"
                    onClick={handleCheckouClick}>{cartProducts.length > 0 ? ('Check out') : ('Start shopping')}</button>
            </div>
        </div>
    )
}

export default Cart;