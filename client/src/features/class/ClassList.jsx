import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllClassesApi } from './class.api';

const ClassList = () => {
  const [classList, setClassList] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await getAllClassesApi();
        setClassList(res.allClasses);
      } catch (error) {
        console.log(error);
      }
    }

    fetchClasses();
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-gray-600">View and manage tuition classes.</p>
        </div>
        <Link
          to="/admin/classes/create"
          className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create Class
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border bg-white">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs text-gray-500">Class</th>
              <th className="px-6 py-4 text-left text-xs text-gray-500">Subject</th>
              <th className="px-6 py-4 text-left text-xs text-gray-500">Created By</th>
              <th className="px-6 py-4 text-left text-xs text-gray-500">Students</th>
              <th className="px-6 py-4 text-right text-xs text-gray-500">Action</th>
            </tr>
          </thead>

          <tbody>
            {classList.map((cls) => (
              <tr key={cls._id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">{cls.name}</td>
                <td className="px-6 py-4">{cls.subject}</td>
                <td className="px-6 py-4">{cls.createdBy?.name || 'Unknown'}</td>

                <td className="px-6 py-4">
                  {cls.students.length}
                </td>

                <td className="px-6 py-4 text-right">
                  <Link
                    to={`/admin/classes/${cls._id}`}
                    className="text-indigo-600"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  )
}

export default ClassList