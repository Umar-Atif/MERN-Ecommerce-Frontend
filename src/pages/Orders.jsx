import { useEffect, useState } from "react";
import api from "../services/api";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await api.get(`/orders/${userId}`);
                setOrders(data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };
        if (userId) fetchOrders();
    }, [userId]);

    if (loading)
        return (
            <div className="pt-24 min-h-screen flex justify-center items-center text-indigo-600 font-semibold">
                Loading your orders...
            </div>
        );

    if (!orders.length)
        return (
            <div className="pt-24 min-h-screen flex flex-col items-center justify-center text-gray-600">
                <img
                    src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
                    alt="Empty Orders"
                    className="w-24 mb-4 opacity-80"
                />
                <h2 className="text-2xl font-bold mb-2">No Orders Found 🛍️</h2>
                <p className="text-gray-500 text-sm">You haven’t placed any orders yet.</p>
            </div>
        );

    return (
        <div className="pt-24 min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 px-4 md:px-8 lg:px-16 mb-4">
            <h2 className="text-3xl font-bold text-indigo-700 mb-10 text-center">
                My Orders 📦
            </h2>

            <div className="space-y-8 max-w-5xl mx-auto">
                {orders.map((order) => (
                    <div
                        key={order._id}
                        className="bg-white/80 backdrop-blur-md border border-indigo-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6"
                    >
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Order ID:{" "}
                                    <span className="text-indigo-600 font-mono">{order._id}</span>
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Placed on:{" "}
                                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                            </div>
                            <span
                                className={`mt-3 sm:mt-0 px-4 py-1.5 rounded-full text-sm font-medium shadow-sm ${order.status === "Delivered"
                                    ? "bg-green-100 text-green-700"
                                    : order.status === "Pending"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-blue-100 text-blue-700"
                                    }`}
                            >
                                {order.status}
                            </span>
                        </div>

                        {/* Items List */}
                        <div className="divide-y divide-gray-100 border-y border-gray-100">
                            {order.orderItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between items-center py-4 hover:bg-indigo-50/50 rounded-xl px-2 transition"
                                >
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={item.product?.image || "/no-image.png"}
                                            alt={item.product?.name}
                                            className="w-16 h-16 object-cover rounded-lg shadow-sm border"
                                        />
                                        <div>
                                            <p className="font-semibold text-gray-800">
                                                {item.product?.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Rs. {item.price?.toFixed(0)} x {item.quantity}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="font-semibold text-indigo-700 text-lg">
                                        Rs. {(item.price * item.quantity).toFixed(0)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="flex justify-between items-center mt-5">
                            <p className="text-gray-600 text-sm">
                                Total Items:{" "}
                                <span className="font-semibold text-gray-800">
                                    {order.orderItems.length}
                                </span>
                            </p>
                            <p className="text-xl font-bold text-indigo-700">
                                Total: Rs. {order.totalAmount.toFixed(0)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
