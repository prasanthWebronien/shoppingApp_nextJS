export interface TypeProduct {
  name: string;
  title: string;
  _id: string;
  picture: string;
  stripeCode: string;
  oldStripeCode: string;
  sku: string;
  // enu : string;
  price: number;
  comparison_weight: number;
  ageRestriction: string;
  tax: number;
  category: string;
  deposit: number;
  unitCode: string;
  wasted: number;
  purchasePrice: number;
  availableItems: number;
  soldItems: number;
  discount: number;
  teaser: string;
  shopId: string;
  created?: string;
  updated?: string;
  sale: boolean;
  importedAt: number;
  unitOfMeasure: string;
  salePrice: number;
  units: string;
  quantity: number;
  saleGroupRules: Object[];
  // saleGroupRules: [{ count: number; price: number }];
  updateVersion: number;
  isVending: boolean;
  priceDiff: number;
  originalPrice: number;
  noDepoPrice: number;
  promote: boolean;
  isGS1: boolean;
  expirationDate: string;
  lastDeliveryDate: string;
  isDiscount: boolean;
  softDelete: boolean;
  environment: string;
 vendingDatas: object;
  value: string;
  stock: {
    total_stock: number;
    value: number;
    last_restocked: string;
    isStock: boolean;
    minStock: number;
  };
  receiptName: string;
  negative_stock: boolean;
  group: string;
  noneBarcode: boolean;
  isFridge: boolean;
}

export interface SaleRule {
  count: number;
  price: number;
  status: string; // You could make this a union type like: "Active" | "Inactive"
}

export interface SaleRuleDetail {
  productQuantiy: number;
  saleRule: SaleRule[];
  isNearby: boolean;
  isSaleApplied: boolean;
} 

export interface SaleRuleCombined {
  count: number;
  price: number;
  status: "Active" | "Inactive";
  isSaleApplied: boolean;
  isNearby: boolean;
}


export interface SaleRuleDetailsWrapper {
  saleRuleDetails: SaleRuleDetail[];
}

export interface NormalProduct {
  productType: 'NormalProduct'; // or "NormalProduct" if it's always that
  productID: string;
  productCount: number;
  price: number;
  picture:string;
  title:string;
  
}

export interface ProductWithSaleRule{
  name: string;
  title: string;
  _id: string;
  picture: string;
  stripeCode: string;
  oldStripeCode: string;
  sku: string;
  // enu : string;
  price: number;
  comparison_weight: number;
  ageRestriction: string;
  tax: number;
  category: string;
  deposit: number;
  unitCode: string;
  wasted: number;
  purchasePrice: number;
  availableItems: number;
  soldItems: number;
  discount: number;
  teaser: string;
  shopId: string;
  created?: string;
  updated?: string;
  sale: boolean;
  importedAt: number;
  unitOfMeasure: string;
  salePrice: number;
  units: string;
  quantity: number;
  saleGroupRules: [{ count: number; price: number; status: string }];
  // saleGroupRules: [{ count: number; price: number }];
  updateVersion: number;
  isVending: boolean;
  priceDiff: number;
  originalPrice: number;
  noDepoPrice: number;
  promote: boolean;
  isGS1: boolean;
  expirationDate: string;
  lastDeliveryDate: string;
  isDiscount: boolean;
  softDelete: boolean;
  environment: string;
  vendingDatas:Object;
  value: string;
  stock: {
    total_stock: number;
    value: number;
    last_restocked: string;
    isStock: boolean;
    minStock: number;
  };
  receiptName: string;
  negative_stock: boolean;
  group: string;
  noneBarcode: boolean;
  isFridge: boolean;
  saleRuleDetails:SaleRuleDetail,
  picture:string,
  title:string
}
 
export interface SaleRuleProduct {
  productType: "saleRule";
  productID: string;
  productPrice: number;
  totalPrice: number;
  totalCount: number;
  saleRuleDetails: SaleRuleDetail[];
  picture:string;
  title:string;
}

export interface DiscountProduct {
  productType: "discountProduct";
  productID: string;
  discountRate: number;
  originalAmount: number;
  price: number;
  productCount: number;
  picture:string;
  title:string;
}

export interface Shop {
  id: string;
  user_id: string;
  name: string;
  shop_admin_email: string;
  location: {
    lat: string;
    lon: string;
  };
  address: string;
  contact_no: string;
  status: string;
  orgnumber: string;
  paymentMethod: {
    swish: {
      payeeAlias: number;
    };
  };
  searchText: string;
  tawShop: string;
  shop_img: string;
  receiptNote: string;
  receiptPrefix: string;
  pkg: {
    id: string;
    title: string;
    total_users: number;
    modules: string[];
  };
  created: string; // ISO date string
  updated: string; // ISO date string
  distance?: string;        // Optional, may not exist in all shops
  distanceInKm?: number;    // Optional, may not exist in all shops
}

export interface CheckOutProduct  {
  productId: string;
  quantity: number;
};

export interface details{
  totalCount:number;
  totalPrice:number;
}
export interface ProductSaleRule {
  productQuantiy: number;
  saleRule: {
    count: number;
    price: number;
    status: string;         // If this can only be "Active" or other fixed values, consider using a union type
    isSaleApplied: boolean;
    isNearby: boolean;
  };
  isNearby: boolean;
  isSaleApplied: boolean;
}

export type CartProduct = NormalProduct | SaleRuleProduct | DiscountProduct;
export type SetProductsFn = React.Dispatch<React.SetStateAction<TypeProduct[]>>;
export type SetSaleRuleFn = React.Dispatch<React.SetStateAction<SaleRule[]>>;
export type SetIsProductFetchedFn = React.Dispatch<React.SetStateAction<boolean>>;
export type SetSaleRuleProductFn = React.Dispatch<React.SetStateAction<SaleRuleProduct[]>>;

export interface ProductsDetailSaleRule{
  productQuantiy:string;
  saleRule:SaleRule;
  isNearby:boolean;
  isSaleApplied:boolean
}


export interface Location {
  latitude: number;
  longitude: number;
}