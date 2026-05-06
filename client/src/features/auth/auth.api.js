import api from "../../services/api";

//! ......Auth APIs.......

// login api(post)
const loginApi = async (form) => {
    const res = await api.post("/api/auth/login", form)
    return res.data;
}

// register api(post)
const registerApi = async (form) => {
    const res = await api.post("/api/auth/register", form)
    return res.data;
}

// getMe api(get)
const getMeApi = async () => {
    const res = await api.get("/api/auth/me");
    return res.data;
}

// logout api(post)
const logoutApi = async () => {
    const res = await api.post("/api/auth/logout");
    return res.data;
}

// export
export {
    loginApi,
    registerApi,
    getMeApi,
    logoutApi
}