'use client'

import { useEffect, useState } from 'react';
import ArrowLeftIcon from '../../components/icons/ArrowLeftIcon';
import SearchIcon from '../../components/icons/SearchIcon';
import { useRouter } from 'next/navigation';

const Header = () => {
    const [headerText, setHeaderText] = useState('');
    const router = useRouter();
    useEffect(() => {
        const path = window.location.pathname;
        const subFolder = path.split('/sapp/products2/')[1];
        let dynamicText = '';

        switch (subFolder) {
            case 'vmProducts':
                dynamicText = 'Varuautomat';
                break;
            case 'noBarcodeProducts':
                dynamicText = 'Varor utan streckkod';
                break;
            default:
                dynamicText = 'Smart-Kl';
        }

        setHeaderText(dynamicText);
    }, []);

    // const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const searchTerm = e.target.value.toLowerCase();
    //     const cartProducts: CartProduct[] = JSON.parse(localStorage.getItem('VMcart') || '[]');

    //     const searchUrl = searchTerm.trim() === ''
    //         ? `${apiUrl}/products?shopId=${storeID}&isVending=true`
    //         : `${apiUrl}/products?shopId=${storeID}&title=${searchTerm}&limit=50&productType=vending`;

    //     try {
    //         const response = await axios.get(searchUrl, {
    //             headers: {
    //                 'Authorization': `Bearer ${accessToken}`,
    //                 'accept': '*/*',
    //                 'env': environment,
    //             },
    //         });

    //         let fetchedProducts: TypeProduct[] = response.data.data;

    //         if (cartProducts.length > 0) {
    //             fetchedProducts = changeProductQuantity(fetchedProducts,'VMcart');
    //         }

    //         setProducts(fetchedProducts);
    //         setSearchTerm(searchTerm);
    //     } catch (error) {
    //         console.error('Error fetching products:', error);
    //     }
    // };

    return (
        <header className="bg-white text-white px-5 font-poppins">
            <div className="flex items-center justify-center w-full relative py-8">
                <ArrowLeftIcon className="text-buttonColor w-9 h-9 absolute left-3" onClick={()=>router.push('/sapp/dashBoard2')}/>
                <strong className="text-black ml-10 text-2xl font-semibold">{headerText}</strong>
            </div>

            <div className="relative w-full">
                <SearchIcon className="text-buttonColor w-6 h-6 absolute right-3 top-1/2 transform -translate-y-1/2" />
                <input
                    type="text"
                    placeholder="sok"
                    className="rounded-full px-1 pl-5 py-3 border border-2 border-yellow-500 w-full"  // Add left padding to create space for the icon
                />
            </div>
        </header>
    );
};

export default Header;