'use client';
import { useRouter } from 'next/navigation';
import React from "react"
import Image from "next/image"
import { signIn, useSession } from "next-auth/react";
import { FC, useState, useEffect, useRef } from "react"
import axios from 'axios';

const Login: FC = () => {
    // const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // // const inputRefs = useRef<(HTMLInputElement | null)[]>(Array.from({ length: 5 }, () => null));
    // const [otpValues, setOtpValues] = useState<string[]>(Array(5).fill(""));
    // const [showOTPField, setShowOTPField] = useState<boolean>(false);
    // const [isUserLogin, setIsUserLogin] = useState<boolean>(false);
    // const [pnumber, setPnumber] = useState<number>(0);
    // const { data: session } = useSession();
    // const [err, setErr] = useState<string>('');
    // const router = useRouter();
    // const Distance = 150000

    // type LoginData = {
    //     login_type: string;
    //     login_id: string;
    //     login_name: string;
    //     device_type: string;
    // };

    // const loginData: LoginData = {
    //     login_type: "bankid",
    //     login_id: "199609052387",
    //     login_name: "Jegan",
    //     device_type: "android",
    // };

    // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const { value } = e.target; // Extract input value
    //     setPnumber(Number(value));
    // };

    // const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();

    //     if (!validatePhoneNumber(String(pnumber))) {
    //         setErr("Invalid phone number");
    //         return;
    //     }

    //     setErr(""); // Reset error
    //     setShowOTPField(true); // Show OTP fields
    // };

    // const validatePhoneNumber = (phoneNumber: string) => {
    //     const phoneRegex = /^[0-9]{10}$/;
    //     return phoneRegex.test(phoneNumber);
    // };

    //const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    //     const value = e.target.value;

    //     if (!/^[0-9]?$/.test(value)) return;

    //     setOtpValues((prevOtpValues) => {
    //         const newOtpValues = [...prevOtpValues];
    //         newOtpValues[index] = value;
    //         return newOtpValues;
    //     });

    //     if (value && index < 4) {
    //         inputRefs.current[index + 1]?.focus();
    //     }
    // };

    // const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    //     const value = e.target.value;

    //     if (!/^[0-9]?$/.test(value)) return;

    //     setOtpValues((prevOtpValues) => {
    //         const newOtpValues = [...prevOtpValues];
    //         newOtpValues[index] = value;
    //         return newOtpValues;
    //     });

    //     // Move focus to the next input only if a digit was entered
    //     if (value && index < inputRefs.current.length - 1) {
    //         setTimeout(() => {
    //             inputRefs.current[index + 1]?.focus();
    //         }, 10);  // Slight delay to ensure state updates before focus shift
    //     }
    // };

    // const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {

    //     if (e.key === "Backspace" && !otpValues[index] && index > 0) {
    //         console.log(inputRefs);
    //         inputRefs.current[index - 1]?.focus();
    //     } else if (!/^[0-9]$/.test(e.key) && e.key !== "Backspace" && e.key !== "Tab") {

    //         e.preventDefault();
    //     }
    // };

    // const BankcId = async () => {

    //     const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    //     try {
    //         const response = await axios.get('https://devapi-tanlux.storetech.ai/v1/bankid/auth', {
    //             params: { endUserIp: '1.1.1.1' }, // Query parameter
    //             headers: { Accept: 'application/json' }, // Header
    //         });
    //         localStorage.setItem('orderReferance', response.data.orderRef);
    //         const redirectURL = `https://vending.webronics.com`;
    //         const bankIdLink = `https://app.bankid.com/?autostarttoken=${response.data.autoStartToken}&redirect=${redirectURL}`;
    //         if (isMobile) {
    //             window.location.href = bankIdLink; // Open BankID app
    //         } else {
    //             window.location.href = "https://bankid.example.com"; // Redirect to web authentication
    //         }
    //         // console.log('Response:', response.data);
    //     } catch (err) {
    //         console.error('Error:', err);
    //     }
    // }

    // const handleOTPSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     const enteredOTP = otpValues.join("");

    //     if (enteredOTP.length !== 5) {
    //         setErr("Please enter the complete OTP");
    //         return;
    //     }
    //     try {
    //         const result = await signIn("credentials", {
    //             login_type: loginData.login_type,
    //             login_id: loginData.login_id,
    //             login_name: loginData.login_name,
    //             device_type: loginData.device_type,
    //             redirect: false, // Optional: Prevent automatic redirection
    //         });

    //         if (result?.status === 200) {
    //             const accessToken = session?.user?.aToken ?? '';
    //             const refrestToken = session?.user?.rToken ?? '';
    //             const fetchedStores = await fetchStoresUtils(accessToken,refrestToken);
    //             const nearbyStore = fetchedStores?.[0];

    //             if (nearbyStore && nearbyStore.distanceInKm <= Number(Distance)) {
    //                 localStorage.setItem('storeID', nearbyStore.id);
    //                 router.push('/StoreDoor');
    //             } else {
    //                 router.push('/stores');
    //             }
    //             // let fetchedStore = fetchedStores[0];
    //         }
    //     } catch (error) {
    //         console.error('Error: ' + error);
    //     }

    //     // try {
    //     //     // const response = await axios.post("http://localhost:30001/api/auth/verify-otp", {
    //     //     //   phoneNumber: data.pnumber,
    //     //     //   otp: enteredOTP,
    //     //     // });
    //     //     // const response={
    //     //     //   data:'suc'
    //     //     // };

    //     //     const response = true;

    //     //     const result = await signIn("credentials", {
    //     //         loginData: JSON.stringify(loginData), 
    //     //         redirect: false,  // This prevents the default redirect to /api/auth/error
    //     //     });


    //     //     console.log("Response from NextAuth:", result);

    //     //     // if (response) {

    //     //     //     const result:any = await signIn("credentials", {
    //     //     //         loginData: JSON.stringify(loginData),
    //     //     //         env: "demo",
    //     //     //         redirect: false,
    //     //     //     });

    //     //     //     if (result?.error) {
    //     //     //         console.error("Login Failed:", result.error);
    //     //     //     } else {
    //     //     //         console.log("Stores:", result.stores); // Stores are fetched separately
    //     //     //         const  nearbyStore=result.stores;

    //     //     //         if (nearbyStore.distanceInKm <= Distance) {
    //     //     //             // router.push("/products", { state: { stores: nearbyStore.id } });
    //     //     //             localStorage.setItem('storeID', nearbyStore.id);
    //     //     //         } else {
    //     //     //             router.push('/stores');

    //     //     //         }
    //     //     //     }

    //     //     // } else {
    //     //     //     setErr("Invalid OTP. Please try again.");
    //     //     // }
    //     // } catch (error) {
    //     //     console.error("Error verifying OTP:", error);
    //     //     setErr("Error verifying OTP.");
    //     // }

    // };

    // const checkUser = async (orderRef: string) => {
    //     setIsUserLogin(true);
    //     try {
    //         const response = await axios.get('https://devapi-tanlux.storetech.ai/v1/bankid/collect', {
    //             params: { orderRef },  // Sending orderRef as a query parameter
    //             headers: { Accept: 'application/json' } // Required header
    //         });

    //         let user = response.data;
    //         user = user.user;

    //         if (user === null) {
    //             setIsUserLogin(false);
    //         }


    //         const result = await signIn("credentials", {
    //             login_type: loginData.login_type,
    //             login_id: user.personalNumber,
    //             login_name: user.name,
    //             device_type: 'android',
    //             redirect: false, // Optional: Prevent automatic redirection
    //         });

    //         if (result?.status === 200) {
    //             const accessToken = session?.user?.aToken ?? '';

    //             const fetchedStores = await fetchStoresUtils(accessToken);
    //             const nearbyStore = fetchedStores[0];

    //             if (nearbyStore.distanceInKm <= Number(Distance)) {
    //                 router.push('/products');
    //                 localStorage.setItem('storeID', nearbyStore.id);
    //             } else {
    //                 router.push('/stores');
    //             }
    //             // let fetchedStore = fetchedStores[0];
    //         }


    //     } catch (err) {
    //         console.log(err);
    //     }
    // }

    // useEffect(() => {
    //     if (session?.user.name) {
    //         router.push("/products");
    //     }

    //     const orderRefernce = localStorage.getItem('orderReferance');
    //     if (orderRefernce !== null) {
    //         checkUser(orderRefernce);
    //     }
    // // eslint-disable-next-line react-hooks/exhaustive-deps

    // }, [ router, session?.user.name]);

    // useEffect(() => {
    //     const checkUser = async (orderRef: string) => {
    //         setIsUserLogin(true);
    //         try {
    //             const response = await axios.get('https://devapi-tanlux.storetech.ai/v1/bankid/collect', {
    //                 params: { orderRef },
    //                 headers: { Accept: 'application/json' }
    //             });

    //             const user = response.data.user;

    //             if (user === null) {
    //                 setIsUserLogin(false);
    //                 return;
    //             }

    //             const result = await signIn("credentials", {
    //                 login_type: loginData.login_type,
    //                 login_id: user.personalNumber,
    //                 login_name: user.name,
    //                 device_type: 'android',
    //                 redirect: false,
    //             });

    //             if (result?.status === 200) {
    //                 const accessToken = session?.user?.aToken ?? '';
    //                 const refrestToken = session?.user?.rToken ?? '';
    //                 const fetchedStores:any = await fetchStoresUtils(accessToken,refrestToken);
    //                 const nearbyStore:any = fetchedStores[0];
    //                 if (nearbyStore.distanceInKm <= Number(Distance)) {
    //                     router.push('/products');
    //                     localStorage.setItem('storeID', nearbyStore.id);
    //                 } else {
    //                     router.push('/stores');
    //                 }
    //             }
    //         } catch (err) {
    //             console.log(err);
    //         }
    //     };

    //     if (session?.user.fname) {
    //         router.push("/products");
    //     }

    //     const orderReference = localStorage.getItem('orderReferance');
    //     if (orderReference !== null) {
    //         checkUser(orderReference);
    //     }
    // }, [router, session?.user.fname, loginData.login_type, session?.user?.aToken]);


    return (
        <div></div>
        // <div
        //     className="flex flex-col h-[100dvh] justify-center font-poppins px-5 overflow-y-scroll hidden-scrollbar bg-buttonColor"
        //     style={{ backgroundImage: 'url(/images/shopping-app-bg.svg)', backgroundSize: 'contain' }}
        // >
        //     <div className="h-1/2 w-full flex flex-col items-center justify-center gap-6 mt-10">
        //         <strong className="text-white text-3xl font-bold">Welcome!</strong>
        //         <Image src='../../public/images/loginUser.png' alt='login user image' width={1000} height={1000} className="h-[200px] w-[200px]" />
        //         <h1 className="text-3xl font-bold text-white mt-7">Sign In</h1>
        //     </div>

        //     <div className="h-1/2  w-full flex flex-col items-center justify- gap-x-1 mt-5 ">
        //         <form onSubmit={showOTPField ? handleOTPSubmit : handleFormSubmit} className="flex flex-col gap-6 bg-white rounded-lg py-7 px-6 shadow-lg">
        //             <div className="flex flex-col gap-3 w-full">
        //                 <label htmlFor="phone" className="font-semibold text-lg text-gray-700 ml-2">Phone Number</label>
        //                 <input
        //                     type="number"
        //                     name="pnumber"
        //                     className="w-full border border-gray-300 outline-none py-3 px-4 rounded-md focus:ring-2 focus:ring-buttonColor transition-all"
        //                     placeholder="Enter mobile number"
        //                     onChange={handleChange}
        //                 />

        //                 {err && (<p className="text-red-500">{err}</p>)}

        //                 {showOTPField && (
        //                     <div>
        //                         <label htmlFor="otp" className="font-semibold text-lg text-gray-700">Enter OTP</label>
        //                         <div className="flex gap-2">
        //                             {otpValues.map((otp, index) => (
        //                                 // <input
        //                                 //     key={index}
        //                                 //     type="text"
        //                                 //     inputMode="numeric"
        //                                 //     pattern="[0-9]*"
        //                                 //     name={`otp${index}`}
        //                                 //     id={`otp-${index}`}
        //                                 //     maxLength={1}
        //                                 //     className="w-[50px] h-[50px] border border-gray-300 outline-none py-3 px-4 text-center rounded-md focus:ring-2 focus:ring-buttonColor transition-all"
        //                                 //     placeholder="-"
        //                                 //     value={otp}
        //                                 //     onChange={(e) => handleOTPChange(e, index)}
        //                                 //     onKeyDown={(e) => handleKeyDown(e, index)}
        //                                 // />

        //                                 // <input
        //                                 //     ref={(el) => ((inputRefs).current[index] = el)}
        //                                 //     key={index}
        //                                 //     type="text"
        //                                 //     inputMode="numeric"
        //                                 //     pattern="[0-9]*"
        //                                 //     name={`otp${index}`}
        //                                 //     id={`otp-${index}`}
        //                                 //     maxLength={1}
        //                                 //     className="w-[50px] h-[50px] border border-gray-300 outline-none py-3 px-4 text-center rounded-md focus:ring-2 focus:ring-buttonColor transition-all"
        //                                 //     placeholder="-"
        //                                 //     value={otp}
        //                                 //     onChange={(e) => handleOTPChange(e, index)}
        //                                 //     onKeyDown={(e) => handleKeyDown(e, index)}
        //                                 // />

        //                                 <input
        //                                     ref={(el) => {
        //                                         inputRefs.current[index] = el;
        //                                     }}
        //                                     key={index}
        //                                     type="text"
        //                                     inputMode="numeric"
        //                                     pattern="[0-9]*"
        //                                     name={`otp${index}`}
        //                                     id={`otp-${index}`}
        //                                     maxLength={1}
        //                                     className="w-[50px] h-[50px] border border-gray-300 outline-none py-3 px-4 text-center rounded-md focus:ring-2 focus:ring-buttonColor transition-all"
        //                                     placeholder="-"
        //                                     value={otp}
        //                                     onChange={(e) => handleOTPChange(e, index)}
        //                                     onKeyDown={(e) => handleKeyDown(e, index)}
        //                                 />
        //                             ))}
        //                         </div>
        //                     </div>
        //                 )}
        //             </div>

        //             <div className="flex flex-col items-center gap-2">

        //                 <p id='result' className="overflow-x-auto"></p>
        //                 <button className="bg-red-500 text-white font-semibold rounded-full w-full py-3 transition-all hover:opacity-90">
        //                     {showOTPField ? 'Validate OTP' : 'GET OTP'}
        //                 </button>
        //                 <span className='text-black'>or</span>
        //                 <a onClick={() => BankcId()} className="text-center bg-buttonColor text-white font-semibold rounded-full w-full py-3 transition-all hover:opacity-90">
        //                     Sign In using BankID
        //                 </a>
        //                 <p className="text-gray-600 text-sm text-center text-wrap">
        //                     By Signing In you accept our
        //                     <span className="text-buttonColor font-semibold cursor-pointer"> Terms of Services</span> and
        //                     <span className="text-buttonColor font-semibold cursor-pointer"> Privacy Policy</span>.
        //                 </p>

        //             </div>
        //         </form>
        //     </div>

        //     {isUserLogin && (
        //         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-5 pb-5 font-poppins">
        //             <div className="loader border-t-4 border-buttonColor rounded-full w-12 h-12 animate-spin"></div>
        //         </div>
        //     )}

        // </div>
    )
}

export default Login;