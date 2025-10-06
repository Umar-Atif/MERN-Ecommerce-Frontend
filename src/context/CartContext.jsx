import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState({ items: [], totalPrice: 0 });
    const [loading, setLoading] = useState(false);

    const userId = localStorage.getItem("userId");

    // Fetch cart
    const fetchCart = async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const res = await api.get(`/cart/${userId}`);
            setCart(res.data || { items: [], totalPrice: 0 });
        } catch (err) {
            console.error("Error fetching cart:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [userId]);

    // Add to cart
    const addToCart = async (productId, quantity = 1, showToast = true) => {
        try {
            const res = await api.post("/cart/add", { userId, productId, quantity });
            if (showToast) toast.success("Item added to cart!");
            setCart(res.data);
        } catch (err) {
            console.error("Error adding to cart:", err);
            if (showToast) toast.error("Please Login First.");
        }
    };

    // Decrease quantity
    const decreaseQty = async (productId) => {
        try {
            const res = await api.post("/cart/add", { userId, productId, quantity: -1 });
            toast.success("Item quantity decreased!");
            setCart(res.data);
        } catch (err) {
            console.error("Error decreasing qty:", err);
            toast.error("Failed to decrease item quantity.");
        }
    };

    // Remove from cart
    const removeFromCart = async (productId) => {
        try {
            const res = await api.post("/cart/remove", { userId, productId });
            toast.success("Item removed from cart!");
            setCart(res.data);
        } catch (err) {
            console.error("Error removing from cart:", err);
            toast.error("Failed to remove item from cart.");
        }
    };

    // Clear cart
    const clearCart = async (showToast = true) => {
        try {
            const res = await api.post("/cart/clear", { userId });
            if (showToast) toast.success("Cart cleared!");
            setCart(res.data.cart);
        } catch (err) {
            console.error("Error clearing cart:", err);
            toast.error("Failed to clear cart.");
        }
    };

    // Increase quantity
    const increaseQty = async (productId) => {
        await addToCart(productId, 1, false); 
        toast.success("Item quantity increased!"); 
    };

    const cartCount = cart?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

    return (
        <CartContext.Provider
            value={{
                cart,
                loading,
                cartCount,
                addToCart,
                removeFromCart,
                increaseQty,
                decreaseQty,
                clearCart,
                fetchCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
