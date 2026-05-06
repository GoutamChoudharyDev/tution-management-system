import { createContext, useEffect, useState } from "react";
import { getMeApi } from "../features/auth/auth.api";

//! 1) create & export context 
export const AuthContext = createContext();

//! 2) create AuthProvider function 
const AuthProvider = ({ children }) => {

    //! 4) initilize states
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    //! 5) get logged-in user on app load
    const fetchUser = async () => {
        try {
            const res = await getMeApi();
            console.log("res of getme : ", res);
            setUser(res.user);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    //! 6) it's a get api so we will call it in useEffect
    useEffect(() => {
        fetchUser();
    }, []);

    //! 3) wrap children in AuthContext.Provider
    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

//! 2.1) export AuthProvider
export default AuthProvider; 