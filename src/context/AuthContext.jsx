import { createContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = useCallback(async () => {
        try {
            const { data } = await api.get("/auth/profile");
            setUser(data);
            if (data?._id) localStorage.setItem("userId", data._id);
        } catch {
            setUser(null);
            localStorage.removeItem("userId");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const login = async (email, password) => {
        const { data } = await api.post("/auth/login", { email, password });
        await fetchProfile();
        if (data?.user?._id) localStorage.setItem("userId", data.user._id);
        return data;
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout");
            toast.success("Logout successful!");
        } catch (e) {
            console.error("Logout error:", e);
            toast.error("Logout failed!");
        }
        setUser(null);
        localStorage.removeItem("userId");
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, fetchProfile }}>
            {children}
        </AuthContext.Provider>
    );
};
