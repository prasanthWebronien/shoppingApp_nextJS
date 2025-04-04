'use client'

import React, { useState, useEffect } from "react"
import Image from "next/image"

const ProductUnavailable = () => {
    const [image, setImage] = useState<string>('/images/vmNoproducts.png');
    const bothImages = [
        '/images/vmNoproducts.png',
        '/images/fridge.png',
    ];

    useEffect(() => {
        const path = window.location.pathname;
        const subFolder = path.split('/sapp/products2/')[1];

        if (subFolder == 'vmProducts') {
            setImage(bothImages[0]);
        }
        else if(subFolder == 'FridgeProducts') {
            setImage(bothImages[1]);
        }

    }, []);

    return (
        <div className="flex flex-col gap-4 text-black bg-white flex-1 justify-center items-center">
            <Image src={image} alt='noVmProducts' className="h-24 w-20" width={1000} height={1000} />
            <strong className="text-xl font-semibold">Products are currently unavailable</strong>
            <p className="text-lg ">Please check back later for their availability!</p>
        </div>
    )
}

export default ProductUnavailable;