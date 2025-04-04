'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const ReceiptPage = () => {
    const [htmlContent, setHtmlContent] = useState<string>('');
    const { data: session } = useSession();
    const route = useRouter();

    useEffect(() => {
        // Fetch the receipt HTML content from API or localStorage
        const fetchReceipt = async () => {
            try {
                const storedHtml = localStorage.getItem('recipt');
                if (storedHtml) {
                    setHtmlContent(storedHtml);  // Set the HTML from localStorage
                }
            } catch (error) {
                console.error("Error fetching receipt:", error);
            }
        };

        fetchReceipt();
    }, []);

    return (
        <div className='  h-[100dvh]'>
            {/* Render the HTML content directly */}
            <div
                dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
        </div>
    );
};

export default ReceiptPage;
