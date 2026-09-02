import { TOKEN_KEY } from "@/constant";
import { auth } from "@/services/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const navigate = useNavigate();

    const fetchUser = async () => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) {
            setUser(null);
            setAuthLoading(false);
            return;
        };
        try {
            const res = await auth.getMe();
            setUser(res.data);
        } catch (e) {
            setUser(null);
            localStorage.removeItem(TOKEN_KEY);
            console.error("Some error occured : ", e);
        } finally {
            setAuthLoading(false);
        }
    }

    const logout = () => {
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
        navigate("/");
    }

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, authLoading, fetchUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);