import axios from "axios";
import { ProductsData } from '.././app/db/products';
import { refreshSession } from "@/lib/auth/refreshSession";
import { TypeProduct, NormalProduct, SaleRuleProduct, DiscountProduct, Shop, CartProduct, SetProductsFn } from "../types/product";

type Coordinates = {
  latitude: number;
  longitude: number;
};

const apiUrl = process.env.NEXT_PUBLIC_APP_AUTH_API_URL
const environment = process.env.NEXT_PUBLIC_APP_ENVIRONMENT

export const findSaleRules = (Product: TypeProduct, quantity: number) => {

  let isNearbyFlag = false;
  const rules: any[] = [...Product.saleGroupRules].sort((a: any, b: any) => b.count - a.count);
  const result: any[] = [];
  let remainingQuantity = quantity;

  for (const rule of rules) {
    const ruleInfo: any = {
      productQuantiy: 0,
      saleRule: rule,
      isNearby: false,
      isSaleApplied: false,
    };

    // ✅ Mark as nearby if adding 1 more would make it match the rule
    if ((remainingQuantity + 1) % rule.count === 0 && !isNearbyFlag) {
      ruleInfo.isNearby = true;
      isNearbyFlag = true;
    }

    // ✅ Apply sale rule if it's active and valid
    if (rule.status === 'Active' && rule.count <= remainingQuantity) {
      const appliedCount = Math.floor(remainingQuantity / rule.count);
      ruleInfo.productQuantiy = appliedCount;
      ruleInfo.isSaleApplied = true;

      remainingQuantity -= appliedCount * rule.count;
    }

    result.push(ruleInfo);
  }

  return result;
};

const currentLocation: { currentLatitude: number; currentLongitude: number } = {
  currentLatitude: 0,
  currentLongitude: 0
}

export const updateDiscountProductInCart = (newProduct: TypeProduct, action: string, setProducts: SetProductsFn, setTotalPrice: (totalPrice: number) => void) => {

  let cartProducts: CartProduct[] = [];
  const storedCart = localStorage.getItem('cart');
  if (storedCart) {
    try {
      cartProducts = JSON.parse(storedCart);
    } catch (error) {
      console.error("Failed to parse cart:", error);
      cartProducts = [];
    }
  }

  const dpOBJ: DiscountProduct = {
    productType: 'discountProduct',
    productID: newProduct._id,
    discountRate: newProduct.discount,
    originalAmount: newProduct.price,
    price: newProduct.price - (newProduct.price * newProduct.discount) / 100,
    productCount: 1,
    picture: "",
    title: ""
  };

  const newQuantity = action === '+' ? newProduct.quantity + 1 : newProduct.quantity - 1;

  if (cartProducts.length !== 0) {
    cartProducts = cartProducts.filter(pro => pro.productID !== newProduct._id);

    if (newQuantity !== 0) {
      dpOBJ.productCount = newQuantity;
      dpOBJ.price = parseFloat((newQuantity * (newProduct.price - (newProduct.price * newProduct.discount) / 100)).toFixed(2));
      cartProducts.push(dpOBJ);
    }
  } else {
    cartProducts.push(dpOBJ);
  }

  const total = findTotal(cartProducts, '+');
  setTotalPrice(Number(total));


  setProducts(prevProducts =>
    prevProducts.map(pro => {
      if (pro._id === newProduct._id) {
        const updatedProduct = { ...pro, quantity: newQuantity };

        // Data.forEach(proe => {
        //   if (proe._id === pro._id) {
        //     proe.quantity = newQuantity
        //   }
        // })

        return updatedProduct;
      }
      return pro;
    })
  );

  localStorage.setItem('cart', JSON.stringify(cartProducts));
}

export const updateNormalProductIncart = (newProduct: TypeProduct, action: string, setProducts: SetProductsFn, setTotalPrice: (totalPrice: number) => void) => {
  console.log(newProduct);
  let cartProducts: CartProduct[] = [];
  const storedCart = localStorage.getItem('cart');
  if (storedCart) {
    try {
      cartProducts = JSON.parse(storedCart);
    } catch (error) {
      console.error("Failed to parse cart:", error);
      cartProducts = [];
    }
  }

  const npOBJ: NormalProduct = {
    productType: "NormalProduct",
    productID: newProduct._id,
    productCount: 1,
    price: newProduct.price,
    picture: "",
    title: ""
  }


  const newQuantity: number = action === '+' ? newProduct.quantity + 1 : newProduct.quantity - 1;
  cartProducts = cartProducts.filter(pro => pro.productID !== newProduct._id);

  if (newQuantity !== 0) {
    npOBJ.productCount = newQuantity;
    npOBJ.price = Number(newQuantity) * newProduct.price;
    cartProducts.push(npOBJ);
  }

  const total = findTotal(cartProducts, '+');
  setTotalPrice(Number(total));

  setProducts((prevProducts: TypeProduct[]) =>
    prevProducts.map((pro: TypeProduct) => {
      if (pro._id === newProduct._id) {
        const updatedProduct = { ...pro, quantity: newQuantity };

        // Data.forEach((proe:any) => {
        //   if (proe._id === pro._id) {
        //     proe.quantity = newQuantity
        //   }
        // })

        return updatedProduct;
      }
      return pro;
    })
  )

  localStorage.setItem('cart', JSON.stringify(cartProducts));
};

export const updateSaleRuleProductInCart = (Product: TypeProduct, operation: string, setProducts: SetProductsFn, setTotalPrice: (totalPrice: number) => void, setSalerule: any) => {
  let cartProducts: CartProduct[] = [];
  let storedCart = localStorage.getItem('cart') || null;
  if (storedCart === '[]') {
    storedCart = null;
  }

  if (storedCart) {
    try {
      cartProducts = JSON.parse(storedCart);
    } catch (error) {
      console.error("Failed to parse cart:", error);
      cartProducts = [];
    }
  }

  let updatedCartProducts = [];
  let resultArr: any[] = [];

  const saleRuleProduct: SaleRuleProduct = {
    productType: 'saleRule',
    productID: Product._id,
    productPrice: Product.price,
    totalPrice: Product.price,
    totalCount: 1,
    saleRuleDetails: [],
    picture: "",
    title: ""
  }

  const newProductQuantity: number = operation === '-' ? --Product.quantity : ++Product.quantity;

  if (cartProducts.length === 0) {
    resultArr = findSaleRules(Product, newProductQuantity);
    saleRuleProduct.saleRuleDetails = resultArr;
    saleRuleProduct.totalPrice = findSaleRuleProductTOtal(saleRuleProduct);
    updatedCartProducts.push(saleRuleProduct);
  } else {
    updatedCartProducts = cartProducts.filter(pro => pro.productID !== Product._id);
    resultArr = findSaleRules(Product, newProductQuantity);
    saleRuleProduct.saleRuleDetails = resultArr;

    if (newProductQuantity !== 0) {
      resultArr = findSaleRules(Product, newProductQuantity);
      saleRuleProduct.saleRuleDetails = resultArr;
      saleRuleProduct.totalCount = newProductQuantity;
      saleRuleProduct.totalPrice = findSaleRuleProductTOtal(saleRuleProduct);
      updatedCartProducts.push(saleRuleProduct);
    }
  }



  Product.saleGroupRules = Product.saleGroupRules.map((rule: any) => {
    const matchingRule = resultArr.find(res => res.saleRule.count === rule.count);

    if (matchingRule) {
      return {
        ...rule,
        isSaleApplied: matchingRule.isSaleApplied,
        isNearby: matchingRule.isNearby
      };
    }

    return rule; // If no match, return original object
  })

  setSalerule(Product.saleGroupRules);
  const total = findTotal(updatedCartProducts, '+');
  setTotalPrice(Number(total));

  setProducts(prevProducts =>
    prevProducts.map(pro =>
      pro._id === Product._id
        ? { ...pro, quantity: newProductQuantity }
        : pro
    )
  );

  localStorage.setItem('cart', JSON.stringify(updatedCartProducts));
}

export const updateDiscountProductInCartNBC = (newProduct: TypeProduct, action: string, setProducts: SetProductsFn, setTotalPrice: (totalPrice: number) => void) => {

  let cartProducts: CartProduct[] = [];
  const storedCart = localStorage.getItem('NBCcart');
  if (storedCart) {
    try {
      cartProducts = JSON.parse(storedCart);
    } catch (error) {
      console.error("Failed to parse cart:", error);
      cartProducts = [];
    }
  }

  const dpOBJ: DiscountProduct = {
    productType: 'discountProduct',
    productID: newProduct._id,
    discountRate: newProduct.discount,
    originalAmount: newProduct.price,
    price: newProduct.price - (newProduct.price * newProduct.discount) / 100,
    productCount: 1,
    picture: "",
    title: ""
  };

  const newQuantity = action === '+' ? newProduct.quantity + 1 : newProduct.quantity - 1;

  if (cartProducts.length !== 0) {
    cartProducts = cartProducts.filter(pro => pro.productID !== newProduct._id);

    if (newQuantity !== 0) {
      dpOBJ.productCount = newQuantity;
      dpOBJ.price = parseFloat((newQuantity * (newProduct.price - (newProduct.price * newProduct.discount) / 100)).toFixed(2));
      cartProducts.push(dpOBJ);
    }
  } else {
    cartProducts.push(dpOBJ);
  }

  const total = findTotal(cartProducts, '+');
  setTotalPrice(Number(total));


  setProducts(prevProducts =>
    prevProducts.map(pro => {
      if (pro._id === newProduct._id) {
        const updatedProduct = { ...pro, quantity: newQuantity };

        // Data.forEach(proe => {
        //   if (proe._id === pro._id) {
        //     proe.quantity = newQuantity
        //   }
        // })

        return updatedProduct;
      }
      return pro;
    })
  );

  localStorage.setItem('NBCTotal',JSON.stringify(total));
  localStorage.setItem('NBCcart', JSON.stringify(cartProducts));
}

export const updateNormalProductIncartNBC = (newProduct: TypeProduct, action: string, setProducts: SetProductsFn, setTotalPrice: (totalPrice: number) => void) => {

  let cartProducts: CartProduct[] = [];
  const storedCart = localStorage.getItem('NBCcart');
  if (storedCart) {
    try {
      cartProducts = JSON.parse(storedCart);
    } catch (error) {
      console.error("Failed to parse cart:", error);
      cartProducts = [];
    }
  }

  const npOBJ: NormalProduct = {
    productType: "NormalProduct",
    productID: newProduct._id,
    productCount: 1,
    price: newProduct.price,
    picture: "",
    title: ""
  }


  const newQuantity: number = action === '+' ? newProduct.quantity + 1 : newProduct.quantity - 1;
  cartProducts = cartProducts.filter(pro => pro.productID !== newProduct._id);

  if (newQuantity !== 0) {
    npOBJ.productCount = newQuantity;
    npOBJ.price = Number(newQuantity) * newProduct.price;
    cartProducts.push(npOBJ);
  }

  const total = findTotal(cartProducts, '+');
  setTotalPrice(Number(total));

  setProducts((prevProducts: TypeProduct[]) =>
    prevProducts.map((pro: TypeProduct) => {
      if (pro._id === newProduct._id) {
        const updatedProduct = { ...pro, quantity: newQuantity };

        // Data.forEach((proe:any) => {
        //   if (proe._id === pro._id) {
        //     proe.quantity = newQuantity
        //   }
        // })

        return updatedProduct;
      }
      return pro;
    })
  )

  localStorage.setItem('NBCTotal',JSON.stringify(total));
  localStorage.setItem('NBCcart', JSON.stringify(cartProducts));
};

export const updateSaleRuleProductInCartNBC = (Product: TypeProduct, operation: string, setProducts: SetProductsFn, setTotalPrice: (totalPrice: number) => void, setSalerule: any) => {
  let cartProducts: CartProduct[] = [];
  let storedCart = localStorage.getItem('NBCcart') || null;
  if (storedCart === '[]') {
    storedCart = null;
  }

  if (storedCart) {
    try {
      cartProducts = JSON.parse(storedCart);
    } catch (error) {
      console.error("Failed to parse cart:", error);
      cartProducts = [];
    }
  }

  let updatedCartProducts = [];
  let resultArr: any[] = [];

  const saleRuleProduct: SaleRuleProduct = {
    productType: 'saleRule',
    productID: Product._id,
    productPrice: Product.price,
    totalPrice: Product.price,
    totalCount: 1,
    saleRuleDetails: [],
    picture: "",
    title: ""
  }

  const newProductQuantity: number = operation === '-' ? --Product.quantity : ++Product.quantity;

  if (cartProducts.length === 0) {
    resultArr = findSaleRules(Product, newProductQuantity);
    saleRuleProduct.saleRuleDetails = resultArr;
    saleRuleProduct.totalPrice = findSaleRuleProductTOtal(saleRuleProduct);
    updatedCartProducts.push(saleRuleProduct);
  } else {
    updatedCartProducts = cartProducts.filter(pro => pro.productID !== Product._id);
    resultArr = findSaleRules(Product, newProductQuantity);
    saleRuleProduct.saleRuleDetails = resultArr;

    if (newProductQuantity !== 0) {
      resultArr = findSaleRules(Product, newProductQuantity);
      saleRuleProduct.saleRuleDetails = resultArr;
      saleRuleProduct.totalCount = newProductQuantity;
      saleRuleProduct.totalPrice = findSaleRuleProductTOtal(saleRuleProduct);
      updatedCartProducts.push(saleRuleProduct);
    }
  }



  Product.saleGroupRules = Product.saleGroupRules.map((rule: any) => {
    const matchingRule = resultArr.find(res => res.saleRule.count === rule.count);

    if (matchingRule) {
      return {
        ...rule,
        isSaleApplied: matchingRule.isSaleApplied,
        isNearby: matchingRule.isNearby
      };
    }

    return rule; // If no match, return original object
  })

  setSalerule(Product.saleGroupRules);
  const total = findTotal(updatedCartProducts, '+');
  setTotalPrice(Number(total));

  setProducts(prevProducts =>
    prevProducts.map(pro =>
      pro._id === Product._id
        ? { ...pro, quantity: newProductQuantity }
        : pro
    )
  );

  localStorage.setItem('NBCTotal',JSON.stringify(total));
  localStorage.setItem('NBCcart', JSON.stringify(updatedCartProducts));
}

export const updateDiscountProductInCartVMP = (newProduct: TypeProduct, action: string, setProducts: SetProductsFn, setTotalPrice: (totalPrice: number) => void) => {

  let cartProducts: CartProduct[] = [];
  const storedCart = localStorage.getItem('VMcart');
  if (storedCart) {
    try {
      cartProducts = JSON.parse(storedCart);
    } catch (error) {
      console.error("Failed to parse cart:", error);
      cartProducts = [];
    }
  }

  const dpOBJ: DiscountProduct = {
    productType: 'discountProduct',
    productID: newProduct._id,
    discountRate: newProduct.discount,
    originalAmount: newProduct.price,
    price: newProduct.price - (newProduct.price * newProduct.discount) / 100,
    productCount: 1,
    picture: "",
    title: ""
  };

  const newQuantity = action === '+' ? newProduct.quantity + 1 : newProduct.quantity - 1;

  if (cartProducts.length !== 0) {
    cartProducts = cartProducts.filter(pro => pro.productID !== newProduct._id);

    if (newQuantity !== 0) {
      dpOBJ.productCount = newQuantity;
      dpOBJ.price = parseFloat((newQuantity * (newProduct.price - (newProduct.price * newProduct.discount) / 100)).toFixed(2));
      cartProducts.push(dpOBJ);
    }
  } else {
    cartProducts.push(dpOBJ);
  }

  const total = findTotal(cartProducts, '+');
  setTotalPrice(Number(total));


  setProducts(prevProducts =>
    prevProducts.map(pro => {
      if (pro._id === newProduct._id) {
        const updatedProduct = { ...pro, quantity: newQuantity };

        // Data.forEach(proe => {
        //   if (proe._id === pro._id) {
        //     proe.quantity = newQuantity
        //   }
        // })

        return updatedProduct;
      }
      return pro;
    })
  );

  localStorage.setItem('VMTotal',JSON.stringify(total));
  localStorage.setItem('VMcart', JSON.stringify(cartProducts));
}

export const updateNormalProductIncartVMP = (newProduct: TypeProduct, action: string, setProducts: SetProductsFn, setTotalPrice: (totalPrice: number) => void) => {
  let cartProducts: CartProduct[] = [];
  const storedCart = localStorage.getItem('VMcart');
  if (storedCart) {
    try {
      cartProducts = JSON.parse(storedCart);
    } catch (error) {
      console.error("Failed to parse cart:", error);
      cartProducts = [];
    }
  }

  const npOBJ: NormalProduct = {
    productType: "NormalProduct",
    productID: newProduct._id,
    productCount: 1,
    price: newProduct.price,
    picture: "",
    title: ""
  }


  const newQuantity: number = action === '+' ? newProduct.quantity + 1 : newProduct.quantity - 1;
  cartProducts = cartProducts.filter(pro => pro.productID !== newProduct._id);

  if (newQuantity !== 0) {
    npOBJ.productCount = newQuantity;
    npOBJ.price = Number(newQuantity) * newProduct.price;
    cartProducts.push(npOBJ);
  }

  const total = findTotal(cartProducts, '+');
  setTotalPrice(Number(total));

  setProducts((prevProducts: TypeProduct[]) =>
    prevProducts.map((pro: TypeProduct) => {
      if (pro._id === newProduct._id) {
        const updatedProduct = { ...pro, quantity: newQuantity };

        // Data.forEach((proe:any) => {
        //   if (proe._id === pro._id) {
        //     proe.quantity = newQuantity
        //   }
        // })

        return updatedProduct;
      }
      return pro;
    })
  )

  localStorage.setItem('VMTotal',JSON.stringify(total));
  localStorage.setItem('VMcart', JSON.stringify(cartProducts));
};

export const updateSaleRuleProductInCartVMP = (Product: TypeProduct, operation: string, setProducts: SetProductsFn, setTotalPrice: (totalPrice: number) => void, setSalerule: any) => {
  let cartProducts: CartProduct[] = [];
  let storedCart = localStorage.getItem('VMcart') || null;
  if (storedCart === '[]') {
    storedCart = null;
  }

  if (storedCart) {
    try {
      cartProducts = JSON.parse(storedCart);
    } catch (error) {
      console.error("Failed to parse cart:", error);
      cartProducts = [];
    }
  }

  let updatedCartProducts = [];
  let resultArr: any[] = [];

  const saleRuleProduct: SaleRuleProduct = {
    productType: 'saleRule',
    productID: Product._id,
    productPrice: Product.price,
    totalPrice: Product.price,
    totalCount: 1,
    saleRuleDetails: [],
    picture: "",
    title: ""
  }

  const newProductQuantity: number = operation === '-' ? --Product.quantity : ++Product.quantity;

  if (cartProducts.length === 0) {
    resultArr = findSaleRules(Product, newProductQuantity);
    saleRuleProduct.saleRuleDetails = resultArr;
    saleRuleProduct.totalPrice = findSaleRuleProductTOtal(saleRuleProduct);
    updatedCartProducts.push(saleRuleProduct);
  } else {
    updatedCartProducts = cartProducts.filter(pro => pro.productID !== Product._id);
    resultArr = findSaleRules(Product, newProductQuantity);
    saleRuleProduct.saleRuleDetails = resultArr;

    if (newProductQuantity !== 0) {
      resultArr = findSaleRules(Product, newProductQuantity);
      console.log(resultArr);
      saleRuleProduct.saleRuleDetails = resultArr;
      saleRuleProduct.totalCount = newProductQuantity;
      saleRuleProduct.totalPrice = findSaleRuleProductTOtal(saleRuleProduct);
      updatedCartProducts.push(saleRuleProduct);
    }
  }

  Product.saleGroupRules = Product.saleGroupRules.map((rule: any) => {
    const matchingRule = resultArr.find(res => res.saleRule.count === rule.count);

    if (matchingRule) {
      return {
        ...rule,
        isSaleApplied: matchingRule.isSaleApplied,
        isNearby: matchingRule.isNearby
      };
    }

    return rule;
  })

  setSalerule(Product.saleGroupRules);
  const total = findTotal(updatedCartProducts, '+');
  setTotalPrice(Number(total));

  setProducts(prevProducts =>
    prevProducts.map(pro =>
      pro._id === Product._id
        ? { ...pro, quantity: newProductQuantity }
        : pro
    )
  );

  localStorage.setItem('VMTotal',JSON.stringify(total));
  localStorage.setItem('VMcart', JSON.stringify(updatedCartProducts));
}

export const updateDiscountProductInCartFP = (newProduct: TypeProduct, action: string, setProducts: SetProductsFn, setTotalPrice: (totalPrice: number) => void) => {

  let cartProducts: CartProduct[] = [];
  const storedCart = localStorage.getItem('FPcart');
  if (storedCart) {
    try {
      cartProducts = JSON.parse(storedCart);
    } catch (error) {
      console.error("Failed to parse cart:", error);
      cartProducts = [];
    }
  }

  const dpOBJ: DiscountProduct = {
    productType: 'discountProduct',
    productID: newProduct._id,
    discountRate: newProduct.discount,
    originalAmount: newProduct.price,
    price: newProduct.price - (newProduct.price * newProduct.discount) / 100,
    productCount: 1,
    picture: "",
    title: ""
  };

  const newQuantity = action === '+' ? newProduct.quantity + 1 : newProduct.quantity - 1;

  if (cartProducts.length !== 0) {
    cartProducts = cartProducts.filter(pro => pro.productID !== newProduct._id);

    if (newQuantity !== 0) {
      dpOBJ.productCount = newQuantity;
      dpOBJ.price = parseFloat((newQuantity * (newProduct.price - (newProduct.price * newProduct.discount) / 100)).toFixed(2));
      cartProducts.push(dpOBJ);
    }
  } else {
    cartProducts.push(dpOBJ);
  }

  const total = findTotal(cartProducts, '+');
  setTotalPrice(Number(total));


  setProducts(prevProducts =>
    prevProducts.map(pro => {
      if (pro._id === newProduct._id) {
        const updatedProduct = { ...pro, quantity: newQuantity };

        // Data.forEach(proe => {
        //   if (proe._id === pro._id) {
        //     proe.quantity = newQuantity
        //   }
        // })

        return updatedProduct;
      }
      return pro;
    })
  );

  localStorage.setItem('FPTotal',JSON.stringify(total));
  localStorage.setItem('FPcart', JSON.stringify(cartProducts));
}

export const updateNormalProductIncartFP = (newProduct: TypeProduct, action: string, setProducts: SetProductsFn, setTotalPrice: (totalPrice: number) => void) => {
  let cartProducts: CartProduct[] = [];
  const storedCart = localStorage.getItem('FPcart');
  if (storedCart) {
    try {
      cartProducts = JSON.parse(storedCart);
    } catch (error) {
      console.error("Failed to parse cart:", error);
      cartProducts = [];
    }
  }

  const npOBJ: NormalProduct = {
    productType: "NormalProduct",
    productID: newProduct._id,
    productCount: 1,
    price: newProduct.price,
    picture: "",
    title: ""
  }


  const newQuantity: number = action === '+' ? newProduct.quantity + 1 : newProduct.quantity - 1;
  cartProducts = cartProducts.filter(pro => pro.productID !== newProduct._id);

  if (newQuantity !== 0) {
    npOBJ.productCount = newQuantity;
    npOBJ.price = Number(newQuantity) * newProduct.price;
    cartProducts.push(npOBJ);
  }

  const total = findTotal(cartProducts, '+');
  setTotalPrice(Number(total));

  setProducts((prevProducts: TypeProduct[]) =>
    prevProducts.map((pro: TypeProduct) => {
      if (pro._id === newProduct._id) {
        const updatedProduct = { ...pro, quantity: newQuantity };

        // Data.forEach((proe:any) => {
        //   if (proe._id === pro._id) {
        //     proe.quantity = newQuantity
        //   }
        // })

        return updatedProduct;
      }
      return pro;
    })
  )

  localStorage.setItem('FPTotal',JSON.stringify(total));
  localStorage.setItem('FPcart', JSON.stringify(cartProducts));
};

export const updateSaleRuleProductInCartFP = (Product: TypeProduct, operation: string, setProducts: SetProductsFn, setTotalPrice: (totalPrice: number) => void, setSalerule: any) => {
  let cartProducts: CartProduct[] = [];
  let storedCart = localStorage.getItem('FPcart') || null;
  if (storedCart === '[]') {
    storedCart = null;
  }

  if (storedCart) {
    try {
      cartProducts = JSON.parse(storedCart);
    } catch (error) {
      console.error("Failed to parse cart:", error);
      cartProducts = [];
    }
  }

  let updatedCartProducts = [];
  let resultArr: any[] = [];

  const saleRuleProduct: SaleRuleProduct = {
    productType: 'saleRule',
    productID: Product._id,
    productPrice: Product.price,
    totalPrice: Product.price,
    totalCount: 1,
    saleRuleDetails: [],
    picture: "",
    title: ""
  }

  const newProductQuantity: number = operation === '-' ? --Product.quantity : ++Product.quantity;

  if (cartProducts.length === 0) {
    resultArr = findSaleRules(Product, newProductQuantity);
    saleRuleProduct.saleRuleDetails = resultArr;
    saleRuleProduct.totalPrice = findSaleRuleProductTOtal(saleRuleProduct);
    updatedCartProducts.push(saleRuleProduct);
  } else {
    updatedCartProducts = cartProducts.filter(pro => pro.productID !== Product._id);
    resultArr = findSaleRules(Product, newProductQuantity);
    saleRuleProduct.saleRuleDetails = resultArr;

    if (newProductQuantity !== 0) {
      resultArr = findSaleRules(Product, newProductQuantity);
      saleRuleProduct.saleRuleDetails = resultArr;
      saleRuleProduct.totalCount = newProductQuantity;
      saleRuleProduct.totalPrice = findSaleRuleProductTOtal(saleRuleProduct);
      updatedCartProducts.push(saleRuleProduct);
    }
  }



  Product.saleGroupRules = Product.saleGroupRules.map((rule: any) => {
    const matchingRule = resultArr.find(res => res.saleRule.count === rule.count);

    if (matchingRule) {
      return {
        ...rule,
        isSaleApplied: matchingRule.isSaleApplied,
        isNearby: matchingRule.isNearby
      };
    }

    return rule; // If no match, return original object
  })

  setSalerule(Product.saleGroupRules);
  const total = findTotal(updatedCartProducts, '+');
  setTotalPrice(Number(total));

  setProducts(prevProducts =>
    prevProducts.map(pro =>
      pro._id === Product._id
        ? { ...pro, quantity: newProductQuantity }
        : pro
    )
  );

  localStorage.setItem('FPTotal',JSON.stringify(total));
  localStorage.setItem('FPcart', JSON.stringify(updatedCartProducts));
}

const sortStoresByDistance = async (storesData: Shop[], currentLat: number, currentLon: number) => {

  // First, calculate the distance for each store
  const storesWithDistance = storesData.map((store) => {

    const lat = parseFloat(store.location.lat);
    const lon = parseFloat(store.location.lon);

    const distanceInKm = calculateDistance(currentLat, currentLon, lat, lon);
    const formattedDistance = formatDistance(distanceInKm);  // format the distance (e.g., 2.3 km)

    // Add the distance to the store object
    return { ...store, distance: formattedDistance, distanceInKm };  // Include raw distanceInKm for sorting
  });

  // Then, sort the stores based on the distanceInKm (which is the raw distance)
  storesWithDistance.sort((a, b) => a.distanceInKm - b.distanceInKm);  // Sorting by distance in ascending order

  return storesWithDistance;
};

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {

  const toRadians = (degrees: number) => degrees * (Math.PI / 180);
  const R = 6371; // Earth's radius in km

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000; // Convert km to meters
};

function formatDistance(distanceInMeters: number) {
  return distanceInMeters >= 1000
    ? `${(distanceInMeters / 1000).toFixed(1)} km`
    : `${Math.round(distanceInMeters)} m`;
}

export const getCurrectLocation1 = async (): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {

    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        resolve({ latitude, longitude });
      },
      (err) => {

        if (err.code === err.PERMISSION_DENIED) {
          reject(new Error("Permission denied for geolocation."));
        } else {
          reject(err);
        }
      }
    );
  });
};

export const getCurrectLocation = async () => {
  const getPosition = () => {
    return new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (err) => reject(err),
        {
          timeout: 10000,
          enableHighAccuracy: true,
          maximumAge: 0,
        }
      );
    });
  };

  while (true) {
    try {
      const position = await getPosition();
      const { latitude, longitude } = position.coords;

      // Return the values instead of assigning
      return { latitude, longitude };
    } catch (err) {
      console.warn("Location error, retrying...", err);
      await new Promise((res) => setTimeout(res, 3000)); // Wait before retry
    }
  }
};

export const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const toRadians = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000; // Convert km to meters
};

export const findNearbyStores = (currentLat: number, currentLon: number, stores: Shop[], maxDistance = 15000) => {
  const nearbyStores = stores.filter((store) => {
    const storeLat = parseFloat(store.location.lat);
    const storeLon = parseFloat(store.location.lon);

    if (!storeLat || !storeLon) return false;

    const distance = haversineDistance(currentLat, currentLon, storeLat, storeLon);
    return distance <= maxDistance;
  });

  return nearbyStores.length > 0 ? nearbyStores : [];
};

export const fetchStoresUtils = async (accessToken: string, refreshToken: string, getCurrectLocatio: string) => {
  let location = {
    lan: 0 as number,
    lon: 0 as number
  }

  if (getCurrectLocatio == 'getCurrectLocatio') {
    const result = await getCurrectLocation();
    if (result)
      location.lan = result.latitude;
    location.lon = result.longitude;
  } else {
    const { latitude, longitude } = await getCurrectLocation1();
    location.lan = latitude
    location.lon = longitude
  }

  try {
    const response = await axios.get(`${apiUrl}/shops/getshops?limit=200&page=1`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'accept': 'application/json',
        'env': environment,
      },
    });

    const allStores = response.data.data;
    const sortedStores = sortStoresByDistance(allStores, location.lan, location.lon);
    return sortedStores;

  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      (error as { status: number }).status === 401
    ) {
      const newToken: any = await refreshSession(refreshToken);
      if (newToken != null) {
        fetchStoresUtils(newToken.token, refreshToken, getCurrectLocatio);
      }
    }
    console.error('Error fetching products:', error);
  }
};

export const fetchStoresForBankID = async (accessToken: string, refreshToken: string, location: any) => {
  try {

    const response = await axios.get(`${apiUrl}/shops/getshops?limit=200&page=1`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'accept': 'application/json',
        'env': environment,
      },
    });

    const allStores = response.data.data;
    const sortedStores = sortStoresByDistance(allStores, location.latitude, location.longitude);
    return sortedStores;

  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      (error as { status: number }).status === 401
    ) {
      const newToken: any = await refreshSession(refreshToken);
      if (newToken != null) {
        fetchStoresUtils(newToken.token, refreshToken, location);
      }
    }
    console.error('Error fetching products:', error);
  }
};

export const fetchCurrence = async (storeID: string, accessToken: string, refreshToken: string) => {

  try {

    // Make the API request to fetch currency data
    const corrence = await axios.get(`${apiUrl}/settings/${storeID}preferences`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'accept': '*/*',
        'env': environment,
      },
    });

    // Check if 'currency' exists in the response data
    const currencyExists = corrence.data.value.hasOwnProperty('currency');
    if (currencyExists) {
      if (corrence.data.value !== '') {
      }
    }

    localStorage.setItem('currence', corrence.data.value.currency);

  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      (error as { status: number }).status === 401
    ) {
      const newToken: any = await refreshSession(refreshToken);
      if (newToken != null) {
        fetchCurrence(storeID, accessToken, refreshToken);
      }
    }
    // console.error('Error fetching currency:', error);
    // Handle error (e.g., show an error message, or fallback behavior)
  }
};

export const fetchFProducts = async (storeID: string, setLoading: (loading: boolean) => void, setProducts: SetProductsFn, accessToken: string, setisProductfetched: (isProductfetched: boolean) => void, addedProducts: CartProduct[], refreshToken: string) => {

  try {
    const response = await axios.get(
      `${apiUrl}fridge/getFridgeProductListByShopId?shopId=${storeID}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'accept': '*/*',
          'env': environment,
        },
      }
    );

    let responsew = response.data.data;
    // responsew = ProductsData;
    responsew.forEach((prod: TypeProduct) => {
      if (prod.quantity === undefined) {
        prod.quantity = 0;
      }
    });


    let fetchProduct = responsew;
    if (fetchProduct.length == 0) {
      setisProductfetched(true);
    }

    if (addedProducts.length > 0) {
      fetchProduct = changeProductQuantity(fetchProduct,'FPcart');
      setProducts(fetchProduct);
    } else {
      setProducts(fetchProduct);
    }

    return fetchProduct;
  } catch (error: unknown) {

    if (typeof error === "object" && error !== null && "status" in error && (error as { status: number }).status === 401) {
      const newToken: any = await refreshSession(refreshToken);

      if (newToken != null) {
        fetchFProducts(storeID, setLoading, setProducts, newToken.access.token, setisProductfetched, addedProducts, refreshToken);
      }
    }
    console.error('Error fetching products:', error);
  }
  finally {
    setLoading(false);
  }
};

export const fetchVMProducts = async (storeID: string, setLoading: (loading: boolean) => void, setProducts: SetProductsFn, accessToken: string, setisProductfetched: (isProductfetched: boolean) => void, addedProducts: CartProduct[], refreshToken: string) => {

  try {
    const response = await axios.get(
      `${apiUrl}/products?shopId=${storeID}&isVending=true`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'accept': '*/*',
          'env': environment,
        },
      }
    );

    let responsew = response.data.data;

    // responsew = ProductsData;
    responsew.forEach((prod: TypeProduct) => {
      if (prod.quantity === undefined) {
        prod.quantity = 0;
      }
    });


    let fetchProduct = responsew;
    if (fetchProduct.length == 0) {
      setisProductfetched(true);
    }

    if (addedProducts.length > 0) {
      fetchProduct = changeProductQuantity(fetchProduct,'VMcart');
      setProducts(fetchProduct);
    } else {
      setProducts(fetchProduct);
    }

    return fetchProduct;
  } catch (error: unknown) {

    if (typeof error === "object" && error !== null && "status" in error && (error as { status: number }).status === 401) {
      const newToken: any = await refreshSession(refreshToken);

      if (newToken != null) {
        fetchVMProducts(storeID, setLoading, setProducts, newToken.access.token, setisProductfetched, addedProducts, refreshToken);
      }
    }
    console.error('Error fetching products:', error);
  }
  finally {
    setLoading(false);
  }
};

export const fetchNobareCodeProducts = async (storeId: string, setLoading: (loading: boolean) => void, setProducts: SetProductsFn, accessToken: string, refreshToken: string, storedCategory: any, addedProducts: CartProduct[], setisProductfetched: (isProductfetched: boolean) => void,) => {
  let tempApiURL = '';

  try {
    if (storedCategory?.value) {
      tempApiURL = `${apiUrl}/products/?shopId=${storeId}&limit=12&category=${storedCategory.value}&categoryType=tagged`;
    } else {
      tempApiURL = `${apiUrl}/products/?shopId=${storeId}&limit=12&isTagged=true`;
    }

    const response = await axios.get(tempApiURL, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': '*/*',
        'env': environment,
      },
    });

    let responsew = response.data.data;

    responsew.forEach((prod: TypeProduct) => {
      if (prod.quantity === undefined) {
        prod.quantity = 0;
      }
    });

    let fetchProduct = responsew;
    if (fetchProduct == 0) {
      setisProductfetched(true);
    }

    if (addedProducts.length > 0) {
      fetchProduct = changeProductQuantity(fetchProduct,'NBCcart');
      setProducts(fetchProduct);
    } else {
      setProducts(fetchProduct);
    }

    return fetchProduct;
  } catch (error: unknown) {

    if (typeof error === "object" && error !== null && "status" in error && (error as { status: number }).status === 401) {
      const newToken: any = await refreshSession(refreshToken);

      if (newToken != null) {
        fetchNobareCodeProducts(storeId, setLoading, setProducts, newToken.access.token, refreshToken, storedCategory, addedProducts, setisProductfetched);
      }
    }
    console.error('Error fetching products:', error);
  }
  finally {
    setLoading(false);
  }
};

export const findTotal = (cartProducts: CartProduct[], op: string) => {

  let totalPrice = 0;
  if (cartProducts.length === 0) {
    return totalPrice;
  }

  cartProducts.forEach((pro: CartProduct) => {
    if (pro.productType === 'saleRule') {
      totalPrice += pro.totalPrice;
    }
    else {
      totalPrice += pro.price;
    }
  })
  return totalPrice.toFixed(1);
}

export const findSaleRuleProductTOtal = (Product: any) => {
  // Calculate total count and total price
  let totalCount = 0;
  let totalPrice = 0;

  for (const detail of Product.saleRuleDetails as any[]) {
    if (detail.productQuantiy !== 0) {
      totalCount += detail.productQuantiy * detail.saleRule.count;
      totalPrice += detail.productQuantiy * detail.saleRule.price;
    }
  }


  let a = Product.totalCount - totalCount;
  a = a * Product.productPrice;
  a = a + totalPrice;

  return a;

}

export const changeProductQuantity = (fetchedProducts: TypeProduct[],type:string) => {
  let cartProducts: CartProduct[] = [];
  const storedCart = localStorage.getItem(type);

  if (storedCart) {
    try {
      cartProducts = JSON.parse(storedCart);
    } catch (error) {
      console.error("Failed to parse cart:", error);
      cartProducts = [];
    }
  }

  if (cartProducts.length > 0) {

    fetchedProducts.forEach(fPro => {

      cartProducts.forEach((cartPRO: CartProduct) => {
        if (cartPRO.productID === fPro._id) {
          if (cartPRO.productType === 'saleRule') {
            fPro.quantity = cartPRO.totalCount;
          }
          else {
            fPro.quantity = cartPRO.productCount
          }
        }
      })

    })

  }
  return fetchedProducts;
}

export function isMobileUserAgent(userAgent: string) {
  return /Mobi|Android|iPhone/i.test(userAgent);
}

export const updateCartProductQuantity = (product: any, action: string, setRef: any) => {
  let updatedProduct = { ...product }; // Create a new object to avoid mutation

  if (action === '+') {
    if (updatedProduct.productType === 'NormalProduct') {
      updatedProduct.productCount++;
      updatedProduct.price = Number(updatedProduct.productCount) * Number(updatedProduct.price);
      let type = updatedProduct.type
      UpdateLocalStorage(type, updatedProduct, setRef);
    }
    else {
      updatedProduct.totalCount = (updatedProduct.totalCount || 0) + 1;
      let updatedProdct = updateSaleRUleProduct(product, updatedProduct.totalCount)
      let type = updatedProduct.type
      UpdateLocalStorage(type, updatedProdct, setRef);
    }
  } else {
    if (updatedProduct.productType === 'NormalProduct') {
      updatedProduct.productCount--;
      updatedProduct.price = Number(updatedProduct.productCount) * Number(updatedProduct.price);
      let type = updatedProduct.type
      UpdateLocalStorage(type, updatedProduct, setRef);
    }
    else {
      updatedProduct.totalCount = (updatedProduct.totalCount || 0) - 1;
      let updatedProdct = updateSaleRUleProduct(product, updatedProduct.totalCount)
      let type = updatedProduct.type
      UpdateLocalStorage(type, updatedProdct, setRef);
    }
  }


  return updatedProduct; // Return the updated product
};

const updateSaleRUleProduct = (Product: any, newCount: number) => {
  let saleRuleDetails = Product.saleRuleDetails;

  saleRuleDetails.forEach((saleRuleDetail: any) => {
    let saleRulecount = saleRuleDetail.saleRule.count;

    if (newCount >= saleRulecount) {
      let appliendCount = Math.floor(newCount / saleRulecount);
      let notAppliedCount = newCount % saleRulecount;

      if (notAppliedCount == (saleRulecount - 1)) {
        saleRuleDetail.isNearby = true;
      }
      saleRuleDetail.isSaleApplied = true;
      saleRuleDetail.productQuantiy = appliendCount;
      newCount = notAppliedCount;
    } else {
      saleRuleDetail.saleRule.isSaleApplied = false
      saleRuleDetail.productQuantiy = 0;
      saleRuleDetail.isSaleApplied = false;
    }
  });

  let totalCount = 0;
  let totalPrice = 0;

  saleRuleDetails.forEach((saleRuleDetail: any) => {
    if (saleRuleDetail.isSaleApplied) {
      totalCount = totalCount + saleRuleDetail.productQuantiy * saleRuleDetail.saleRule.count;
      totalPrice = totalPrice + saleRuleDetail.productQuantiy * saleRuleDetail.saleRule.price;

      Product.totalCount = totalCount;
      Product.totalPrice = totalPrice;
    }
  })

  Product.totalPrice = totalPrice + (newCount * Product.totalPrice);
  Product.totalCount = totalCount + newCount;
  return Product;
}

const UpdateLocalStorage = (type: string, product: any, setRef: any): void => {
  let allProducts = JSON.parse(localStorage.getItem(type + 'cart') || '[]');

  const updatedProducts = allProducts.map((pro: { productID: any; }) =>
    pro.productID === product.productID ? product : pro
  );

  localStorage.setItem(type + 'cart', JSON.stringify(updatedProducts))
  setRef((prev: any) => !prev);
};

export const handleDispencing = async (checkOutProducts: any[], userID: string, storeId: string, accessToken: string, refreshToken: string) => {
  try {
    const response = await axios.post(`${apiUrl}/storedatasync/erp-task`,
      {
        storeId: storeId,
        userId: userID,
        goal: "dispense",
        details: {
          products: checkOutProducts
        }
      },
      {
        headers: {
          'accept': 'application/json',
          'env': environment,
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (response.status == 201) {
      const responseID: string = response.data.id;
      localStorage.setItem('responseID', responseID);
      return true;
    }
  } catch (error: unknown) {

    if (typeof error === "object" && error !== null && "status" in error && (error as { status: number }).status === 401) {
      const newToken: any = await refreshSession(refreshToken);

      if (newToken != null) {
        handleDispencing(checkOutProducts, userID, storeId, newToken.access.token, refreshToken);
      }
    }
    console.error('Error fetching products:', error);
  }
}

export const checkStatus = async (responseID: string, accessToken: string, userID: string, refreshToken: string) => {
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  let status = '';

  try {
    while (status !== 'done') {
      try {
        const response = await axios.get(
          `${apiUrl}/storedatasync/erp-task/${userID}/${responseID}`,
          {
            headers: {
              'accept': 'application/json',
              'env': environment,
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          }
        );
        status = response.data.status;
        if (status !== 'done') {
          await delay(5000);
        }

      } catch (error) {
        console.error('Error checking status:', error);
        break;
      }
    }

  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "status" in error && (error as { status: number }).status === 401) {
      const newToken: any = await refreshSession(refreshToken);

      if (newToken != null) {
        checkStatus(responseID, newToken.access.token, userID, refreshToken);
      }
    }
    console.error('Error fetching products:', error);
  }

  //  route.push('dispenseAlert');
};