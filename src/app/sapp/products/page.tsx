'use client'


import axios from "axios";
import Image from "next/image";
import { TypeProduct, CartProduct } from "@/types/product";
// import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { updateDiscountProductInCart, updateNormalProductIncart, fetchVMProducts, updateSaleRuleProductInCart, changeProductQuantity, fetchCurrence, findTotal } from '@/utils/helpers';
import ArrowLeftIcon from "../components/icons/ArrowLeftIcon";
import UserIcon from "../components/icons/UserIcon";
import SearchIcon from '../components/icons/SearchIcon';
import CloseIcon from "../components/icons/CloseIcon";
// import { Spin, Button } from 'antd';


const ProductsPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [storeID, setStoreid] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isAlert, setIsAlert] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  // const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [currence, setCurrence] = useState<string>('SEK');
  const [products, setProducts] = useState<TypeProduct[]>([]);
  const [noProduct, setNoproduct] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [saleRule, setSalerule] = useState<any[]>([]);
  const [isProductfetched, setisProductfetched] = useState<boolean>(false);
  const [saleruleProduct, setSaleruleProduct] = useState<TypeProduct[]>([]);
  const [accessToken, setAccessToken] = useState<string>('');
  const [refreshToken, setRefresfToken] = useState<string>('');
  const apiUrl = process.env.NEXT_PUBLIC_APP_API_URL!;
  const environment = process.env.NEXT_PUBLIC_APP_ENVIRONMENT!;

  useEffect(() => {
    let doorStatus = localStorage.getItem('door') || '';

    if (!session?.user?.fname && doorStatus != 'opened') {
      router.push("/sapp");
      return;
    }

    if (session?.user) {
      setAccessToken(session.user.aToken ?? '');
      setRefresfToken(session.user.rToken ?? '');
    }

    const shopID = localStorage.getItem('storeID') || '';

    const addedProducts: CartProduct[] = JSON.parse(localStorage.getItem("cart") || '[]');
    setTotalPrice(Number(findTotal(addedProducts, '+')));

    getCurrencyType(storeID, accessToken, refreshToken);
    fetchVMProducts(
      shopID,
      setLoading,
      setProducts,
      session?.user.aToken ?? '',
      setisProductfetched,
      addedProducts,
      session?.user.rToken ?? ''
    );

    const currency = localStorage.getItem('currence') || 'SEK';
    setCurrence(currency);

    if (shopID) {
      setStoreid(shopID);
    }
  }, []);

  const getCurrencyType = async (store: string, accessToken: string, refreshToken: string) => {
    await fetchCurrence(store, accessToken, refreshToken);
  }

  const handleAddClick = (Product: TypeProduct) => {
    if (Product.isDiscount) {
      updateDiscountProductInCart(Product, '+', setProducts, setTotalPrice);
    } else if (Product.sale && Product.salePrice === 0 && Product.saleGroupRules.length > 0) {
      updateSaleRuleProductInCart(Product, '+', setProducts, setTotalPrice, setSalerule);
    } else {
      updateNormalProductIncart(Product, '+', setProducts, setTotalPrice);
    }
  };

  const handleIncrement = (Product: TypeProduct) => {
    if (Product.quantity === Product.availableItems) {
      setIsAlert(true);
      setAlertMessage(`Stock available only ${Product.quantity}`);
      return;
    }

    if (Product.isDiscount) {
      updateDiscountProductInCart(Product, '+', setProducts, setTotalPrice);
    } else if (Product.sale && Product.salePrice === 0 && Product.saleGroupRules.length > 0) {

      updateSaleRuleProductInCart(Product, '+', setProducts, setTotalPrice, setSalerule);
    } else {
      updateNormalProductIncart(Product, '+', setProducts, setTotalPrice);
    }
  };

  const handleDecrement = (Product: TypeProduct) => {
    if (Product.isDiscount) {
      updateDiscountProductInCart(Product, '-', setProducts, setTotalPrice);
    } else if (Product.sale && Product.salePrice === 0 && Product.saleGroupRules.length > 0) {
      updateSaleRuleProductInCart(Product, '-', setProducts, setTotalPrice, setSalerule);
    } else {
      updateNormalProductIncart(Product, '-', setProducts, setTotalPrice);
    }
  };

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    const cartProducts: CartProduct[] = JSON.parse(localStorage.getItem('cart') || '[]');

    const searchUrl = searchTerm.trim() === ''
      ? `${apiUrl}/products?shopId=${storeID}&isVending=true`
      : `${apiUrl}/products?shopId=${storeID}&title=${searchTerm}&limit=50&productType=vending`;

    try {
      const response = await axios.get(searchUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'accept': '*/*',
          'env': environment,
        },
      });

      let fetchedProducts: TypeProduct[] = response.data.data;

      if (cartProducts.length > 0) {
        fetchedProducts = changeProductQuantity(fetchedProducts,'VMcart');
      }

      setProducts(fetchedProducts);
      setSearchTerm(searchTerm);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleCheckout = () => {

    if (totalPrice > 0) {
      router.push('/sapp/checkout');
    } else {
      setNoproduct(true);
    }
  };

  const filteredProducts: TypeProduct[] = products?.filter(
    (product) => product.title.toLowerCase().includes(searchTerm) && product.isVending
  );

  const showSalePopup = (productID: string) => {
    const foundProduct: TypeProduct | undefined = filteredProducts?.find(product => product._id === productID);
    const temp: TypeProduct[] = [];

    if (foundProduct) {
      temp.push(foundProduct);
    }

    if (foundProduct) {
      console.log(temp);
      setSaleruleProduct(temp);
      setSalerule(temp[0].saleGroupRules);
      setShowPopup(true);
    }
  };

  return (
    <div className="">
      {loading ? (
        <div className="h-[100dvh] flex items-center justify-center bg-buttonColor">
          <Image src="/images/loader.gif" alt="loder" width={1000} height={1000} />
        </div>

        // <Spin size="large" tip="Loading..." />
      ) : (
        <div className="font-poppins px-3 h-[100dvh] bg-white">
          <div className=" px-3 h-36 flex flex-col fixed top-0 left-0 w-full bg-white ">
            <div className="flex text-buttonColor items-center justify-between relative h-1/2">
              <ArrowLeftIcon className="text-buttonColor" onClick={() => router.push(`/sapp/dashBoard`)} />

              <h1 className="text-black font-bold text-xl">Vending Machine</h1>
              <UserIcon className="text-buttonColor w-10 h-10" onClick={() => router.push(`/sapp/settings`)} />
            </div>

            <div className="flex items-center justify-center h-1/2">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search"
                  onChange={handleSearchChange}
                  className="w-full text-black bg-white font-semibold py-3 px-5 border-2 border-buttonColor outline-none text-left rounded-full focus:ring-2 focus:ring-buttonColor transition-all"
                />
                <SearchIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-buttonColor" />
              </div>
            </div>
          </div>

          {isProductfetched ? (
            <div className=" flex flex-col bg justify-center items-center h-full w-full gap-2 ">
              <Image src='/images/ProductsNotFoundpng.png' alt='' width={1000} height={1000} className="h-52 w-52" /><button onClick={() => { router.push(`/sapp/stores`) }} className="bg-buttonColor text-white text-lg font-semibold px-10 py-3 rounded-full">Check other stores</button>
            </div>
          ) : (
            <div className="flex flex-col items-center flex-1 ">
              {filteredProducts?.length > 0 ? (
                <div className="flex flex-col  mb-5 gap-2 w-full mt-36 overflow-y-auto pb-24">
                  {filteredProducts?.filter((product) => product.isVending).map((product) => (
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

          {/* Checkout Bar - Conditionally Hidden */}
          <div className={`shadow-[0_0_20px_5px_rgba(255,255,255,0.5)] bg-buttonColor px-3 flex items-center justify-between rounded-t-lg py-5 bottom-0 left-0 w-full fixed ${isProductfetched ? 'hidden' : 'block'}`}>
            <button
              onClick={handleCheckout}
              className="p-2 px-10 font-semibold text-lg bg-white text-black rounded-full text-center"
            >
              Checkout
            </button>

            <div className="flex items-center text-white font-semibold tracking-wider gap-2">
              <span> Total <br /> {totalPrice} </span>
              <div className="h-16 w-16 flex items-center justify-center bg-white rounded-full">
                <Image src='/images/basket.png' alt='' width={1000} height={1000} className="h-9 w-9" />
              </div>
            </div>
          </div>
        </div>
      )}

      {showPopup && (
        <div className="fixed inset-0 flex items-end justify-center bg-black bg-opacity-50 px-5 pb-5 font-poppins z-20">
          <div className="w-full max-h-[500px] bg-white rounded-2xl px-4 py-5">
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
                  <Image src={saleruleProduct[0].picture ? saleruleProduct[0].picture : `/images/grocery.png`} alt='' className="h-16 w-14 p-1 bg-gray-100" width={1000} height={1000} />
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
    </div>
  );
};


export default ProductsPage;