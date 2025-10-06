import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShoppingCart, User, Package, LayoutDashboard, UserCog } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const { cartCount } = useCart();

    const isAdmin = user?.isAdmin;

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-white/30 backdrop-blur-lg shadow-md">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-extrabold text-indigo-600 tracking-wide">
                    Ecommerce
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8 font-medium">
                    {/* Home for all users */}
                    <Link to="/" className="hover:text-indigo-600 transition">Home</Link>

                    {/* Show Products only to non-admins */}
                    {!isAdmin && (
                        <Link to="/products" className="hover:text-indigo-600 transition">Products</Link>
                    )}

                    {user ? (
                        <div className="flex items-center gap-4">
                            {isAdmin ? (
                                <Link to="/admin" className="flex items-center gap-1 hover:text-indigo-600 transition">
                                    <LayoutDashboard size={18} /> Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link to="/cart" className="flex items-center gap-1 hover:text-indigo-600 transition relative">
                                        <ShoppingCart size={18} /> Cart
                                        {cartCount > 0 && (
                                            <span className="absolute -top-2 -right-3 bg-indigo-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                                {cartCount}
                                            </span>
                                        )}
                                    </Link>
                                    <Link to="/orders" className="flex items-center gap-1 hover:text-indigo-600 transition">
                                        <Package size={18} /> Orders
                                    </Link>
                                </>
                            )}

                            <Link to="/profile" className="flex items-center gap-1 hover:text-indigo-600 transition">
                                {!isAdmin ? <User size={18} /> : <UserCog size={18} />} {user.name}
                            </Link>
                            <button
                                onClick={logout}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition shadow-md cursor-pointer"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 shadow-md transition"
                        >
                            Login
                        </Link>
                    )}
                </div>

                {/* Mobile Toggle Button */}
                <button className="md:hidden text-indigo-700" onClick={() => setOpen(!open)}>
                    {open ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {open && (
                <div className="md:hidden fixed top-0 right-0 h-full w-2/3 bg-white shadow-2xl p-6 flex flex-col gap-6 z-50">
                    {/* Home for all */}
                    <Link to="/" onClick={() => setOpen(false)}>Home</Link>

                    {/* Products only for non-admins */}
                    {!isAdmin && (
                        <Link to="/products" onClick={() => setOpen(false)}>Products</Link>
                    )}

                    {user ? (
                        <>
                            {isAdmin ? (
                                <Link to="/admin" onClick={() => setOpen(false)}>Dashboard</Link>
                            ) : (
                                <>
                                    <Link to="/cart" onClick={() => setOpen(false)}>Cart</Link>
                                    <Link to="/orders" onClick={() => setOpen(false)}>Orders</Link>
                                </>
                            )}
                            <Link to="/profile" onClick={() => setOpen(false)}>Profile</Link>
                            <button
                                onClick={() => {
                                    logout();
                                    setOpen(false);
                                }}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-full"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login" onClick={() => setOpen(false)} className="bg-indigo-600 text-white px-4 py-2 rounded-full">
                            Login
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
}
