import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function PrivateRoute({ children, adminOnly = false }) {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div className="pt-24 text-center">Loading...</div>;
    if (!user) return <Navigate to="/login" replace />;

    // 🧠 admin-only protection
    if (adminOnly && !user.isAdmin) {
        return <Navigate to="/" replace />;
    }

    return children;
}
