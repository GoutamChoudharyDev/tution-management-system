import { useAuth } from "../hooks/useAuth"
import { Navigate } from "react-router-dom"

const ProtectedRoute = ({ children, role }) => {
    const { user, loading } = useAuth();

    //! wait until user is fetched
    if (loading) return <p>Loading...</p>

    if (!user) return <Navigate to="/" />

    if (role && user?.role !== role) {
        return <Navigate to="/" />
    }

    return children;
}

export default ProtectedRoute;
