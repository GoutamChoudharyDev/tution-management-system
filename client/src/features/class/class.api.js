import api from "../../services/api"

//! create class
const createClassApi = async (form) => {
    const res = await api.post("/api/class/create", form);
    return res.data;
}

//! update class
const updateClassApi = async (id, form) => {
    const res = await api.patch(`/api/class/${id}`, form);
    return res.data;
}

//! delete class
const deleteClassApi = async (id) => {
    const res = await api.delete(`/api/class/${id}`);
    return res.data;
}

//! add student to class
const addStudentToClassApi = async (form) => {
    const res = await api.post("/api/class/add-student", form);
    return res.data;
}

//! remove student to class
const removeStudentToClassApi = async (form) => {
    const res = await api.post("/api/class/remove-student", form);
    return res.data;
}

//! get all students of class
const getAllStudentsOfClassApi = async (id) => {
    const res = await api.get(`/api/class/${id}/students`)
    return res.data;
}

//! get all classes
const getAllClassesApi = async () => {
    const res = await api.get("/api/class/");
    return res.data;
}

//! get single class
const getSingleClassApi = async (id) => {
    const res = await api.get(`/api/class/single-class/${id}`)
    return res.data;
}


//!......exports.......
export {
    createClassApi,
    updateClassApi,
    deleteClassApi,
    addStudentToClassApi,
    removeStudentToClassApi,
    getAllStudentsOfClassApi,
    getAllClassesApi,
    getSingleClassApi
} 