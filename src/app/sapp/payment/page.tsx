'use client'

import axios from "axios"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

const PaymentPage = () => {
    const route = useRouter();
    const [isPayCliked, setIsPayClicked] = useState(false);
    const [total, setTotal] = useState<any>(0);
    const [selected, setSelected] = useState('');

    useEffect(() => {
        let total = localStorage.getItem('VMTotal') || '';
        total = total.replace(/[^0-9.]/g, '');
        let numericValue = parseFloat(total);
        setTotal((numericValue));

    }, [])

    const handleCheckout = async () => {
        if (selected == '') {
            alert('please select a payment method');
            return;
        }
        setIsPayClicked(true);
        route.push('/sapp/purchase');

    };

    return (
        <>
            <div className="bg-white text-black flex flex-col px-6 py-7">
                <header className="flex items-center justify-between h-20 fixed left-0 top-0 w-full bg-white px-5">
                    <Image src='/images/leftArrowGreen.png' alt='back' className="h-9 w-9 " width={1000} height={1000} />
                    <strong className="text-xl font-bold">Payment</strong>
                    <Image src='/images/decline.png' alt='close' className="h-12 w-12 " width={1000} height={1000} />
                </header>

                <main className="mt-20 gap-7 flex flex-col">
                    <div
                        className="flex items-center justify-between rounded-lg shadow-md p-5"
                        onClick={() => setSelected("swish")}
                    >
                        <div className="flex items-center justiy-center gap-2">
                            <Image
                                src="/images/swidisPaymentLog.png"
                                alt="swish"
                                width={1000}
                                height={1000}
                                className="h-8 w-8"
                            />
                            <strong className="text-xl font-bold">Swish</strong>
                        </div>

                        {/* Show Green radio if selected, otherwise show Gray */}
                        {selected === "swish" ? (
                            <Image
                                src="/images/Greenradio-button-checked.png"
                                alt="greenRadio"
                                className="w-10 h-10"
                                width={1000}
                                height={1000}
                            />
                        ) : (
                            <Image
                                src="/images/Grayradio-button-checked.png"
                                alt="grayRadio"
                                className="w-10 h-10"
                                width={1000}
                                height={1000}
                            />
                        )}
                    </div>

                    <div
                        className="flex items-center justify-between rounded-lg shadow-md p-3"
                        onClick={() => setSelected("card")}
                    >
                        <div className="flex gap-2 items-center justiy-center">
                            <Image
                                src="/images/ionic-ios-card.png"
                                alt="card"
                                width={1000}
                                height={1000}
                                className="h-8 w-8"
                            />
                            <strong className="text-xl font-bold">Pay with Card</strong>
                        </div>

                        {/* Show Green radio if selected, otherwise show Gray */}
                        {selected === "card" ? (
                            <Image
                                src="/images/Greenradio-button-checked.png"
                                alt="greenRadio"
                                className="w-10 h-10"
                                width={1000}
                                height={1000}
                            />
                        ) : (
                            <Image
                                src="/images/Grayradio-button-checked.png"
                                alt="grayRadio"
                                className="w-10 h-10"
                                width={1000}
                                height={1000}
                            />
                        )}
                    </div>
                </main>

                <footer className="w-full h-20 fixed left-0 bottom-0 flex items-center justify-center">
                    <button className="bg-buttonColor px-28 py-3 text-white text-center rounded-full "
                        onClick={handleCheckout}>Pay - {total}</button>
                </footer>
            </div>

            {
                isPayCliked &&

                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-2 pb-5 font-poppins z-20 ">
                    <div className="bg-white text-black flex flex-col justify-center items-center gap-5 w-full h-[180px] absolute bottom-0 left-0">
                        <Image src='/images/loaderGreen.gif' alt='' width={1000} height={1000} className="h-10 w-10" />
                        <strong>Payment Processing</strong>
                    </div>
                </div>
            }
        </>

    )
}

export default PaymentPage;