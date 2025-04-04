'use client'

import axios from "axios"
import Image from "next/image"
import { useRouter } from "next/navigation"
import React, { useState, useEffect } from "react"
import { findTotal, fetchVMProducts, fetchNobareCodeProducts, fetchFProducts, updateCartProductQuantity } from '@/utils/helpers';

const Checkout = () => {
    const route = useRouter();
    const [isPayCliked, setIsPayClicked] = useState(false);
    const [cartProducts, setCartProducts] = useState<any[]>([]);
    const [currency, setCurrency] = useState<string>('SEK');
    const [ref, setRef] = useState('');
    const handleCountClick = (action: string) => {
        if (action == '-') {

        } else {

        }
    }

    useEffect(() => {
        let temp: any = [];
        let cartFPProducts = JSON.parse(localStorage.getItem('FPcart') || '[]');
        let cartVMProducts = JSON.parse(localStorage.getItem('VMcart') || '[]');
        let cartNOCProducts = JSON.parse(localStorage.getItem('NBCcart') || '[]');
        cartNOCProducts.forEach((product: any) => {
            temp.push(product);
        })

        cartVMProducts.forEach((product: any) => {
            temp.push(product);
        })

        cartFPProducts.forEach((product: any) => {
            temp.push(product);
        })

        console.log(temp);
        setCartProducts(temp);
        let total = localStorage.getItem('total');


        const storedCurrency = localStorage.getItem('currency');
        if (storedCurrency) {
            setCurrency(storedCurrency);
        }
    }, [])

    const handlePayClicked = () => {
        route.push('/sapp/payment');
    }

    return (
        <>
            <div className="flex flex-col bg-white text-black px-5 font-poppins h-[100dvh]">
                <div className="flex items-center justify-center h-20 w-full fixed top-0 left-0 w-full px-5 relative bg-white">
                    <Image src='/images/leftArrowGreen.png' alt='' className="w-9 h-9  absolute left-3" width={1000} height={1000} />
                    <strong className="text-2xl font-bold">Check out</strong>
                </div>

                {
                    cartProducts.length < 0 ? (
                        <div className="flex flex-col items-center justify-center text-black w-full my-20 flex-1 px-10 gap-6 min-h-[350px]" >
                            <Image src='/images/emptyCart.png' alt='emptyCart' className="h-36 w-36" width={1000} height={1000} />
                            <strong>Your cart i s empty</strong>
                            <p className="text-center">Looks like you have no items in your cart start  adding products to your cart</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-5 flex-1 overflow-y-auto mb-20">
                            <div className="flex flex-col gap-3">
                                <div className="w-full flex items-center justify-center gap-3">
                                    <Image src='/images/discounGreen.png' alt='' className="h-6 w-6" width={1000} height={1000} />
                                    <span className="text-center text-buttonColor text-xl font-bold">Products</span>
                                </div>

                                <div className="flex flex-col gap-5">
                                    {cartProducts
                                        ?.filter((product) => product.productType !== "saleRule")
                                        .map((product) => (
                                            <div
                                                key={product.productID}
                                                className="flex justify-between items-center border-2 border-gray-300 rounded-lg px-4 py-2 mb-4"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Image
                                                        src={product.picture ? product.picture : `/images/grocery.png`}
                                                        alt=""
                                                        className="w-14 h-16 object-cover"
                                                        width={100}
                                                        height={100}
                                                    />
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-black">{product.title}</span>
                                                        <span className="text-lightBlack">Qty: {product.productCount}</span>
                                                        <span className="text-buttonColor font-semibold text-lg">
                                                            {product.price + " " + currency}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex text-2xl font-bold font-semibold items-center justify-center gap-2 border-2 border-gray-400 rounded-full px-8 py-4 h-4">
                                                    <button onClick={() => updateCartProductQuantity(product, '-', setRef)}>-</button>
                                                    <span>{product.productCount}</span>
                                                    <button onClick={() => updateCartProductQuantity(product, '+', setRef)}>+</button>
                                                </div>
                                            </div>
                                        ))}

                                    {cartProducts
                                        .filter((pro: any) => pro.productType === "saleRule")
                                        .map((pro: any, index: any) => {
                                            let total = pro.totalCount;
                                            pro.saleRuleDetails.forEach((rule: any) => {
                                                if (rule.isSaleApplied) {
                                                    total -= rule.productQuantiy * rule.saleRule.count;
                                                }
                                            });

                                            return (
                                                <div key={index}>
                                                    {pro.saleRuleDetails.map((rule: any, ruleIndex: number) =>
                                                        rule.isSaleApplied ? (
                                                            <div
                                                                key={ruleIndex}
                                                                className="flex justify-between items-center border-2 border-buttonColor rounded-lg px-4 py-2 mb-4"
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <Image
                                                                        src={pro.picture ? pro.picture : `/images/grocery.png`}
                                                                        alt=""
                                                                        className="w-14 h-16 object-cover"
                                                                        width={100}
                                                                        height={100}
                                                                    />
                                                                    <div className="flex flex-col">
                                                                        <span className="font-bold text-black">{pro.title}</span>
                                                                        <span className="text-lightBlack">
                                                                            Qty: {rule.productQuantiy * rule.saleRule.count}
                                                                        </span>
                                                                        <span className="text-buttonColor font-semibold text-lg">
                                                                            {rule.productQuantiy * rule.saleRule.price + " " + currency}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex font-semibold items-center justify-center gap-2 border-2 border-gray-400 rounded-full px-8 py-4 h-4">
                                                                    <button onClick={() => updateCartProductQuantity(pro, '-', setRef)}>-</button>
                                                                    <span>{rule.productQuantiy * rule.saleRule.count}</span>
                                                                    <button onClick={() => updateCartProductQuantity(pro, '+', setRef)}>+</button>
                                                                </div>
                                                            </div>
                                                        ) : null
                                                    )}

                                                    {total > 0 && (
                                                        <div className="flex justify-between items-center border-2 border-red-300 rounded-lg px-4 py-2 mb-4">
                                                            <div className="flex items-center gap-2">
                                                                <Image
                                                                    src={pro.picture ? pro.picture : `/images/grocery.png`}
                                                                    alt=""
                                                                    className="w-14 h-16 object-cover"
                                                                    width={100}
                                                                    height={100}
                                                                />
                                                                <div className="flex flex-col">
                                                                    <span className="font-bold text-black">{pro.title}</span>
                                                                    <span className="text-lightBlack">Qty: {total}</span>
                                                                    <span className="text-buttonColor font-semibold text-lg">
                                                                        {total * pro.productPrice + " " + currency}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="flex font-semibold items-center justify-center gap-2 border-2 border-gray-400 rounded-full px-8 py-4 h-4">
                                                                <button onClick={() => updateCartProductQuantity(pro, '-', setRef)}>-</button>
                                                                <span>{total}</span>
                                                                <button onClick={() => updateCartProductQuantity(pro, '+', setRef)}>+</button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        </div>
                    )
                }

                <div className="w-full h-20 bg-white flex justify-center items-center fixed bottom-0 left-0 w-full flex gap-5">
                    <div className="bg-buttonColor rounded-full p-3 flex items-center justify-center">
                        <Image src='/images/add-shopping-bag.png' alt='bag' className="h-10 w-10" width={1000} height={1000} />
                    </div>
                    <button className="bg-buttonColor text-white rounded-full text-center px-28 py-4 font-bold text-2xl text-center" onClick={handlePayClicked}>Pay</button>
                </div>
            </div>
        </>

    )
}

export default Checkout;
