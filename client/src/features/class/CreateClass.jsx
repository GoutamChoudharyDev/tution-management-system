import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createClassApi } from './class.api'
import { toast } from "react-toastify"

const CreateClass = () => {
  const [form, setForm] = useState({
    name: "",
    subject: "",
  })

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      setLoading(true);

      const res = await createClassApi(form);

      setForm({
        name: "",
        subject: "",
      });

      toast.success("Class Created Successfully");

      navigate("/admin/classes")

    } catch (error) {
      toast.error(error.response?.data?.message || "create class error")
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <p className="text-gray-600 mt-2">Add a new class to the tuition management system.</p>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <form
          onSubmit={handleSubmit}
          className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Class Name
            </label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              type="text"
              placeholder="Enter class name"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <input
              id="subject"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              required
              type="text"
              placeholder="Enter subject"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <Link
              to="/admin/classes"
              className="inline-flex items-center justify-center px-5 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </Link>
            <button
              disabled={loading}
              type="submit"
              className="inline-flex items-center justify-center px-5 py-3 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition"
            >
              {loading ? "Creating..." : "Create Class"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateClass
