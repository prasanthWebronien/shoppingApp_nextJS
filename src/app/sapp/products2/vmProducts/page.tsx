'use client'

import { useParams } from 'next/navigation';
import axios from "axios";
import Image from "next/image";
import { TypeProduct, CartProduct } from "@/types/product";
// import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { updateDiscountProductInCartVMP, updateNormalProductIncartVMP, updateSaleRuleProductInCartVMP, changeProductQuantity, fetchNobareCodeProducts, fetchCurrence, findTotal, fetchVMProducts } from '@/utils/helpers';
import CloseIcon from "../../components/icons/CloseIcon";
import Cart from '../components/cart';
import { useShowCart } from "../context/ShowCartContext";
import { useSearch } from "../context/SearchContext";
import AgeRestriction from '../components/ageRistriction';
import { AnyAaaaRecord } from 'node:dns';

type Category = {
    id: string;
    parent_id: string;
    shop_id: string;
    value: string;
    type: string;
    metaData: object;
    weight: number;
    created: string;
    updated: string;
    productCount: number;
};

const categoryProducts = () => {
    const router = useRouter();
    const { showCart } = useShowCart();
    const { data: session } = useSession();
    const [storeID, setStoreID] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [isAlert, setIsAlert] = useState<boolean>(false);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [currence, setCurrence] = useState<string>('SEK');
    const [ageRestriction, setAgerestriction] = useState<number>(0);
    const [saleRule, setSalerule] = useState<any[]>([]);
    const [products, setProducts] = useState<TypeProduct[]>([]);
    const [noProduct, setNoproduct] = useState<boolean>(false);
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>('');
    const [selectedProduct, setSelectedProduct] = useState<any>({});
    const [isAgeRestriction, setIsAgeRestriction] = useState(false);
    const [isProductfetched, setisProductfetched] = useState<boolean>(false);
    const [saleruleProduct, setSaleruleProduct] = useState<TypeProduct[]>([]);
    const { searchText, setSearchText } = useSearch();

    useEffect(() => {
        setSearchText('');
        let doorStatus = localStorage.getItem('doorStatus') || '';
        if (!session?.user?.fname && doorStatus !== 'opened') {
            router.push('/sapp/dashBoard2');
        }
        const store = localStorage.getItem('storeID') || '';
        const aToken = session?.user?.aToken ?? '';
        const rToken = session?.user?.rToken ?? '';
        const shopID = localStorage.getItem('storeID') || '';
        const addedProducts: CartProduct[] = JSON.parse(localStorage.getItem("VMcart") || '[]');
        setTotalPrice(Number(findTotal(addedProducts, '+')));
        getCurrencyType(storeID, aToken, rToken);
        const currency = localStorage.getItem('currence') || 'SEK';

        setCurrence(currency);
        setStoreID(store);
        fetchVMProducts(
            shopID,
            setLoading,
            setProducts,
            aToken,
            setisProductfetched,
            addedProducts,
            rToken
        );
    }, []);

    const getCurrencyType = async (store: string, accessToken: string, refreshToken: string) => {
        await fetchCurrence(store, accessToken, refreshToken);
    }

    const handleAddClick = (Product: TypeProduct) => {
        let result = checkAgeRistriction(Product);
        if (result) {
            handlingAdd(Product); // pass the product directly
        }
    };

    const handlingAdd = (Product: TypeProduct) => {
        if (Product.isDiscount) {
            updateDiscountProductInCartVMP(Product, '+', setProducts, setTotalPrice);
        } else if (Product.sale && Product.salePrice === 0 && Product.saleGroupRules.length > 0) {
            updateSaleRuleProductInCartVMP(Product, '+', setProducts, setTotalPrice, setSalerule);
        } else {
            updateNormalProductIncartVMP(Product, '+', setProducts, setTotalPrice);
        }
    };

    const handleIncrement = (Product: TypeProduct) => {
        if (Product.quantity === Product.availableItems) {
            setIsAlert(true);
            setAlertMessage(`Stock available only ${Product.quantity}`);
            return;
        }

        if (Product.isDiscount) {
            updateDiscountProductInCartVMP(Product, '+', setProducts, setTotalPrice);
        } else if (Product.sale && Product.salePrice === 0 && Product.saleGroupRules.length > 0) {
            updateSaleRuleProductInCartVMP(Product, '+', setProducts, setTotalPrice, setSalerule);
        } else {
            updateNormalProductIncartVMP(Product, '+', setProducts, setTotalPrice);
        }
    };

    const handleDecrement = (Product: TypeProduct) => {
        if (Product.isDiscount) {
            updateDiscountProductInCartVMP(Product, '-', setProducts, setTotalPrice);
        } else if (Product.sale && Product.salePrice === 0 && Product.saleGroupRules.length > 0) {
            updateSaleRuleProductInCartVMP(Product, '-', setProducts, setTotalPrice, setSalerule);
        } else {
            updateNormalProductIncartVMP(Product, '-', setProducts, setTotalPrice);
        }
    };

    const showSalePopup = (productID: string) => {
        const foundProduct: TypeProduct | undefined = products?.find(product => product._id === productID);
        const temp: TypeProduct[] = [];

        if (foundProduct) {
            temp.push(foundProduct);
        }

        if (foundProduct) {
            setSaleruleProduct(temp);
            setSalerule(temp[0].saleGroupRules);
            setShowPopup(true);
        }
    };

    const checkAgeRistriction = (Product: any) => {
        if (Product.ageRestriction !== '') {
            setIsAgeRestriction(true);
            setAgerestriction(Product.ageRestriction);
            setSelectedProduct(Product); 
            return false;
        }
        return true;
    };
    
    const handleAgeRestrictionButtonClick = (action: string) => {
        if (action == 'yes') {
            handlingAdd(selectedProduct);
        }
        setIsAgeRestriction(false);
    }

    return (
        <div className="">
            {loading ? (
                <div className="h-[100dvh] flex items-center justify-center bg-buttonColor">
                    <Image src="/images/loader.gif" alt="loder" width={1000} height={1000} />
                </div>
            ) : (
                <div className="font-poppins px-3 bg-white">
                    {isProductfetched ? (
                        <div className=" flex flex-col bg justify-center items-center h-full w-full gap-2 ">
                            <Image src='/images/ProductsNotFoundpng.png' alt='' width={1000} height={1000} className="h-52 w-52" /><button onClick={() => { router.push(`/sapp/stores`) }} className="bg-buttonColor text-white text-lg font-semibold px-10 py-3 rounded-full">Check other stores</button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center flex-1">
                            {products?.length > 0 ? (
                                <div className="flex flex-col mb-5 gap-2 w-full mt-20 overflow-y-auto pb-24">
                                    {products?.filter((product) => product.isVending).map((product) => (
                                        <div key={product._id}
                                            className="flex px-1 justify-between bg-gray-50 rounded-lg items-center w-full py-3 border-2 border-gray-200 outline-none"
                                        >
                                            <div className="flex items-center justify-center gap-3">
                                                <div className="flex flex-col rounded-md">
                                                    <Image src={`/images/grocery.png`} alt='' width={1000} height={1000} className="h-16 w-14 p-1 bg-gray-100" />
                                                    {product.ageRestriction && (
                                                        <span className="bg-red-700 text-white text-center rounded-b-md w-full">
                                                            18+
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex flex-col">
                                                        <strong className="text-black">{product.title}</strong>
                                                        {!product.isDiscount ? (
                                                            <div className="flex items-center">
                                                                <strong className="text-buttonColor font-semibold">
                                                                    {product.price + '  ' + currence}
                                                                </strong>

                                                                {product.sale &&
                                                                    product.salePrice == 0 &&
                                                                    product.saleGroupRules.length > 0 && (
                                                                        <Image
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                showSalePopup(product._id);
                                                                            }}
                                                                            src='/images/discount.png' alt='Sale' width={1000} height={1000} className="h-5 w-5 ml-3" />
                                                                    )}
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center">
                                                                <strong className="font-semibold text-buttonColor">
                                                                    {(product.price - (product.price * product.discount) / 100).toFixed(2)}
                                                                    <span className="text-gray-400 ml-2 line-through decoration-red-500">
                                                                        {product.price + ' ' + currence}
                                                                    </span>
                                                                </strong>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-black font-bold text-lg">
                                                {product.quantity === 0 || product.quantity === undefined ? (
                                                    <button
                                                        onClick={() =>
                                                            handleAddClick({ ...product, quantity: product.quantity ?? 0 })
                                                        }
                                                        className="border-2 border-buttonColor outline-none py-1 px-5 text-center rounded-full"
                                                    >
                                                        Add
                                                    </button>
                                                ) : (
                                                    <div className="flex justify-between gap-4 border-2 border-buttonColor outline-none py-1 px-5 text-center rounded-full">
                                                        <button onClick={() => handleDecrement(product)}>-</button>
                                                        <span>{product.quantity}</span>
                                                        <button onClick={() => handleIncrement(product)}>+</button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col mb-5 gap-2 w-full h-[100dvh] items-center justify-center">
                                    <Image src='/images/ProductsNotFoundpng.png' width={1000} height={1000} alt='' className="h-44 w-44" />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {
                isAgeRestriction && (
                    <div className="fixed text-lg inset-0 flex items-center justify-center bg-black bg-opacity-50 px-2 pb-5 font-poppins z-50">
                        <div className="flex flex-col gap-3 bg-white rounded-lg relative p-5 gap-5">
                            <Image src='/images/Group.png' alt='icon' className='w-10 h-10 absolute top-[-20] left-48' width={1000} height={100} />
                            <div className="flex flex-col w-full items-center justify-center gap-2">
                                <strong className="text-center">This Product is Restricted from Consumption for</strong>
                                <strong className="text-red-500 text-center">People Below the age of {ageRestriction}</strong>
                                <strong className="text-center">Click <span className="text-red-500">YES</span> if you wish to add this product to the cart</strong>
                            </div>

                            <div className="flex items-center justify-center gap-2 w-full">
                                <button

                                    className="bg-red-500 text-white text-center rounded-full px-16 py-3"
                                    onClick={() => handleAgeRestrictionButtonClick('yes')}
                                >
                                    Yes
                                </button>
                                <button

                                    className="bg-gray-200 text-black text-center rounded-full px-16 py-3"
                                    onClick={() => handleAgeRestrictionButtonClick('no')}
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {showPopup && (
                <div className="fixed inset-0 flex items-end justify-center bg-black bg-opacity-50 px-5 pb-5 font-poppins z-[100]" >
                    <div className="w-full max-h-[500px] bg-white rounded-2xl px-4 py-5 relative bottom-32">
                        <div className="flex items-center justify-between pb-2">
                            <div className="flex  items-center justify-start gap-x-2">
                                <Image src='/images/discount.png' alt='' width={1000} height={1000} className="h-8 w-8" />
                                <strong className="tracking-wide text-black">Offers</strong>
                            </div>
                            <CloseIcon className="text-buttonColor" onClick={() => setShowPopup(false)} />
                        </div>

                        <div key={saleruleProduct[0]._id} className="flex justify-between items-center w-full py-3 border-gray-200">
                            <div className="flex items-center justify-center gap-3">
                                <div className="flex flex-col rounded-md">
                                    <Image src={saleruleProduct[0].picture ? saleruleProduct[0].picture : `/images/24sjuIcon.png`} alt='' className="h-16 w-14 p-1 bg-gray-100" width={1000} height={1000} />
                                    {saleruleProduct[0].ageRestriction && (
                                        <span className="bg-red-700 text-white text-center rounded-b-md w-full">
                                            18+
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-col">
                                        <strong className="text-black">{saleruleProduct[0].title}</strong>
                                        {!saleruleProduct[0].isDiscount ? (
                                            <div className="flex items-center">
                                                <strong className="text-buttonColor font-semibold">{saleruleProduct[0].price} {currence}</strong>
                                            </div>
                                        ) : (
                                            <div className="flex items-center">
                                                <strong className="font-semibold text-buttonColor">
                                                    {(saleruleProduct[0].price - (saleruleProduct[0].price * saleruleProduct[0].discount) / 100).toFixed(2)}
                                                    <span className="text-gray-400 ml-2 line-through decoration-red-500">{saleruleProduct[0].price} {currence}</span>
                                                </strong>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className=" font-bold text-lg">
                                {saleruleProduct[0].quantity == 0 ? (
                                    <button
                                        onClick={() => handleAddClick(saleruleProduct[0])}
                                        className="border-2 text-buttonColor border-gray-200 outline-none py-1 px-5 text-center rounded-full"
                                    >
                                        Add
                                    </button>
                                ) : (
                                    <div className="flex justify-between gap-4 border-2 border-gray-200 outline-none py-1 px-5 text-center rounded-full">
                                        <button className="text-buttonColor" onClick={() => handleDecrement(saleruleProduct[0])}>-</button>
                                        <span className="text-black">{saleruleProduct[0].quantity}</span>
                                        <button className="text-buttonColor" onClick={() => handleIncrement(saleruleProduct[0])}>+</button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            {saleRule.map((rule: any, index: number) => rule.status === 'Active' && (
                                <div
                                    key={index}
                                    className={`flex flex-col border-2 border-gray-200 rounded-md items-center justify-center relative py-2 
                      ${rule.isSaleApplied ? 'bg-buttonColor text-white' : 'bg-white text-gray-400'}`} // Change background based on isSaleApplied
                                >
                                    <div className="flex w-full justify-center items-center flex-1 py-4">
                                        <p className="text-lg text-black">
                                            BUY <span>{rule.count}</span> FOR <span className="font-semibold">{rule.price} {currence}</span>
                                        </p>
                                        <Image src='/images/tick.png' alt='' width={1000} height={1000} className={`h-7 w-7 rounded-full absolute right-2 ${rule.isSaleApplied ? 'block' : 'hidden'}`} />
                                    </div>
                                    <p className={`h-3 ${(saleruleProduct[0].quantity + 1) % rule.count === 0 ? 'block' : 'hidden'} w-full  text-center py-3 bg-gray-100 text-redColor justify-center items-center flex absolute bottom-0 font-bold text-lg rounded-b-md text-black`}>ADD 1 ITEM TO APPLY OFFER</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {
                isAlert && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-5 pb-5 font-poppins z-20">
                        <div className="bg-white w-[280px] h-[150px] rounded-md flex flex-col justify-center items-center gap-3">
                            <h1 className="text-xl text-buttonColor">{alertMessage}</h1>
                            <button className="px-16 py-2 bg-buttonColor rounded-full text-white font-bold text-xl" onClick={() => setIsAlert(false)}>OK</button>
                        </div>
                    </div>
                )
            }

            {noProduct && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-5 pb-5 font-poppins z-20">
                    <div className="w-96 h-48 bg-white rounded-xl flex flex-col items-center justify-center gap-2">
                        <Image src='/images/basket.png' alt='' width={1000} height={1000} className="h-14 w-14" />
                        <strong className="text-black font-semibold text-lg">Please add product</strong>
                        <button onClick={() => { setNoproduct(false) }} className="px-14 py-3 rounded-full bg-buttonColor text-white font-semibold text-xl text-center">Okey</button>
                    </div>
                </div>
            )}

            {showCart && <Cart />}
        </div>
    )
}

export default categoryProducts;
