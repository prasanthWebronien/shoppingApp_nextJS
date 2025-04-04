'use client'

import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { refreshSession } from "@/lib/auth/refreshSession";

const HistoryPage = () => {
    const route = useRouter();
    const { data: session } = useSession();
    const userID = session?.user?.id;
    const [loading, setLoading] = useState<boolean>(false);
    const [nextPage, setNextPage] = useState('');
    const apiUrl = process.env.NEXT_PUBLIC_APP_AUTH_API_URL
    const environment = process.env.NEXT_PUBLIC_APP_ENVIRONMENT
    const [purchaseDetails, setPurchaseDetails] = useState<any>([]);

    useEffect(() => {
        if (!session?.user.fname) {
            route.push("/sapp");
        }
        let accessToken: any = session?.user.aToken;
        fetchPurchaseHistory(accessToken);
    }, [route, session?.user.fname]);

    const fetchPurchaseHistory = async (accessToken: string) => {
        setLoading(true);

        try {
            const response = await axios.get(`${apiUrl}/storedatasync/erp-task-user-v1/${userID}/purchase-sync`,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'accept': '*/*',
                        'env': environment,
                    }
                }
            );

            console.log(response.data.data[0]);
            if (response.status) {
                let next = (response.data.next);
                if (next) {
                    setNextPage(next);
                }
                setPurchaseDetails(response.data.data);
            }

        } catch (error: unknown) {
            let refreshToken = session?.user.rToken ?? ''
            if (typeof error === "object" && error !== null && "status" in error && (error as { status: number }).status === 401) {
                const newToken: any = await refreshSession(refreshToken);
                if (newToken != null) {
                    fetchPurchaseHistory(accessToken);
                }
            }
        }
        finally {
            setLoading(false);
        }
    };

    const handleReciptClick = (reciptID: string) => {
        console.log(reciptID);
    }

    const formatDateTime = (timestamp: string) => {
        const date = new Date(timestamp);

        const formattedDate = date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short", // 👉 'Mar' instead of 'March'
            year: "numeric",
        });

        const formattedTime = date.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });

        return `${formattedDate.replace(",", "")} ${formattedTime}`;
    };

    return (
        <div className="text-black bg-white flex flex-col gap-12 py-8 px-5">
            <div className="flex ietms-center justify-center relative fixed top-0 left-0">
                <strong className="text-xl">History</strong>
                <Image src='/images/leftArrowGreen.png' alt='arrowLeft' width={1000} height={1000} className=" h-7 w-7 absolute left-0" />
            </div>

            <div className="flex flex-col gap-5 overflow-y-auto">

                {purchaseDetails.map((receipt: any, index: any) => {
                    return (
                        <div
                            key={receipt.id || index}
                            className="py-4 py-5 flex justify-between bg-gray-100 rounded-xl w-full px-5"
                            onClick={() => handleReciptClick(receipt.id)}
                        >
                            <div className="flex flex-col gap-2">
                                <h1 className="text-xl font-bold">
                                    Kvitto <span className="text-buttonColor">{receipt.id}</span>
                                </h1>
                                <div className="flex b w-full items-center">
                                    <div className="flex gap-3 items-center">
                                        {formatDateTime(receipt.details.time)} |
                                        <div className="flex items-center gap-2">
                                            <Image
                                                src="/images/ionic-ios-card.png"
                                                alt=""
                                                width={1000}
                                                height={1000}
                                                className="w-5 h-5"
                                            />
                                            <span className="text-xl flex items-center">{receipt.details.properties.method}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center gap-2">
                                <span className="tracking-wide flex items-center justify-center bg-buttonColor rounded-lg text-white px-3 h-8">
                                    BetaId
                                </span>

                                <Image src="/images/ios-arrowGrey.png" alt="" className="w-6 h-6" width={1000} height={1000} />
                            </div>
                        </div>
                    );
                })}

            </div>
        </div>
    )
}

export default HistoryPage;