import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export default function Home() {
    const { user } = useContext(AuthContext);

    const isAdmin = user?.isAdmin;

    return (
        <div className="pt-24 min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 px-4 md:px-8 lg:px-16 flex flex-col items-center justify-center text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-indigo-700 mb-3 sm:mb-4 leading-snug">
                Welcome to our Ecommerce Store 🛍️
            </h1>
            <p className="text-gray-600 text-base sm:text-lg md:text-xl max-w-2xl">
                {!isAdmin ? "Browse and shop your favorite products from the comfort of your home." : "Manage and monitor all products, orders, and categories efficiently from the admin panel."}
            </p>
            <Link to={!isAdmin ? "/products" : "/admin"}>
                <button className="bg-indigo-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 mt-5 rounded-full hover:bg-indigo-700 transition-all shadow-md cursor-pointer text-sm sm:text-base">
                    {!isAdmin ? "Explore Products" : "Go to Admin Panel"}
                </button>
            </Link>
        </div>
    );
}
