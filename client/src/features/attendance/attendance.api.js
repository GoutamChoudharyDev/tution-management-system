import api from "../../services/api"

//! mark attendance (admin)
const markAttendanceApi = async (form) => {
    const res = await api.post("/api/attendance/mark", form);
    return res.data;
}

//! get class attendance (admin)
const getClassAttendanceApi = async (classId) => {
    const res = await api.get(`/api/attendance/class/${classId}`);
    return res.data;
}

//! get my attendance (student)
const getMyAttendanceApi = async () => {
    const res = await api.get("/api/attendance/my");
    return res.data;
}

export {
    markAttendanceApi,
    getClassAttendanceApi,
    getMyAttendanceApi
}