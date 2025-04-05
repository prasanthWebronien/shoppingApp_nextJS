'use client'

import { useSession } from "next-auth/react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import React, { useState, useEffect } from "react"
import { TypeProduct, SaleRuleProduct, CartProduct, CheckOutProduct, SaleRuleDetail } from "@/types/product";
import { findTotal, fetchVMProducts, fetchNobareCodeProducts, fetchFProducts, updateCartProductQuantity } from '@/utils/helpers';

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

interface NotNeartoStoreProps {
    setShowCar: (value: boolean) => void;
}

const Cart: React.FC<NotNeartoStoreProps> = ({ setShowCar }) => {
    const route = useRouter();
    const [ref, setRef] = useState('');
    const { data: session } = useSession();
    const [currency, setCurrency] = useState<string>('SEK');
    const [total, setTotal] = useState<number>(0);
    const [products, setProducts] = useState<TypeProduct[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isProductfetched, setisProductfetched] = useState<boolean>(false);
    const [checkOutProducts, setCheckoutProducts] = useState<CheckOutProduct[]>([]);
    const [cartProducts, setCartProducts] = useState<CartProduct[]>([]);

    const [cartVMProucts, setCartVMProducts] = useState<CartProduct[]>([]);
    const [cartFProducts, setCartFProducts] = useState<CartProduct[]>([]);
    const [cartNoBProducts, setCartNoBProducts] = useState<CartProduct[]>([]);
    const checkOutArray: (CheckOutProduct[] | CartProduct[])[] = [];
    const [temp, setTemp] = useState([]);
    const [allCartProducts, setAllCartProducts] = useState<any[]>([]);

    const handleCheckouClick = () => {
        let cartLength = allCartProducts.length;
        console.log(cartLength);

        if (cartLength > 0) {
            route.push('/sapp/cart/checkout');
        }
        else {
            route.push('dashBoard2');
        }
    }

    const handleCountClick = (action: string) => {
        if (action == '-') {

        } else {

        }
    }

    const handleCloseClick = () => {
        localStorage.removeItem('doorStatus');
        setShowCar(false)
    }


    useEffect(() => {
        const aToken = session?.user?.aToken ?? '';
        const rToken = session?.user?.rToken ?? '';
        const store = localStorage.getItem('storeID') || '';
        const cartVMProducts: CartProduct[] = JSON.parse(localStorage.getItem("VMcart") || '[]');
        const cartFProducts: CartProduct[] = JSON.parse(localStorage.getItem("FPcart") || '[]');
        const cartNoBProducts: CartProduct[] = JSON.parse(localStorage.getItem("NBCcart") || '[]');
        setCartVMProducts(cartVMProducts);
        setCartFProducts(cartFProducts);
        setCartNoBProducts(cartNoBProducts);
        setTotal(Number(findTotal(cartVMProducts, '+')));
        setTotal(Number(findTotal(cartFProducts, '+')));
        setTotal(Number(findTotal(cartNoBProducts, '+')));


        const storedCurrency = localStorage.getItem('currency');
        if (storedCurrency) {
            setCurrency(storedCurrency);
        }

        fetchProduct(store, aToken, cartVMProducts, cartFProducts, cartNoBProducts, rToken);
        let VMtotal = Number(localStorage.getItem('VMtotal')) || 0;
        let NOBTotal = Number(localStorage.getItem('NBCTotal')) || 0;
        let FPcart = Number(localStorage.getItem('FPtotal')) || 0;

        let actualTotal = VMtotal + NOBTotal + FPcart;
    }, [ref])


    const fetchProduct = async (store: string, aToken: string, cartVMProducts: CartProduct[], cartFProducts: CartProduct[], cartNoBProducts: CartProduct[], rToken: string) => {
        let combinedCartProducts: CartProduct[] = [];
        console.log(cartVMProducts);
        console.log(cartFProducts);
        console.log(cartNoBProducts);

        try {
            if (cartVMProducts.length > 0) {
                const fetchedProducts: TypeProduct[] = await fetchVMProducts(store, setLoading, setProducts, aToken, setisProductfetched, cartVMProducts, rToken);

                const updatedCartProduct: CartProduct[] = cartVMProducts.map((cartItem) => {
                    const matchingProduct = fetchedProducts.find(
                        (product: TypeProduct) => product._id === cartItem.productID
                    );

                    if (matchingProduct) {
                        return {
                            ...cartItem,
                            picture: matchingProduct.picture,
                            title: matchingProduct.title,
                        };
                    }
                    return cartItem;
                });
                setCartProducts(updatedCartProduct);

                const proArr: CheckOutProduct[] = updatedCartProduct.map((pro) => ({
                    productId: pro.productID,
                    quantity: pro.productType === "saleRule" ? pro.totalCount : pro.productCount,
                }));

                const updatedCartProductWithType = updatedCartProduct.map((product) => ({
                    ...product,
                    type: 'VM'
                }));

                combinedCartProducts = [...combinedCartProducts, ...updatedCartProductWithType];
                checkOutArray.push(updatedCartProduct);
                setCheckoutProducts(proArr);
            }

            if (cartFProducts.length > 0) {

                const fetchedProducts: TypeProduct[] = await fetchFProducts(store, setLoading, setProducts, aToken, setisProductfetched, cartFProducts, rToken);

                const updatedCartProduct: CartProduct[] = cartFProducts.map((cartItem) => {
                    const matchingProduct = fetchedProducts.find(
                        (product: TypeProduct) => product._id === cartItem.productID
                    );

                    if (matchingProduct) {
                        return {
                            ...cartItem,
                            picture: matchingProduct.picture,
                            title: matchingProduct.title,
                        };
                    }
                    return cartItem;
                });

                setCartProducts(updatedCartProduct);

                const proArr: CheckOutProduct[] = updatedCartProduct.map((pro) => ({
                    productId: pro.productID,
                    quantity: pro.productType === "saleRule" ? pro.totalCount : pro.productCount,
                }));

                const updatedCartProductWithType = updatedCartProduct.map((product) => ({
                    ...product,
                    type: 'FP'
                }));

                combinedCartProducts = [...combinedCartProducts, ...updatedCartProductWithType];
                checkOutArray.push(proArr);
                setCheckoutProducts(proArr);
            }

            if (cartNoBProducts.length > 0) {
                const storedCategory: Category | null = JSON.parse(localStorage.getItem("selectedCategory") || "null");
                const fetchedProducts: TypeProduct[] = await fetchNobareCodeProducts(store, setLoading, setProducts, aToken, rToken, storedCategory, cartNoBProducts, setisProductfetched);

                const updatedCartProduct: CartProduct[] = cartNoBProducts.map((cartItem) => {
                    const matchingProduct = fetchedProducts.find(
                        (product: TypeProduct) => product._id === cartItem.productID
                    );

                    if (matchingProduct) {
                        return {
                            ...cartItem,
                            picture: matchingProduct.picture,
                            title: matchingProduct.title,
                        };
                    }
                    return cartItem;
                });
                setCartProducts(updatedCartProduct);

                const proArr: CheckOutProduct[] = updatedCartProduct.map((pro) => ({
                    productId: pro.productID,
                    quantity: pro.productType === "saleRule" ? pro.totalCount : pro.productCount,
                }));

                const updatedCartProductWithType = updatedCartProduct.map((product) => ({
                    ...product,
                    type: 'NOB'
                }));

                combinedCartProducts = [...combinedCartProducts, ...updatedCartProductWithType];
                checkOutArray.push(proArr);
                setCheckoutProducts(proArr);
            }

            setAllCartProducts(combinedCartProducts);
        } catch (error: unknown) {
            if (
                typeof error === 'object' &&
                error !== null &&
                'status' in error &&
                (error as { status: number }).status === 401
            ) {
                // const newToken = await refreshAccessToken();
                // if (newToken) {
                //     fetchProduct();  // Retry fetching after refreshing token
                // }
            }
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-end justify-center bg-black bg-opacity-50 px-2 pb-5 font-poppins z-20">
            <div className="flex flex-col relative w-full rounded-lg bg-white">
                <div className=" rounded-lg flex items-center justify-between h-20 absoulte top-0 left-0 w-full bg-white px-5">
                    <span className="font-semibold text-2xl">Cart</span>
                    <Image src='/images/decline.png' alt='close' width={1000} height={1000} className="h-12 w-12"
                        onClick={handleCloseClick} />
                </div>

                <div className="flex-1 overflow-y-auto px-2 min-h-[300px]">
                    {
                        allCartProducts.length <= 0 ? (
                            <div className="flex flex-col items-center justify-center text-black w-full my-20 flex-1 px-10 gap-6" >
                                <Image src='/images/emptyCart.png' alt='emptyCart' className="h-20 w-20" width={1000} height={1000} />
                                <strong>Your cart i s empty</strong>
                                <p className="text-center">Looks like you have no items in your cart start  adding products to your cart</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-5 flex-1 overflow-y-auto my-5 px-2 max-h-[50vh]">
                                <div className="flex flex-col gap-3">
                                    <div className="w-full flex items-center justify-center gap-3 mb-3">
                                        <Image src='/images/discounGreen.png' alt='' className="h-6 w-6 " width={1000} height={1000} />
                                        <span className="text-center text-buttonColor text-xl font-bold">Campaign</span>
                                        <p>{JSON.stringify(allCartProducts.length)}</p>
                                    </div>

                                    {allCartProducts
                                        ?.filter((product) => product.productType !== "saleRule")
                                        .map((product) => (
                                            <div
                                                key={product.productID}
                                                className="flex justify-between items-center border-2 border-gray-300 rounded-lg px-4 py-2 mb-4"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Image
                                                        src={product.picture ? product.picture : `/images/grocery.png`}
                                                        alt=""
                                                        className="w-14 h-16 object-cover"
                                                        width={100}
                                                        height={100}
                                                    />
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-black">{product.title}</span>
                                                        <span className="text-lightBlack">Qty: {product.productCount}</span>
                                                        <span className="text-buttonColor font-semibold text-lg">
                                                            {product.price + " " + currency}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex text-2xl font-bold font-semibold items-center justify-center gap-2 border-2 border-gray-400 rounded-full px-8 py-4 h-4">
                                                    <button onClick={() => updateCartProductQuantity(product, '-', setRef)}>-</button>
                                                    <span>{product.productCount}</span>
                                                    <button onClick={() => updateCartProductQuantity(product, '+', setRef)}>+</button>
                                                </div>
                                            </div>
                                        ))}

                                    {allCartProducts
                                        .filter((pro) => pro.productType === "saleRule")
                                        .map((pro: any, index) => {
                                            let total = pro.totalCount;
                                            pro.saleRuleDetails.forEach((rule: any) => {
                                                if (rule.isSaleApplied) {
                                                    total -= rule.productQuantiy * rule.saleRule.count;
                                                }
                                            });

                                            return (
                                                <div key={index}>
                                                    {pro.saleRuleDetails.map((rule: any, ruleIndex: number) =>
                                                        rule.isSaleApplied ? (
                                                            <div
                                                                key={ruleIndex}
                                                                className="flex justify-between items-center border-2 border-buttonColor rounded-lg px-4 py-2 mb-4"
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <Image
                                                                        src={pro.picture ? pro.picture : `/images/grocery.png`}
                                                                        alt=""
                                                                        className="w-14 h-16 object-cover"
                                                                        width={100}
                                                                        height={100}
                                                                    />
                                                                    <div className="flex flex-col">
                                                                        <span className="font-bold text-black">{pro.title}</span>
                                                                        <span className="text-lightBlack">
                                                                            Qty: {rule.productQuantiy * rule.saleRule.count}
                                                                        </span>
                                                                        <span className="text-buttonColor font-semibold text-lg">
                                                                            {rule.productQuantiy * rule.saleRule.price + " " + currency}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex text-2xl font-bold font-semibold items-center justify-center gap-2 border-2 border-gray-400 rounded-full px-8 py-4 h-4">
                                                                    <button onClick={() => updateCartProductQuantity(pro, '-', setRef)}>-</button>
                                                                    <span>{rule.productQuantiy * rule.saleRule.count}</span>
                                                                    <button onClick={() => updateCartProductQuantity(pro, '+', setRef)}>+</button>
                                                                </div>
                                                            </div>
                                                        ) : null
                                                    )}

                                                    {total > 0 && (
                                                        <div className="flex justify-between items-center border-2 border-red-300 rounded-lg px-4 py-2 mb-4">
                                                            <div className="flex items-center gap-2">
                                                                <Image
                                                                    src={pro.picture ? pro.picture : `/images/grocery.png`}
                                                                    alt=""
                                                                    className="w-14 h-16 object-cover"
                                                                    width={100}
                                                                    height={100}
                                                                />
                                                                <div className="flex flex-col">
                                                                    <span className="font-bold text-black">{pro.title}</span>
                                                                    <span className="text-lightBlack">Qty: {total}</span>
                                                                    <span className="text-buttonColor font-semibold text-lg">
                                                                        {total * pro.productPrice + " " + currency}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="flex text-2xl font-bold font-semibold items-center justify-center gap-2 border-2 border-gray-400 rounded-full px-8 py-4 h-4">
                                                                <button onClick={() => updateCartProductQuantity(pro, '-', setRef)}>-</button>
                                                                <span>{total}</span>
                                                                <button onClick={() => updateCartProductQuantity(pro, '+', setRef)}>+</button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}

                                </div>
                            </div>
                        )
                    }
                </div>

                <div className=" rounded-lg w-full h-20 bg-white flex justify-center items-center absoulte bottom-0 left-0 w-full pb-3">
                    <button className="bg-buttonColor text-white rounded-full text-center px-20 py-4 font-bold text-2xl"
                        onClick={handleCheckouClick}>{cartProducts.length > 0 ? ('Check out') : ('Start shopping')}</button>
                </div>
            </div>
        </div>
    )
}

export default Cart;
