import api from "../../services/api"

//! get all users
const getAllUsersApi = async () => {
    const res = await api.get("/api/admin/users");
    return res.data;
}

//! approve user
const approveUserApi = async (userId) => {
    const res = await api.patch(`/api/admin/approve-user/${userId}`);
    return res.data;
}

export {
    getAllUsersApi,
    approveUserApi
}