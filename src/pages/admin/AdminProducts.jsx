import { useEffect, useState } from "react";
import api from "../../services/api";
import { Trash2, Edit } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        image: null,
    });
    const [editingProductId, setEditingProductId] = useState(null);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await api.get("/products");
            setProducts(res.data);
        } catch (err) {
            console.error("Error fetching products:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("description", form.description);
            formData.append("price", Number(form.price));
            formData.append("category", form.category);
            if (form.image) formData.append("image", form.image);

            if (editingProductId) {
                await api.put(`/products/${editingProductId}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                toast.success("Product updated successfully!");
            } else {
                await api.post("/products", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                toast.success("Product added successfully!");
            }

            setForm({ name: "", description: "", price: "", category: "", image: null });
            setEditingProductId(null);
            fetchProducts();
        } catch (err) {
            console.error("Error saving product:", err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await api.delete(`/products/${id}`);
            fetchProducts();
            toast.success("Product deleted successfully!");
        } catch (err) {
            console.error("Error deleting product:", err);
            toast.error("Failed to delete product");
        }
    };

    const handleEdit = (product) => {
        setForm({
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category || "",
            image: null,
        });
        setEditingProductId(product._id);
    };

    const handleStockToggle = async (id) => {
        try {
            const res = await api.put(`/products/stock/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            fetchProducts();
            toast.success(
                `Product is now ${res.data.stock ? "in stock" : "out of stock"}`
            );
        } catch (error) {
            console.error("Error toggling stock:", error);
            toast.error("Failed to update stock");
        }
    };


    return (
        <div className="pt-24 min-h-screen px-4 md:px-8 lg:px-16 bg-gray-50">
            <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center md:text-left">
                Product Management 📦
            </h2>

            {/* ===== FORM ===== */}
            <div className="bg-white shadow-md rounded-2xl p-6 mb-8 max-w-3xl mx-auto">
                <h3 className="text-lg font-semibold mb-4">
                    {editingProductId ? "Edit Product" : "Add Product"}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                        required
                    />
                    <textarea
                        placeholder="Description"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                        rows="3"
                        required
                    />
                    <input
                        type="number"
                        placeholder="Price"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Category"
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                        required
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
                        className="w-full cursor-pointer border rounded-lg p-2"
                        required={!editingProductId}
                    />
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white w-full py-2 rounded-full hover:bg-indigo-700 transition cursor-pointer font-medium"
                    >
                        {editingProductId ? "Update Product" : "Add Product"}
                    </button>
                </form>
            </div>

            {/* ===== RESPONSIVE PRODUCT LIST ===== */}
            {loading ? (
                <p className="text-indigo-600 font-semibold text-center">Loading products...</p>
            ) : products.length === 0 ? (
                <p className="text-gray-600 text-center">No products found.</p>
            ) : (
                <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {products.map((p) => (
                        <div
                            key={p._id}
                            className="bg-white rounded-2xl shadow-sm p-4 flex flex-col justify-between"
                        >
                            <div>
                                <img
                                    src={p.image}
                                    alt={p.name}
                                    className="w-full h-40 object-cover rounded-xl mb-3"
                                />
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {p.name}
                                </h3>
                                <p className="text-gray-600 text-sm mb-2">
                                    {p.description?.slice(0, 60)}...
                                </p>
                                <p className="font-semibold text-indigo-700">
                                    Rs. {p.price}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Category: {p.category || "-"}
                                </p>
                            </div>

                            <div className="flex justify-between mt-4 items-center">
                                <button
                                    onClick={() => handleEdit(p)}
                                    className="text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                                >
                                    <Edit size={16} /> Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(p._id)}
                                    className="text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
                                >
                                    <Trash2 size={16} /> Delete
                                </button>

                                {/* Toggle Button */}
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <span className="text-sm font-medium text-gray-600">
                                        {p.stock ? "In Stock" : "Out of Stock"}
                                    </span>
                                    <input
                                        type="checkbox"
                                        checked={p.stock}
                                        onChange={() => handleStockToggle(p._id)}
                                        className="toggle-checkbox"
                                    />
                                </label>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
