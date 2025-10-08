import { useState } from "react";
import { Package, ShoppingBag, LayoutDashboard, Menu } from "lucide-react";
import AdminHome from "./admin/AdminHome";
import AdminProducts from "./admin/AdminProducts";
import AdminOrders from "./admin/AdminOrders";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* ===== Sidebar ===== */}
      <aside
        className={`fixed md:static z-40 bg-gray-900 text-white w-64 p-4 transition-transform transform 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <h1 className="text-2xl font-bold mb-8 mt-20 text-center">Admin Panel</h1>
        <nav className="space-y-3">
          {[
            { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
            { id: "products", label: "Products", icon: <Package size={18} /> },
            { id: "orders", label: "Orders", icon: <ShoppingBag size={18} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setIsSidebarOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg w-full text-left cursor-pointer ${activeTab === tab.id
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:bg-gray-700"
                }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* ===== Mobile Menu Button ===== */}
      <button
        className="md:hidden fixed top-4 z-50 mt-1.5 bg-indigo-600 text-white p-1 rounded-md"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Menu size={15} />
      </button>

      {/* ===== Main Content ===== */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-12 mt-16 md:mt-0">
        {activeTab === "dashboard" && <AdminHome />}
        {activeTab === "products" && <AdminProducts />}
        {activeTab === "orders" && <AdminOrders />}
      </main>
    </div>
  );
}
