import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Profile() {
    const { user, logout } = useContext(AuthContext);

    if (!user) return null;

    return (
        <div className="pt-24 min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 px-4 md:px-8 lg:px-16 flex items-center justify-center">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-bold">
                        {user.name ? user.name.charAt(0).toUpperCase() : "User"}
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold">{user.name}{user.isAdmin ? " (Admin)" : ""}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                </div>

                <div className="mt-6">
                    <button
                        onClick={logout}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition cursor-pointer"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
