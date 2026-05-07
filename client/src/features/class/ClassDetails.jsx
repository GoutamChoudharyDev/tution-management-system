import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getSingleClassApi, addStudentToClassApi, removeStudentToClassApi } from './class.api';
import { getAllUsersApi } from '../admin/admin.api';
import { toast } from "react-toastify";

const ClassDetails = () => {
  //! Initialize state
  const [classDetails, setClassDetails] = useState({
    name: "",
    subject: "",
    createdBy: {},
    createdAt: "",
    students: []
  })

  const [allUsers, setAllUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [loading, setLoading] = useState(false);

  //! get id from params
  const { id } = useParams();

  //! useEffect
  useEffect(() => {
    const fetchClassInfo = async () => {
      try {
        const res = await getSingleClassApi(id);
        console.log(res.class);
        setClassDetails(res.class);
        toast.success("Class details fetched successfully");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch class details");
      }
    }

    const fetchAllUsers = async () => {
      try {
        const res = await getAllUsersApi();
        // Filter only students and approved users
        const students = res.users.filter(user => user.role === 'student' && user.status === 'approved');
        setAllUsers(students);
      } catch (error) {
        toast.error("Failed to fetch users");
      }
    }

    fetchClassInfo();
    fetchAllUsers();
  }, [id]);

  //! Handle add student
  const handleAddStudent = async () => {
    if (!selectedStudentId) {
      toast.error("Please select a student");
      return;
    }

    try {
      setLoading(true);
      const res = await addStudentToClassApi({
        classId: id,
        studentId: selectedStudentId
      });

      // Update local state
      setClassDetails(prev => ({
        ...prev,
        students: res.class.students
      }));

      setShowAddModal(false);
      setSelectedStudentId("");
      toast.success("Student added successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add student");
    } finally {
      setLoading(false);
    }
  }

  //! Handle remove student
  const handleRemoveStudent = async (studentId) => {
    if (!window.confirm("Are you sure you want to remove this student from the class?")) {
      return;
    }

    try {
      setLoading(true);
      const res = await removeStudentToClassApi({
        classId: id,
        studentId: studentId
      });

      // Update local state
      setClassDetails(prev => ({
        ...prev,
        students: res.class.students
      }));

      toast.success("Student removed successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove student");
    } finally {
      setLoading(false);
    }
  }

  //! Get available students (not already in the class)
  const availableStudents = allUsers.filter(user =>
    !classDetails.students.some(student => student._id === user._id)
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-gray-600 mt-1">Review class information and enrolled students.</p>
        </div>
        <Link
          to="/admin/classes"
          className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Back to Classes
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Overview</h2>
          <div className="space-y-4 text-sm text-gray-700">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <span className="font-medium text-gray-500">Class Name</span>
              <span className="text-gray-900">{classDetails.name}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <span className="font-medium text-gray-500">Subject</span>
              <span className="text-gray-900">{classDetails.subject}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <span className="font-medium text-gray-500">Created By</span>
              <span className="text-gray-900">{classDetails.createdBy?.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-500">Created At</span>
              <span className="text-gray-900">
                {new Date(classDetails.createdAt).toLocaleDateString("en-GB")}
              </span>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions</h2>
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              disabled={loading}
            >
              Add Student
            </button>
            <p className="text-xs text-gray-500">Select a student to add to this class</p>
          </div>
        </section>
      </div>

      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Enrolled Students</h2>
          <span className="text-sm text-gray-500">{classDetails.students.length} students</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {classDetails.students.map((student) => (
                <tr key={student._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{student.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{student.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleRemoveStudent(student._id)}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      disabled={loading}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add Student to Class</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Student
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a student...</option>
                {availableStudents.map((student) => (
                  <option key={student._id} value={student._id}>
                    {student.name} ({student.email})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedStudentId("");
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleAddStudent}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={loading || !selectedStudentId}
              >
                {loading ? "Adding..." : "Add Student"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClassDetails
