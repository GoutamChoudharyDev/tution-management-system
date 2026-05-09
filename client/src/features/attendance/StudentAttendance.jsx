import React, { useState } from 'react'

const StudentAttendance = () => {
  const [selectedClass, setSelectedClass] = useState('')
  const [attendanceRecords] = useState([
    {
      _id: '1',
      classId: { _id: '1', name: 'Mathematics 101', subject: 'Math' },
      date: '2026-05-01',
      status: 'present'
    },
    {
      _id: '2',
      classId: { _id: '1', name: 'Mathematics 101', subject: 'Math' },
      date: '2026-05-02',
      status: 'present'
    },
    {
      _id: '3',
      classId: { _id: '1', name: 'Mathematics 101', subject: 'Math' },
      date: '2026-05-03',
      status: 'absent'
    },
    {
      _id: '4',
      classId: { _id: '1', name: 'Mathematics 101', subject: 'Math' },
      date: '2026-05-04',
      status: 'present'
    },
    {
      _id: '5',
      classId: { _id: '1', name: 'Mathematics 101', subject: 'Math' },
      date: '2026-05-05',
      status: 'present'
    },
    {
      _id: '6',
      classId: { _id: '1', name: 'Mathematics 101', subject: 'Math' },
      date: '2026-05-06',
      status: 'absent'
    },
  ])

  const mockClasses = [
    { _id: '1', name: 'Mathematics 101', subject: 'Math' },
    { _id: '2', name: 'Physics Advanced', subject: 'Physics' },
  ]

  // Calculate stats
  const totalClasses = attendanceRecords.length
  const presentDays = attendanceRecords.filter(r => r.status === 'present').length
  const absentDays = attendanceRecords.filter(r => r.status === 'absent').length
  const attendancePercentage = totalClasses > 0 ? Math.round((presentDays / totalClasses) * 100) : 0

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">My Attendance</h1>
        <p className="mt-2 text-slate-600">Track your attendance records across all classes</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 mb-8 md:grid-cols-4">
        {[
          { label: 'Total Classes', value: totalClasses, icon: '📚', color: 'bg-blue-100', textColor: 'text-blue-600' },
          { label: 'Present', value: presentDays, icon: '✅', color: 'bg-green-100', textColor: 'text-green-600' },
          { label: 'Absent', value: absentDays, icon: '❌', color: 'bg-red-100', textColor: 'text-red-600' },
          { label: 'Attendance %', value: `${attendancePercentage}%`, icon: '📊', color: 'bg-purple-100', textColor: 'text-purple-600' },
        ].map((stat, idx) => (
          <div key={idx} className={`${stat.color} rounded-xl p-6 border border-black/5`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.textColor} mt-2`}>{stat.value}</p>
              </div>
              <span className="text-4xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Section */}
      <div className="mb-6 rounded-2xl border border-black/10 bg-white p-6">
        <label className="block text-sm font-medium text-slate-700 mb-3">
          Filter by Class
        </label>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="w-full md:w-64 rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="">All Classes</option>
          {mockClasses.map(cls => (
            <option key={cls._id} value={cls._id}>
              {cls.name} ({cls.subject})
            </option>
          ))}
        </select>
      </div>

      {/* Attendance Records Table */}
      <div className="rounded-2xl border border-black/10 bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Class Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Subject
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.map((record, idx) => (
                <tr key={record._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    {new Date(record.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {record.classId.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {record.classId.subject}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                      record.status === 'present'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      <span className={`h-2 w-2 rounded-full ${
                        record.status === 'present' ? 'bg-green-600' : 'bg-red-600'
                      }`}></span>
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {attendanceRecords.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-slate-500">No attendance records found</p>
          </div>
        )}
      </div>

      {/* Summary Card */}
      <div className="mt-8 rounded-2xl border border-black/10 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Attendance Summary</h3>
            <p className="mt-1 text-sm text-slate-600">
              You have attended {presentDays} out of {totalClasses} classes
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-3xl font-bold text-blue-600">{attendancePercentage}%</p>
              <p className="text-sm text-slate-600">Overall Attendance</p>
            </div>
            <div className="h-20 w-20 rounded-full bg-blue-600 flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{attendancePercentage}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentAttendance
