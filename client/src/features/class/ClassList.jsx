import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAllClassesApi, deleteClassApi } from './class.api';
import { toast } from 'react-toastify';

const ClassList = () => {
  const [classList, setClassList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchClasses = async () => {
    try {
      const res = await getAllClassesApi();
      setClassList(res.allClasses);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch classes");
    }
  }

  useEffect(() => {
    fetchClasses();
  }, [])

  const handleDelete = async (classId, className) => {
    if (!window.confirm(`Are you sure you want to delete "${className}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setLoading(true);
      await deleteClassApi(classId);
      setClassList(classList.filter(cls => cls._id !== classId));
      toast.success("Class deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete class");
    } finally {
      setLoading(false);
    }
  }

  const [searchTerm, setSearchTerm] = useState('')

  const filteredClasses = classList.filter((cls) => {
    const query = searchTerm.toLowerCase().trim()
    if (!query) return true
    return (
      cls.name.toLowerCase().includes(query) ||
      cls.subject.toLowerCase().includes(query) ||
      cls.createdBy?.name?.toLowerCase().includes(query)
    )
  })

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-black/20 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">Class Management</p>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold text-slate-900">All Tuition Classes</h1>
              <p className="max-w-2xl text-sm text-slate-500">Browse, edit and delete your tuition classes from one clean dashboard. Use search to find classes quickly.</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-72">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔎</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search classes, subjects, or teachers"
                className="w-full rounded-2xl border border-black/20 bg-slate-50 px-12 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
            <Link
              to="/admin/classes/create"
              className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Create Class
            </Link>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-black/20 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Class</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Subject</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Instructor</th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Students</th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {loading ? (
              [...Array(5)].map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="px-6 py-5">
                    <div className="h-4 w-32 rounded-full bg-slate-200" />
                  </td>
                  <td className="px-6 py-5">
                    <div className="h-4 w-24 rounded-full bg-slate-200" />
                  </td>
                  <td className="px-6 py-5">
                    <div className="h-4 w-28 rounded-full bg-slate-200" />
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="mx-auto h-4 w-10 rounded-full bg-slate-200" />
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <div className="h-8 w-16 rounded-2xl bg-slate-200" />
                      <div className="h-8 w-16 rounded-2xl bg-slate-200" />
                    </div>
                  </td>
                </tr>
              ))
            ) : filteredClasses.length ? (
              filteredClasses.map((cls) => (
                <tr key={cls._id} className="border-t border-slate-200 hover:bg-slate-50">
                  <td className="whitespace-nowrap px-6 py-5">
                    <div className="text-sm font-semibold text-slate-900">{cls.name}</div>
                    <div className="mt-1 text-xs text-slate-500">{cls.description || 'No description available'}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-5 text-sm text-slate-700">{cls.subject || 'General'}</td>
                  <td className="whitespace-nowrap px-6 py-5 text-sm text-slate-700">{cls.createdBy?.name || 'Unknown'}</td>
                  <td className="whitespace-nowrap px-6 py-5 text-center text-sm font-semibold text-slate-900">{cls.students?.length || 0}</td>
                  <td className="whitespace-nowrap px-6 py-5 text-right text-sm font-medium space-x-2">
                    <Link
                      to={`/admin/classes/${cls._id}`}
                      className="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-slate-50 px-3 py-2 text-slate-700 transition hover:border-emerald-500 hover:text-slate-900"
                    >
                      View
                    </Link>
                    <Link
                      to={`/admin/classes/edit/${cls._id}`}
                      className="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-slate-50 px-3 py-2 text-slate-700 transition hover:border-emerald-500 hover:text-slate-900"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(cls._id, cls.name)}
                      disabled={loading}
                      className="inline-flex items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-red-700 transition hover:border-red-400 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-sm text-slate-500">
                  No classes found. Try a different search or create a new class.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ClassList