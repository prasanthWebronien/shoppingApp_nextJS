'use client';

import Image from "next/image";

type AgeRestrictionProps = {
    ageRestriction: string | number;
    setIsAgeRestriction: (value: boolean) => void;
    setCanProductAdd: (value: boolean) => void;
};

const AgeRestriction = ({ ageRestriction, setIsAgeRestriction, setCanProductAdd }: AgeRestrictionProps) => {

    const handleButtonClick = (action: string) => {
        if (action === 'yes') {
            setCanProductAdd(true);
        } else {
            setCanProductAdd(false);
        }
        setIsAgeRestriction(false);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-2 pb-5 font-poppins z-50">
            <div className="flex flex-col gap-3 bg-white rounded-lg relative p-5 gap-5">
                <Image src='/images/Group.png' alt='icon' className='w-10 h-10 absolute top-[-20] left-48' width={1000} height={100} />
                <div className="flex flex-col w-full items-center justify-center gap-2">
                    <strong className="text-center">This Product is Restricted from Consumption for</strong>
                    <strong className="text-red-500 text-center">People Below the age of {ageRestriction}</strong>
                    <strong className="text-center">Click <span className="text-red-500">YES</span> if you wish to add this product to the cart</strong>
                </div>

                <div className="flex items-center justify-center gap-2 w-full">
                    <button
                        onClick={() => handleButtonClick('yes')}
                        className="bg-red-500 text-white text-center rounded-full px-16 py-3"
                    >
                        Yes
                    </button>
                    <button
                        onClick={() => handleButtonClick('no')}
                        className="bg-gray-200 text-black text-center rounded-full px-16 py-3"
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AgeRestriction;
