import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { getSingleClassApi, addStudentToClassApi, removeStudentToClassApi, deleteClassApi } from './class.api';
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
  const [deleting, setDeleting] = useState(false);

  //! get id from params
  const { id } = useParams();
  const navigate = useNavigate();

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

  //! Handle delete class
  const handleDeleteClass = async () => {
    if (!window.confirm(`Are you sure you want to delete "${classDetails.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeleting(true);
      await deleteClassApi(id);
      toast.success("Class deleted successfully");
      navigate("/admin/classes");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete class");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-8">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">Class Details</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">{classDetails.name || 'Class Details'}</h1>
          <p className="mt-2 text-sm text-slate-500">Review the class overview, enrolled students, and available actions.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to={`/admin/classes/edit/${id}`}
            className="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:border-emerald-500 hover:text-slate-900"
          >
            Edit Class
          </Link>
          <Link
            to={`/admin/attendance/class/${id}`}
            className="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-emerald-100 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:border-emerald-500 hover:bg-emerald-200"
          >
            View Attendance
          </Link>
          <button
            onClick={handleDeleteClass}
            disabled={deleting}
            className="inline-flex items-center justify-center rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60 cursor-pointer"
          >
            {deleting ? 'Deleting...' : 'Delete Class'}
          </button>
          <Link
            to="/admin/classes"
            className="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-500 hover:text-slate-900"
          >
            Back to Classes
          </Link>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.75fr_1fr]">
        <section className="rounded-3xl border border-black/20 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">Overview</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">{classDetails.subject || 'General Subject'}</h2>
            </div>
            <div className="rounded-3xl bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
              {classDetails.students?.length || 0} enrolled
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-black/10 bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Class Name</p>
              <p className="mt-3 text-lg font-semibold text-slate-900">{classDetails.name || 'N/A'}</p>
            </div>
            <div className="rounded-3xl border border-black/10 bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Subject</p>
              <p className="mt-3 text-lg font-semibold text-slate-900">{classDetails.subject || 'N/A'}</p>
            </div>
            <div className="rounded-3xl border border-black/10 bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Instructor</p>
              <p className="mt-3 text-lg font-semibold text-slate-900">{classDetails.createdBy?.name || 'Unknown'}</p>
            </div>
            <div className="rounded-3xl border border-black/10 bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Created At</p>
              <p className="mt-3 text-lg font-semibold text-slate-900">{classDetails.createdAt ? new Date(classDetails.createdAt).toLocaleDateString('en-GB') : 'N/A'}</p>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-black/10 bg-emerald-50 p-5 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">Class Summary</p>
            <p className="mt-2 text-slate-600">This class is assigned to the selected subject and managed by the assigned instructor. Add or remove students as needed from the enrollment section below.</p>
          </div>
        </section>

        <section className="rounded-3xl border border-black/20 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-500">Class Actions</p>
              <p className="mt-2 text-sm text-slate-500">Quick actions for this class.</p>
            </div>
            <div className="rounded-3xl bg-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">Focus</div>
          </div>

          <div className="mt-6 space-y-4">
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60 cursor-pointer"
              disabled={loading}
            >
              Add Student
            </button>
            <div className="rounded-3xl border border-black/10 bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">Tip</p>
              <p className="mt-2">Only approved students can be added to this class. Remove inactive students to keep enrollment accurate.</p>
            </div>
          </div>
        </section>
      </div>

      <section className="rounded-3xl border border-black/20 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Enrolled Students</h2>
            <p className="mt-2 text-sm text-slate-500">Manage who is currently enrolled in this class.</p>
          </div>
          <div className="rounded-3xl bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-600">{classDetails.students?.length || 0} students</div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Student</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {classDetails.students.length ? (
                classDetails.students.map((student) => (
                  <tr key={student._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">{student.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{student.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-600">{student.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleRemoveStudent(student._id)}
                        disabled={loading}
                        className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-red-700 transition hover:border-red-400 hover:bg-red-100 disabled:opacity-50 cursor-pointer"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-sm text-slate-500">
                    No students are currently enrolled in this class.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Add Student to Class</h3>
                <p className="mt-2 text-sm text-slate-500">Choose an approved student and add them to this class roster.</p>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setSelectedStudentId('')
                }}
                className="rounded-2xl border border-black/10 bg-slate-100 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-200"
              >
                Close
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Select Student</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full rounded-2xl border border-black/20 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="">Choose a student...</option>
                  {availableStudents.map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.name} — {student.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    setSelectedStudentId('')
                  }}
                  disabled={loading}
                  className="w-full rounded-2xl border border-black/10 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-500 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddStudent}
                  disabled={loading || !selectedStudentId}
                  className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60 cursor-pointer"
                >
                  {loading ? 'Adding...' : 'Add Student'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClassDetails
