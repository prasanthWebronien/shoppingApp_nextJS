'use client'

import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import CloseIcon from "../../components/icons/CloseIcon";
import { refreshSession } from "@/lib/auth/refreshSession";
import ArrowLeftIcon from "../../components/icons/ArrowLeftIcon";
import ArrowRightCircleIcon from "../../components/icons/ArrowRightCircleIcon";
import { stringify } from "querystring";

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
        // let userID = 'YW5kcm9pZCNiYW5raWQxOTkyMDIyNTQ1MTM=';

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

            if (response.status) {
                let next = (response.data.next);
                if (next) {
                    setNextPage(next);
                }
                alert(JSON.stringify(response));
                alert(JSON.stringify(response.data.data));


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

    const handleCPurchaseHistoryClick = async (purchaseID: string) => {
        try {
            // let userID = 'YW5kcm9pZCNiYW5raWQxOTkyMDIyNTQ1MTM=';
            const result = purchaseDetails.find((purchase: { id: string; }) => purchase.id === purchaseID);
            const timeZone = new Intl.DateTimeFormat().resolvedOptions().timeZone;
            let taskID = result.id;
            let language = 'en';
            const response = await axios.get(`${apiUrl}/users/customer/viewReceipt?userId=${userID}&taskId=${taskID}&timeZone=${timeZone}&env=${environment}&lang=${language}`);
            localStorage.setItem('recipt', response.data);
            route.push('/sapp/settings/history/ReceiptPage');
        } catch (err: unknown) {
            console.log(err);
        }
    };

    const handleScroll = async (event: React.UIEvent<HTMLElement>) => {
        let accessToken: any = session?.user.aToken;
        const bottom = event.currentTarget.scrollHeight === event.currentTarget.scrollTop + event.currentTarget.clientHeight;

        // Trigger next API call when scrolling reaches the bottom
        if (bottom) {
            // let userID = 'YW5kcm9pZCNiYW5raWQxOTkyMDIyNTQ1MTM=';
            try {
                const response = await axios.get(`${apiUrl}/storedatasync/erp-task-user-v1/${userID}/purchase-sync/?next=${nextPage}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'accept': '*/*',
                            'env': environment,
                        }
                    }
                );

                if (response.status) {
                    const newRecords = response.data.data;

                    setPurchaseDetails((prevDetails: any) => [
                        ...prevDetails, // Spread the old records
                        ...newRecords   // Add the new records
                    ]);

                    if (response.data.next) {
                        setNextPage(response.data.next)
                    } else {
                        setNextPage('')
                    }
                }

            } catch (error: unknown) {
                let refreshToken = session?.user.rToken ?? '';
                if (typeof error === "object" && error !== null && "status" in error && (error as { status: number }).status === 401) {
                    try {
                        // Attempt to refresh the session
                        const newToken: any = await refreshSession(refreshToken);

                        if (newToken != null) {
                            // After refreshing the session, you need to call handleScroll
                            // Since handleScroll expects an event, simulate the event structure
                            const event = {
                                currentTarget: {
                                    scrollHeight: document.documentElement.scrollHeight,
                                    scrollTop: document.documentElement.scrollTop,
                                    clientHeight: document.documentElement.clientHeight,
                                },
                            };

                            // Call handleScroll with the simulated event
                            await handleScroll(event as React.UIEvent<HTMLElement>);
                        }
                    } catch (err) {
                        console.log('Error during token refresh or handleScroll call:', err);
                    }
                }
            }

        }
    };

    return (
        <div className="flex flex-col px-6 h-[100dvh] font-poppins bg-white">
            <div className="flex items-center justify-between py-8">
                <ArrowLeftIcon className="h-10 w-10 text-buttonColor" onClick={() => route.push(`/sapp/settings`)} />
                <strong className="font-bold text-2xl text-black">History</strong>
                <CloseIcon className="text-buttonColor" onClick={() => route.push(`/sapp/dashBoard`)} />
            </div>

            {loading ? (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-5 pb-5 font-poppins">
                    <div className="loader border-t-4 border-buttonColor rounded-full w-12 h-12 animate-spin"></div>
                </div>
            ) : (
                <div className="flex flex-col gap-3 w-full overflow-y-auto" onScroll={handleScroll}>
                    {
                        purchaseDetails.map((purchase: any) => {
                            const date = new Date(purchase.details.time);
                            const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits
                            const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based
                            const year = date.getFullYear();

                            // Format as "DD-MM-YYYY"
                            const formattedDate = `${day}-${month}-${year}`;

                            return (
                                <div key={purchase.id} className="break-all flex justify-between items-center bg-gray-100 py-2 rounded-lg px-4"
                                    onClick={() => handleCPurchaseHistoryClick(purchase.id)}>
                                    <div className="flex flex-col items-start gap-1 tracking-wider">
                                        <strong className="font-bold text-xl text-black">
                                            Order Receipt
                                            <strong className="text-buttonColor"> {purchase.details.properties.paymentReference}</strong>
                                        </strong>
                                        <span className="font-semibold text-lg text-lightBlack">{formattedDate}</span>
                                    </div>
                                    <ArrowRightCircleIcon className="text-buttonColor w-7 h-7" />
                                </div>
                            );
                        })
                    }
                </div>
            )}
        </div>
    )
}


export default HistoryPage;