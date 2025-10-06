import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/${id}`);
                setProduct(res.data);

                const category = res.data.category;
                if (category) {
                    const relatedRes = await api.get(`/products?category=${category}`);

                    const filtered = relatedRes.data
                        .filter((p) => p._id !== id && p.category === category)
                        .slice(0, 4);

                    setRelated(filtered);
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading)
        return (
            <div className="pt-24 min-h-screen flex justify-center items-center text-indigo-600 font-semibold text-lg">
                Loading product details...
            </div>
        );

    if (!product)
        return (
            <div className="pt-24 min-h-screen flex justify-center items-center text-gray-600 text-lg">
                Product not found
            </div>
        );

    return (
        <div className="pt-24 min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 px-6 py-12">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-5xl mx-auto bg-white/70 backdrop-blur-lg shadow-2xl rounded-3xl overflow-hidden grid md:grid-cols-2 gap-8 p-6 md:p-10"
            >
                <div className="flex items-center justify-center">
                    <motion.img
                        src={product.image}
                        alt={product.name}
                        className="w-80 h-80 object-cover rounded-2xl shadow-lg border border-indigo-100"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                    />
                </div>

                <div className="flex flex-col justify-center text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-700 mb-3">
                        {product.name}
                    </h1>

                    <p className="text-gray-600 mb-6 text-base md:text-lg leading-relaxed">
                        {product.description || "No description available for this product."}
                    </p>

                    <p className="text-2xl font-bold text-indigo-600 mb-6">
                        Rs. {product.price}
                    </p>

                    <motion.button
                        onClick={() => addToCart(product._id)}
                        whileTap={{ scale: 0.95 }}
                        className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-indigo-700 transition shadow-md cursor-pointer"
                    >
                        🛒 Add to Cart
                    </motion.button>
                </div>
            </motion.div>

            {/* 🛍️ Related Products Section */}
            {related.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-6xl mx-auto mt-16"
                >
                    <h2 className="text-2xl font-bold text-indigo-700 mb-6">
                        Related Products
                    </h2>

                    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {related.map((item) => (
                            <Link
                                key={item._id}
                                to={`/products/${item._id}`}
                                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 flex flex-col items-center"
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-36 h-36 object-cover rounded-xl mb-3"
                                />
                                <h3 className="font-semibold text-gray-800 text-center">
                                    {item.name}
                                </h3>
                                <p className="text-indigo-600 font-medium mt-2">
                                    Rs. {item.price}
                                </p>
                            </Link>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
