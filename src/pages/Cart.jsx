import { useCart } from "../context/CartContext";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Cart() {
    const {
        cart,
        loading,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,
        cartCount,
    } = useCart();

    const [placing, setPlacing] = useState(false);
    const navigate = useNavigate();

    // 🧾 Place Order Function
    const handlePlaceOrder = async () => {
        try {
            setPlacing(true);
            const userId = localStorage.getItem("userId"); // make sure userId is saved after login
            const res = await api.post("/orders/place", { userId });
            toast.success("Order placed successfully!");
            clearCart(false);
            navigate("/orders");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to place order");
        } finally {
            setPlacing(false);
        }
    };

    if (loading)
        return (
            <div className="pt-24 min-h-screen flex justify-center items-center text-indigo-600 font-semibold">
                Loading your cart...
            </div>
        );

    if (!cart || cart.items.length === 0)
        return (
            <div className="pt-24 min-h-screen flex flex-col items-center justify-center text-gray-600">
                <h2 className="text-2xl font-bold mb-4">Your Cart is Empty 🛍️</h2>
                <p>Start adding some products to your cart!</p>
            </div>
        );

    return (
        <div className="pt-24 min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 px-4 md:px-8 lg:px-16">
            <h2 className="text-2xl font-bold text-indigo-700 mb-6">
                Your Shopping Cart 🛒 ({cartCount} items)
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
                {/* 🧾 Cart Items */}
                <div className="md:col-span-2 bg-white shadow-md rounded-2xl p-4">
                    {cart.items.map((item) => (
                        <div
                            key={item.product._id}
                            className="flex flex-col sm:flex-row justify-between items-center border-b py-4"
                        >
                            <div className="flex items-center space-x-4">
                                <img
                                    src={item.product.image || "/no-image.png"}
                                    alt={item.product.name}
                                    className="w-20 h-20 object-cover rounded-lg shadow"
                                />
                                <div>
                                    <h3 className="font-semibold text-gray-800">
                                        {item.product.name}
                                    </h3>
                                    <p className="text-gray-500 text-sm">
                                        Rs. {item.product.price?.toFixed(2) || "0.00"}
                                    </p>
                                </div>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center mt-4 sm:mt-0 space-x-2">
                                <button
                                    onClick={() => decreaseQty(item.product._id)}
                                    className="px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-300 transition cursor-pointer"
                                >
                                    -
                                </button>
                                <span className="text-gray-800 font-semibold">
                                    {item.quantity}
                                </span>
                                <button
                                    onClick={() => increaseQty(item.product._id)}
                                    className="px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-300 transition cursor-pointer"
                                >
                                    +
                                </button>
                            </div>

                            {/* Remove */}
                            <button
                                onClick={() => removeFromCart(item.product._id)}
                                className="text-red-500 hover:text-red-700 mt-4 sm:mt-0 cursor-pointer"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>

                {/* 💳 Summary */}
                <div className="bg-white shadow-md rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-indigo-700 mb-4">
                        Order Summary
                    </h3>
                    <p className="text-gray-700 mb-2">
                        Items: <span className="font-semibold">{cartCount}</span>
                    </p>
                    <p className="text-gray-700 mb-2">
                        Total:{" "}
                        <span className="font-semibold">
                            Rs. {cart.totalPrice?.toFixed(2) || "0.00"}
                        </span>
                    </p>

                    <button
                        onClick={clearCart}
                        className="w-full mt-4 bg-red-500 text-white py-2 rounded-full hover:bg-red-600 transition cursor-pointer"
                    >
                        Clear Cart
                    </button>

                    <button
                        onClick={handlePlaceOrder}
                        disabled={placing}
                        className="w-full mt-3 bg-indigo-600 text-white py-2 rounded-full hover:bg-indigo-700 transition disabled:opacity-60 cursor-pointer"
                    >
                        {placing ? "Placing Order..." : "Place Order"}
                    </button>
                </div>
            </div>
        </div>
    );
}
