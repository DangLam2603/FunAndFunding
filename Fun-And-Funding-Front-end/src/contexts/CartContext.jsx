import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [order, setOrder] = useState(
        {
            cartItems: [
                {
                    marketplaceProjectId: "",
                    price: 0,
                    discountedPrice: 0,
                    marketplaceProject: {
                        id: "",
                        name: "",
                        price: 50000,
                        marketplaceFiles: [
                            {
                                url: "",
                                fileType: -1
                            },
                        ]
                    },
                    appliedCoupon: null,
                    createdDate: null,
                }
            ]
        }
    );
    const [cartCount, setCartCount] = useState(0);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                cartCount,
                order,
                setCartItems,
                setCartCount,
                setOrder
            }}
        >
            {children}
        </CartContext.Provider>
    );
};