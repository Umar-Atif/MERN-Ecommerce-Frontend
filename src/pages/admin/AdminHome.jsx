import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminHome() {
    const [stats, setStats] = useState({
        products: 0,
        orders: 0,
        pendingOrders: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [productsRes, ordersRes] = await Promise.all([
                    api.get("/products"),
                    api.get("/orders"),
                ]);

                const totalProducts = productsRes.data.length;
                const totalOrders = ordersRes.data.length;
                const pendingOrders = ordersRes.data.filter(
                    (order) => order.status === "pending"
                ).length;

                setStats({
                    products: totalProducts,
                    orders: totalOrders,
                    pendingOrders,
                });
            } catch (error) {
                console.error("Error fetching admin stats:", error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="pt-24 min-h-screen px-4 md:px-8 lg:px-16 bg-gray-50">
            <h2 className="text-2xl font-bold text-indigo-700 mb-6">Dashboard Overview 📊</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
                    <h3 className="text-gray-500">Total Products</h3>
                    <p className="text-3xl font-bold text-indigo-600 mt-2">
                        {stats.products}
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
                    <h3 className="text-gray-500">Total Orders</h3>
                    <p className="text-3xl font-bold text-green-600 mt-2">
                        {stats.orders}
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
                    <h3 className="text-gray-500">Pending Orders</h3>
                    <p className="text-3xl font-bold text-yellow-600 mt-2">
                        {stats.pendingOrders}
                    </p>
                </div>
            </div>
        </div>
    );
}
