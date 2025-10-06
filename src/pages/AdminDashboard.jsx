import { useState } from "react";
import { Package, ShoppingBag, LayoutDashboard } from "lucide-react";
import AdminHome from "./admin/AdminHome";
import AdminProducts from "./admin/AdminProducts";
import AdminOrders from "./admin/AdminOrders";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col p-4">
        <h1 className="text-2xl font-bold mb-8 mt-20 text-center">Admin Panel</h1>
        <nav className="space-y-3">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg w-full cursor-pointer text-left ${activeTab === "dashboard"
              ? "bg-gray-700 text-white"
              : "text-gray-300 hover:bg-gray-700"
              }`}
          >
            <LayoutDashboard size={18} /> Dashboard
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg w-full cursor-pointer text-left ${activeTab === "products"
              ? "bg-gray-700 text-white"
              : "text-gray-300 hover:bg-gray-700"
              }`}
          >
            <Package size={18} /> Products
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg w-full cursor-pointer text-left ${activeTab === "orders"
              ? "bg-gray-700 text-white"
              : "text-gray-300 hover:bg-gray-700"
              }`}
          >
            <ShoppingBag size={18} /> Orders
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {activeTab === "dashboard" && <AdminHome />}
        {activeTab === "products" && <AdminProducts />}
        {activeTab === "orders" && <AdminOrders />}
      </main>
    </div>
  );
}
