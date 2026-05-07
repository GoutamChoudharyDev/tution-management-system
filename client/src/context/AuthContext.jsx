import { createContext, useEffect, useState } from "react";
import { getMeApi, logoutApi } from "../features/auth/auth.api";

//! 1) create & export context
export const AuthContext = createContext();

//! 2) create AuthProvider function
const AuthProvider = ({ children }) => {

    //! 4) initilize states
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    //! 6) it's a get api so we will call it in useEffect
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getMeApi();
                setUser(res.user);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    //! logout function
    const logout = async () => {
        try {
            await logoutApi();
            setUser(null);
        } catch (error) {
            console.error("Logout error:", error);
            // Even if logout API fails, clear local user state
            setUser(null);
        }
    };

    //! 3) wrap children in AuthContext.Provider
    return (
        <AuthContext.Provider value={{ user, setUser, loading, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

//! 2.1) export AuthProvider
export default AuthProvider;