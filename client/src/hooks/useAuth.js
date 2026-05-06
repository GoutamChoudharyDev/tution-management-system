import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// create useAuth (custom hook)
const useAuth = () => {
    return useContext(AuthContext);
}

// export
export { useAuth }