import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import api from "../services/api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get(`/products`);
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading)
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center text-indigo-600 font-semibold text-lg">
        Loading products...
      </div>
    );

  return (
    <div className="pt-24 min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 px-4 md:px-8 lg:px-16 mb-4">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6">Our Products 🛒</h2>

      {products.length === 0 ? (
        <p className="text-gray-600">No products found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
