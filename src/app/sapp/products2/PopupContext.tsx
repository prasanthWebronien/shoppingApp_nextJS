import { createContext, useContext, useState, ReactNode } from "react";
import { TypeProduct } from "../../../types/product"; // Adjust path as needed

interface PopupContextType {
    showPopup: boolean;
    saleruleProduct: TypeProduct[];
    saleRule: any[]; // Adjust type if needed
    showSalePopup: (productID: string) => void;
    setShowPopup: (value: boolean) => void;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export const PopupProvider = ({ children, products }: { children: ReactNode; products: TypeProduct[] }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [saleruleProduct, setSaleruleProduct] = useState<TypeProduct[]>([]);
    const [saleRule, setSalerule] = useState<any[]>([]); // Adjust type if needed

    const showSalePopup = (productID: string) => {
        const foundProduct: TypeProduct | undefined = products.find(product => product._id === productID);
        if (foundProduct) {
            setSaleruleProduct([foundProduct]);
            setSalerule(foundProduct.saleGroupRules);
            setShowPopup(true);
        }
    };

    return (
        <PopupContext.Provider value={{ showPopup, saleruleProduct, saleRule, showSalePopup, setShowPopup }}>
            {children}
        </PopupContext.Provider>
    );
};

export const usePopup = () => {
    const context = useContext(PopupContext);
    if (!context) {
        throw new Error("usePopup must be used within a PopupProvider");
    }
    return context;
};
