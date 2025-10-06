import { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const res = await api.get("/orders");
            setOrders(res.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatus = async (orderId, status) => {
        try {
            await api.post("/orders/status", { orderId, status });
            setOrders((prev) =>
                prev.map((o) => (o._id === orderId ? { ...o, status } : o))
            );
            toast.success("Order status updated successfully!");
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update order status");
        }
    };

    if (loading)
        return (
            <div className="pt-24 min-h-screen flex justify-center items-center text-indigo-600 font-semibold">
                Loading orders...
            </div>
        );

    if (orders.length === 0)
        return (
            <div className="pt-24 min-h-screen flex flex-col items-center justify-center text-gray-600">
                <h2 className="text-2xl font-bold mb-4">No Orders Found</h2>
            </div>
        );

    return (
        <div className="pt-24 min-h-screen px-4 md:px-8 lg:px-16 bg-gray-50">
            <h2 className="text-2xl font-bold text-indigo-700 mb-6">
                All Orders 🧾
            </h2>

            <div className="overflow-x-auto bg-white shadow-md rounded-2xl">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-indigo-600 text-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold">
                                User
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">
                                Items
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">
                                Total
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm">{order.user.name}</td>
                                <td className="px-6 py-4 text-sm">
                                    {order.orderItems.map((i) => (
                                        <div key={i.product._id}>
                                            <b>{i.product}</b> x <b>{i.quantity}</b>
                                        </div>
                                    ))}
                                </td>
                                <td className="px-6 py-4 text-sm font-semibold">
                                    Rs. {order.totalAmount.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <span
                                        className={`px-2 py-1 rounded-full text-white ${order.status === "pending"
                                                ? "bg-yellow-500"
                                                : "bg-green-600"
                                            }`}
                                    >
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm space-x-2">
                                    {order.status === "pending" ? (
                                        <button
                                            onClick={() => updateStatus(order._id, "completed")}
                                            className="bg-green-600 text-white px-3 py-1 rounded-full hover:bg-green-700 transition cursor-pointer"
                                        >
                                            Complete
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => updateStatus(order._id, "pending")}
                                            className="bg-yellow-500 text-white px-3 py-1 rounded-full hover:bg-yellow-600 transition cursor-pointer"
                                        >
                                            Set Pending
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
