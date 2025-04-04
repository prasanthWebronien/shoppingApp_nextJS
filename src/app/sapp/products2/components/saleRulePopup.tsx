'use client';

import Image from "next/image";
import CloseIcon from "../../components/icons/CloseIcon";

interface SaleRule {
    status: string;
    count: number;
    price: number;
    isSaleApplied: boolean;
}

interface Product {
    _id: string;
    picture?: string;
    title: string;
    price: number;
    discount?: number;
    isDiscount?: boolean;
    quantity: number;
    ageRestriction?: boolean;
}

interface Props {
    saleruleProduct: Product[];
    setShowPopup: (value: boolean) => void;
    handleAddClick: (product: Product) => void;
    handleDecrement: (product: Product) => void;
    handleIncrement: (product: Product) => void;
    currence: string;
    saleRule: SaleRule[];
}

const SalerulePopup: React.FC<Props> = ({ saleruleProduct, setShowPopup, handleAddClick, handleDecrement, handleIncrement, currence, saleRule }) => {
    if (!saleruleProduct || saleruleProduct.length === 0) return null;
    const product:any = saleruleProduct[0];

    const isOfferApplied = (quantity: number, count: number) => (quantity + 1) % count === 0;

    return (
        <div className="h-full fixed inset-0 flex items-end justify-center bg-black bg-opacity-50 px-5 pb-5 font-poppins z-9000">
            <div className="w-full max-h-[500px] bg-red-500 rounded-2xl px-4 py-5 z-100">
                {/* Header */}
                <div className="flex items-center justify-between pb-2">
                    <div className="flex items-center gap-x-2">
                        <Image src='/images/discount.png' alt='' width={1000} height={1000} className="h-8 w-8" />
                        <strong className="tracking-wide text-black">Offers</strong>
                    </div>
                    <CloseIcon className="text-buttonColor cursor-pointer" onClick={() => setShowPopup(false)} />
                </div>

                {/* Product Info */}
                <div key={product._id} className="flex justify-between items-center w-full py-3 border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col rounded-md">
                            <Image 
                                src={product.picture || `/images/grocery.png`} 
                                alt='' className="h-16 w-14 p-1 bg-gray-100" 
                                width={1000} height={1000} 
                            />
                            {product.ageRestriction && (
                                <span className="bg-red-700 text-white text-center rounded-b-md w-full">
                                    18+
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col gap-2">
                            <strong className="text-black">{product.title}</strong>
                            {product.isDiscount ? (
                                <div className="flex items-center">
                                    <strong className="font-semibold text-buttonColor">
                                        {(product.price - (product.price * product.discount) / 100).toFixed(2)}
                                        <span className="text-gray-400 ml-2 line-through decoration-red-500">{product.price} {currence}</span>
                                    </strong>
                                </div>
                            ) : (
                                <strong className="text-buttonColor font-semibold">{product.price} {currence}</strong>
                            )}
                        </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="font-bold text-lg">
                        {product.quantity === 0 ? (
                            <button
                                onClick={() => handleAddClick(product)}
                                className="border-2 text-buttonColor border-gray-200 outline-none py-1 px-5 text-center rounded-full"
                            >
                                Add
                            </button>
                        ) : (
                            <div className="flex justify-between gap-4 border-2 border-gray-200 outline-none py-1 px-5 text-center rounded-full">
                                <button className="text-buttonColor" onClick={() => handleDecrement(product)}>-</button>
                                <span className="text-black">{product.quantity}</span>
                                <button className="text-buttonColor" onClick={() => handleIncrement(product)}>+</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Offers */}
                <div className="flex flex-col gap-3">
                    {saleRule.filter(rule => rule.status === 'Active').map((rule, index) => (
                        <div
                            key={index}
                            className={`flex flex-col border-2 border-gray-200 rounded-md items-center justify-center relative py-2 
                            ${rule.isSaleApplied ? 'bg-buttonColor text-white' : 'bg-white text-gray-400'}`}
                        >
                            <div className="flex w-full justify-center items-center flex-1 py-4">
                                <p className="text-lg text-black">
                                    BUY <span>{rule.count}</span> FOR <span className="font-semibold">{rule.price} {currence}</span>
                                </p>
                                <Image src='/images/tick.png' alt='' width={1000} height={1000} className={`h-7 w-7 rounded-full absolute right-2 ${rule.isSaleApplied ? 'block' : 'hidden'}`} />
                            </div>
                            {isOfferApplied(product.quantity, rule.count) && (
                                <p className="h-3 w-full text-center py-3 bg-gray-100 text-redColor font-bold text-lg rounded-b-md text-black">
                                    ADD 1 ITEM TO APPLY OFFER
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SalerulePopup;
