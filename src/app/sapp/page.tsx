'use client'

import { useRouter } from 'next/navigation';
import React from "react"
import Image from "next/image"
import { fetchStoresUtils, fetchCurrence, getCurrectLocation, fetchStoresForBankID } from "@/utils/helpers"
import { signIn, useSession, getSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react"
import axios from 'axios';

// import { Spin } from 'antd'; // Import the Spin component
 
export default function Home() {

    const [otpValues, setOtpValues] = useState<string[]>(Array(5).fill(""));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [showOTPField, setShowOTPField] = useState<boolean>(false);
    const [isUserLogin, setIsUserLogin] = useState<boolean>(false);
    const [pnumber, setPnumber] = useState<number>(0);
    const { data: session } = useSession();
    const [err, setErr] = useState<string>('');
    const router = useRouter();
    const Distance = 15000
    const [accessToken, setAccessToken] = useState<string>('');
    const [refresfToken, setRefreshToken] = useState<string>('');
    const apiURL = process.env.NEXT_PUBLIC_APP_API_URL;

    type LoginData = {
        login_type: string;
        login_id: string;
        login_name: string;
        device_type: string;
    };

    const loginData: LoginData = {
        login_type: "bankid",
        login_id: "199609052387",
        login_name: "Jegan",
        device_type: "android",
    };

    const getCurrectLocation = async () => {
        const getPosition = () => {
            return new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    (position) => resolve(position),
                    (err) => reject(err),
                    {
                        timeout: 10000,
                        enableHighAccuracy: true,
                        maximumAge: 0,
                    }
                );
            });
        };

        while (true) {
            try {
                const position = await getPosition();
                const { latitude, longitude } = position.coords;

                // Return the values instead of assigning
                return { latitude, longitude };
            } catch (err) {
                console.warn("Location error, retrying...", err);
                await new Promise((res) => setTimeout(res, 3000)); // Wait before retry
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target; // Extract input value
        setPnumber(Number(value));
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validatePhoneNumber(String(pnumber))) {
            setErr("Invalid phone number");
            return;
        }

        setErr(""); // Reset error
        setShowOTPField(true); // Show OTP fields
    };

    const validatePhoneNumber = (phoneNumber: string) => {
        const phoneRegex = /^[0-9]{10}$/;
        return phoneRegex.test(phoneNumber);
    };

    const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;

        if (!/^[0-9]?$/.test(value)) return;

        setOtpValues((prevOtpValues) => {
            const newOtpValues = [...prevOtpValues];
            newOtpValues[index] = value;
            return newOtpValues;
        });

        // Move focus to the next input only if a digit was entered
        if (value && index < inputRefs.current.length - 1) {
            setTimeout(() => {
                inputRefs.current[index + 1]?.focus();
            }, 10);  // Slight delay to ensure state updates before focus shift
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {

        if (e.key === "Backspace" && !otpValues[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (!/^[0-9]$/.test(e.key) && e.key !== "Backspace" && e.key !== "Tab") {

            e.preventDefault();
        }
    };

    const BankcId = async () => {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        try {
            const response = await axios.get(`${apiURL}/bankid/auth`, {
                params: { endUserIp: '1.1.1.1' },
                headers: { Accept: 'application/json' },
            });

            let redirectURL = 'https://shopping.storetech.ai/sapp';
            localStorage.setItem('orderReferance', response.data.orderRef);
            const bankIdLink = `https://app.bankid.com/?autostarttoken=${response.data.autoStartToken}&redirect=${redirectURL}`;
            if (isMobile) {
                window.location.href = bankIdLink;
            } else {
                window.location.href = "https://bankid.example.com";
            }

        } catch (err) {
            console.error('Error:', err);
        }
    }

    const handleOTPSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const enteredOTP = otpValues.join("");

        if (enteredOTP.length !== 5) {
            setErr("Please enter the complete OTP");
            return;
        }

        setIsUserLogin(true);
        try {
            const result = await signIn("credentials", {
                login_type: loginData.login_type,
                login_id: loginData.login_id,
                login_name: loginData.login_name,
                device_type: loginData.device_type,
                redirect: false, // Optional: Prevent automatic redirection
            });

            const session = await getSession();
            if (result?.status === 200) {
                router.push('/sapp/dashBoard2');
                // const aToken = session?.user.aToken || '';
                // const rToken = session?.user.rToken || '';

                // const fetchedStores = await fetchStoresUtils(aToken, rToken, 'getCurrectLocatio1');
                // const nearbyStore = fetchedStores?.[0];
                // localStorage.setItem('nearByStore', JSON.stringify(nearbyStore));

                // if (nearbyStore && nearbyStore.distanceInKm <= Number(Distance)) {
                //     localStorage.setItem('storeID', nearbyStore.id);
                //     router.push('/sapp/StoreDoor');
                // } else {
                //     router.push('/sapp/stores');
                // }
            }
        } catch (error) {
            console.error('Error: ' + error);
        }
    };

    useEffect(() => {
        let doorStatus = localStorage.getItem('door') || '';

        if (session?.user.fname && doorStatus != 'opened') {
            router.push("sapp/dashBoard2");
        }
        const orderReference = localStorage.getItem('orderReferance');
        setAccessToken(session?.user?.aToken ?? '');
        setRefreshToken(session?.user?.rToken ?? '');
        if (orderReference !== null) {
            checkUser(orderReference);
        }
    }, []);

    const checkUser = async (orderReferenceToken: string) => {
        setIsUserLogin(true);
        let location = await getCurrectLocation();;


        try {
            const response = await axios.get(`https://tawapi.obemannadbutik.se/v1/app/bankid/collect`, {
                params: { orderRef: orderReferenceToken }, // or 'hihihi' directly
                headers: {
                    Accept: 'application/json',
                    env: 'demo'
                }
            });

            const user = response.data.user;

            if (user === null) {
                setIsUserLogin(false);
                return;
            }

            const result = await signIn("credentials", {
                login_type: loginData.login_type,
                login_id: user.personalNumber,
                login_name: user.name,
                device_type: 'android',
                redirect: false,
            });
            const session = await getSession();

            if (result?.status === 200) {
                router.push('/sapp/dashBoard2');
                // const aToken = session?.user.aToken || '';
                // const rToken = session?.user.rToken || '';

                // const fetchedStores = await fetchStoresForBankID(aToken, rToken, location)
                // const nearbyStore = fetchedStores?.[0];

                // if (nearbyStore && nearbyStore.distanceInKm <= Number(Distance)) {
                //     localStorage.setItem('storeID', nearbyStore.id);
                //     localStorage.setItem('nearByStore', JSON.stringify(nearbyStore));
                //     router.push('/sapp/StoreDoor');
                // } else {
                //     router.push('/sapp/stores');
                // }
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="h-[100dvh] flex flex-col justify-center font-poppins px-5 bg-buttonColor gap-8"
            style={{ backgroundImage: 'url(/images/shopping-app-bg.svg)', backgroundSize: 'contain' }}>
            <div className="h-1/4 w-full flex flex-col items-center justify-center mt-10 gap-3">
                <strong className="text-white text-3xl font-bold">Welcome!</strong>
                <Image src='/images/loginUser.png' alt='login user image' width={1000} height={1000} className="h-[180px] w-[180px]" />
                <h1 className="text-3xl font-bold text-white">Sign In</h1>
            </div>

            <div className=" w-full flex flex-col items-center gap-x-1 mt-10">
                <form onSubmit={showOTPField ? handleOTPSubmit : handleFormSubmit} className="flex flex-col flex-grow justify-center flex-1 gap-4 py-5 bg-white rounded-lg px-6 shadow-lg ">
                    <div className="flex flex-col gap-2 w-full">
                        <label htmlFor="phone" className="font-semibold text-lg text-gray-700 ml-2">Phone Number</label>
                        <input
                            type="number"
                            name="pnumber"
                            className="w-full bg-white text-black border border-gray-300 outline-none py-3 px-4 rounded-md focus:ring-2 focus:ring-buttonColor transition-all"
                            placeholder="Enter mobile number"
                            onChange={handleChange}
                        />

                        {err && (<p className="text-red-500">{err}</p>)}

                        {showOTPField && (
                            <div>
                                <label htmlFor="otp" className="font-semibold text-lg text-gray-700">Enter OTP</label>
                                <div className="flex gap-2">
                                    {otpValues.map((otp, index) => (
                                        <input
                                            ref={(el) => { inputRefs.current[index] = el; }}
                                            key={index}
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            name={`otp${index}`}
                                            id={`otp-${index}`}
                                            maxLength={1}
                                            className="w-[50px] h-[50px] text-black border border-gray-300 outline-none py-3 px-4 text-center rounded-md focus:ring-2 focus:ring-buttonColor transition-all bg-white"
                                            placeholder="-"
                                            value={otp}
                                            onChange={(e) => handleOTPChange(e, index)}
                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <p id='result' className="overflow-x-auto"></p>
                        <button className="bg-red-500 text-white font-semibold rounded-full w-full py-3 transition-all hover:opacity-90">
                            {showOTPField ? 'Validate OTP' : 'GET OTP'}
                        </button>
                        <span className='text-black'>or</span>
                        <a onClick={() => BankcId()} className="text-center bg-buttonColor text-white font-semibold rounded-full w-full py-3 transition-all hover:opacity-90">
                            Sign In using BankID
                        </a>
                        <p className="text-gray-600 text-sm text-center text-wrap">
                            By Signing In you accept our
                            <span className="text-buttonColor font-semibold cursor-pointer"> Terms of Services</span> and
                            <span className="text-buttonColor font-semibold cursor-pointer"> Privacy Policy</span>.
                        </p>

                    </div>
                </form>
            </div>
            {isUserLogin && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-5 pb-5 font-poppins">
                    <div className="loader border-t-4 border-buttonColor rounded-full w-12 h-12 animate-spin"></div>
                </div>
            )}
        </div>
    )
}