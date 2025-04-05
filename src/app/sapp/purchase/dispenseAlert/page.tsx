'use client'

import Image from "next/image";
import { useRouter } from "next/navigation"
import React, { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

const dispensingAlert = () => {
    const route = useRouter();
    const [total, setTotal] = useState<string>('');
    const [currency, setCurrency] = useState<string>('SEK');
    const { data: session } = useSession();

    useEffect(() => {
        let doorStatus = localStorage.getItem('doorStatus');
        if (!session?.user?.fname && doorStatus != 'opened') {
            route.push("/sapp");
            return;
        }

        let total = localStorage.getItem('total') || '';
        const storedCurrency = localStorage.getItem('currency');

        setTotal(total);
        if (storedCurrency) {
            setCurrency(storedCurrency);
        }

        localStorage.removeItem('VMcart');
        localStorage.removeItem('responseID');
    }, [])

    const handleClick = (text: string) => {
        if (text == 'Proceed') {
            route.push('/sapp/products');
            localStorage.removeItem('VMtotal');
        }
        route.push('/sapp/products');
        localStorage.removeItem('VMtotal');

    };
    return (
        <div className="h-[100dvh] bg-white flex flex-col py-3 px-7 pb-5">
            <div className="h-8 flex justify-center itmes-center w-full gap-2 text-red-500  mb-4 pt-4">
                <Image src='/images/GroupRed.png' alt='' width={1000} height={1000} className="h-8 w-8" />
                <strong className="text-xl font-bold text-lg">Products Dispense Alert</strong>
            </div>

            <div className="flex-1 overflow-y-scroll  scrollbar-hide py-5">

                {/* {checkOutProducts
                    ?.filter((product) => product.productType !== "saleRule")  
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

                {checkOutProducts
                    .filter(pro => pro.productType === 'saleRule')
                    .map((pro: SaleRuleProduct, index) => {
                        let total = pro.totalCount;

                        pro.saleRuleDetails.forEach((rule: any) => {
                            if (rule.isSaleApplied) {
                                total -= (rule.productQuantiy * rule.saleRule.count);
                            }
                        });

                        return (
                            <div key={index} className="">
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
                    })} */}

            </div>

            <div className="flex flex-col gap-2 text-black text-center gap-5 text-lg py-5">
                <strong>
                    There was a delay processing your request. Please
                    ensure that the products has been dispensed.
                </strong>

                <strong>
                    if the products were not dispensed, Your payment
                    will be automatically refunded within 5-7 business
                    days.
                </strong>

                <strong className="text-red-500">Reference ID : 44bfel42fds554wf</strong>

                <strong className="font-bold text-xl">{total}{currency}</strong>

                <h1>Total Amount {total}</h1>

                <button className="text-white bg-buttonColor rounded-full px-15 py-4 text-center" onClick={() => handleClick('Contact')}>Contact 24SJU Support</button>
                <button className="text-white bg-yellow-500 rounded-full px-15 py-4 text-center" onClick={() => handleClick('Proceed')}>Proceed</button>
            </div>
        </div>
    )
}

export default dispensingAlert;