'use client'

import Image from "next/image";
import { useRouter } from "next/navigation";

interface NotNeartoStoreProps {
    setNoDoor: (value: boolean) => void;
}

const NotNeartoStore: React.FC<NotNeartoStoreProps> = ({ setNoDoor }) => {
    const router = useRouter();

    const handleCloseClick=()=>{
        localStorage.removeItem('doorStatus');
        setNoDoor(false)
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-5 pb-5 font-poppins z-[100]" >
            <div className="flex flex-col items-center justify-center gap-5 bg-white text-black relative px-5 py-10 rounded-lg">
                <Image 
                    src='/images/decline.png' 
                    alt='close' 
                    width={1000} 
                    height={1000} 
                    className="h-10 w-10 absolute top-2 right-2 cursor-pointer" 
                    onClick={handleCloseClick}
                />
                <Image 
                    src='/images/doorUnavailable.png' 
                    alt='doorUnavailable' 
                    width={1000} 
                    height={1000} 
                    className="w-28 h-28" 
                />
                <strong className="text-center text-xl">
                    You must be in front of the Store Door to unlock it!
                </strong>
                <button 
                    className="text-white text-center bg-buttonColor rounded-full px-16 py-3 text-xl font-bold"
                    onClick={() => router.push('/sapp/stores')}
                >
                    Find Nearby Stores
                </button>
            </div>
        </div>
    );
};

export default NotNeartoStore;
