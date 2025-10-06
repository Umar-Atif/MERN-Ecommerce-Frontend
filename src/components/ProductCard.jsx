import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
    const { addToCart } = useCart();

    return (
        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 flex flex-col items-center text-center">
            <Link to={`/products/${product._id}`} className="flex flex-col items-center">
                <div className="w-40 h-40 flex items-center justify-center mb-4">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="max-w-full max-h-full object-contain rounded-xl"
                    />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{product.name}</h3>
                <p className="text-indigo-600 font-bold mt-2">Rs. {product.price}</p>
            </Link>
            <button
                onClick={() => addToCart(product._id)}
                className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition cursor-pointer"
            >
                Add to Cart
            </button>
        </div>
    );
}
