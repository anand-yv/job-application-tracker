import { TOKEN_KEY } from "@/constant";
import { auth } from "@/services/auth";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    
    const fetchUser = async() => {
        const token = localStorage.getItem(TOKEN_KEY);
        if(!token){
            setUser(null);
            return;
        };
        try{
            const res = await auth.getMe();
            setUser(res.data);
        }catch(e){
            console.error("Some error occured : ", e);
        }
    }

    const logout = () => {
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
    }

    useEffect(() => {
        fetchUser();
    },[]);

    return (
        <AuthContext.Provider value={{user, fetchUser, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);