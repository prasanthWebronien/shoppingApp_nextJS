"use client"

import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";


const Paymentsuccess_Page = () => {
    const route = useRouter();
    const{data:session}=useSession();

    useEffect(() => {
        let doorStatus=localStorage.getItem('door')|| '';
        if (session?.user.fname && doorStatus!='opened')  {
            route.push("/sapp");
        }
    }, [route, session?.user.fname]);

    return (
        <div className="flex flex-col justify-center items-center h-[100dvh] bg-white">
            <div className="h-1/2 flex flex-col items-center justify-center gap-5">
                <Image src='/images/checklist.png' alt='' className="h-24 w-24" width={1000} height={1000}/>
                <strong className="text-xl font-semibold text-black">Payment Successful!</strong>
            </div>

            <div className="h-1/2 flex flex-col gap-10 items-center mb-24">
                <Image src='/images/Thankyouforshopping.png' alt='' className="w-[325px] h-[250px]" width={1000} height={1000}/>

                <div className="flex flex-col gap-5 items-center">
                    <button className="bg-ligghtGray text-black text-center font-semibold text-xl rounded-full w-[300px] py-3 flex items-center justify-center gap-3">
                        <Image src='/images/reciptIcon.png' alt='' className="h-7 w-7" width={1000} height={1000}/>
                        Receipt
                    </button>
                    <button onClick={() => { route.push('/sapp/products') }} className="bg-buttonColor text-lightWhite text-center rounded-full font-bold text-lg tracking-wider w-[300px] py-3">Done</button>
                </div>
            </div>
        </div>
    )
}

export default Paymentsuccess_Page;