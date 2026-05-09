import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getSingleClassApi } from '../class/class.api'
import { getClassAttendanceApi } from './attendance.api'

const ViewClassAttendance = () => {
    //! Initialize state
    const [classDetails, setClassDetails] = useState({
        name: "",
        subject: "",
        createdBy: {},
        students: []
    })
    const [attendance, setAttendance] = useState([])
    const [filteredAttendance, setFilteredAttendance] = useState([])
    const [loading, setLoading] = useState(true)
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    //! get id from params
    const { id } = useParams()
    const navigate = useNavigate()

    //! Fetch class details and attendance records
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)

                // Fetch class details
                const classRes = await getSingleClassApi(id)
                setClassDetails(classRes.class)

                // Fetch attendance records
                const attendanceRes = await getClassAttendanceApi(id)
                const records = attendanceRes.attendance || []
                setAttendance(records)
                setFilteredAttendance(records)

                toast.success("Attendance records loaded successfully")
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to load attendance records")
                navigate('/admin/classes')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [id, navigate])

    //! Filter attendance by date range
    useEffect(() => {
        if (!startDate && !endDate) {
            setFilteredAttendance(attendance)
            return
        }

        const filtered = attendance.filter(record => {
            const recordDate = new Date(record.date)
            const start = startDate ? new Date(startDate) : null
            const end = endDate ? new Date(endDate) : null

            if (start && recordDate < start) return false
            if (end && recordDate > end) return false

            return true
        })

        setFilteredAttendance(filtered)
    }, [startDate, endDate, attendance])

    //! Calculate statistics
    const calculateStats = () => {
        const stats = {
            totalRecords: filteredAttendance.length,
            totalPresent: 0,
            totalAbsent: 0,
            studentStats: {}
        }

        filteredAttendance.forEach(record => {
            record.records.forEach(att => {
                if (att.status === 'present') {
                    stats.totalPresent++
                } else {
                    stats.totalAbsent++
                }

                if (!stats.studentStats[att.student?._id]) {
                    stats.studentStats[att.student?._id] = {
                        name: att.student?.name || 'Unknown',
                        present: 0,
                        absent: 0
                    }
                }

                if (att.status === 'present') {
                    stats.studentStats[att.student?._id].present++
                } else {
                    stats.studentStats[att.student?._id].absent++
                }
            })
        })

        return stats
    }

    const stats = calculateStats()

    //! Handle clear filters
    const handleClearFilters = () => {
        setStartDate('')
        setEndDate('')
    }

    //! Handle print
    const handlePrint = () => {
        window.print()
    }

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                        <p className="mt-4 text-slate-600">Loading attendance records...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            {/* Header Section */}
            <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-emerald-600 font-semibold">Attendance Records</p>
                    <h1 className="mt-3 text-4xl font-bold text-slate-900">{classDetails.name || 'Class Attendance'}</h1>
                    <p className="mt-2 text-slate-600">View and manage attendance records for {classDetails.subject || 'this class'}</p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={handlePrint}
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 cursor-pointer"
                    >
                        🖨️ Print
                    </button>
                    <Link
                        to={`/admin/classes/${id}`}
                        className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-500 hover:text-emerald-600 cursor-pointer"
                    >
                        ← Back to Class
                    </Link>
                </div>
            </div>

            {/* Class Info Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 p-6">
                    <p className="text-sm font-medium text-blue-600">Class Name</p>
                    <p className="mt-2 text-2xl font-bold text-blue-900">{classDetails.name}</p>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 p-6">
                    <p className="text-sm font-medium text-purple-600">Subject</p>
                    <p className="mt-2 text-2xl font-bold text-purple-900">{classDetails.subject || 'N/A'}</p>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 p-6">
                    <p className="text-sm font-medium text-emerald-600">Instructor</p>
                    <p className="mt-2 text-2xl font-bold text-emerald-900">{classDetails.createdBy?.name || 'Unknown'}</p>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 p-6">
                    <p className="text-sm font-medium text-orange-600">Total Students</p>
                    <p className="mt-2 text-2xl font-bold text-orange-900">{classDetails.students?.length || 0}</p>
                </div>
            </div>

            {/* Statistics Section */}
            <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-600 font-medium">Total Records</p>
                            <p className="mt-2 text-3xl font-bold text-slate-900">{stats.totalRecords}</p>
                        </div>
                        <span className="text-4xl">📋</span>
                    </div>
                </div>

                <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-600 font-medium">Present</p>
                            <p className="mt-2 text-3xl font-bold text-green-600">{stats.totalPresent}</p>
                        </div>
                        <span className="text-4xl">✅</span>
                    </div>
                </div>

                <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-600 font-medium">Absent</p>
                            <p className="mt-2 text-3xl font-bold text-red-600">{stats.totalAbsent}</p>
                        </div>
                        <span className="text-4xl">❌</span>
                    </div>
                </div>

                <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-600 font-medium">Attendance Rate</p>
                            <p className="mt-2 text-3xl font-bold text-blue-600">
                                {stats.totalRecords > 0 ? Math.round((stats.totalPresent / (stats.totalPresent + stats.totalAbsent)) * 100) : 0}%
                            </p>
                        </div>
                        <span className="text-4xl">📊</span>
                    </div>
                </div>
            </div>

            {/* Filter Section */}
            <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900 mb-6">Filter Records</h2>
                <div className="grid gap-4 md:grid-cols-3 items-end">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Start Date
                        </label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            End Date
                        </label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                        />
                    </div>

                    <button
                        onClick={handleClearFilters}
                        className="w-full rounded-lg bg-slate-200 px-4 py-2 text-slate-900 font-semibold hover:bg-slate-300 transition cursor-pointer"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Attendance Table */}
            <div className="rounded-2xl border border-black/10 bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Date</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Student Name</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Email</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">Status</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAttendance.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <p className="text-slate-500 text-lg">No attendance records found</p>
                                        <p className="text-slate-400 text-sm mt-2">Try adjusting your filters</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredAttendance.map((record, idx) => (
                                    <React.Fragment key={record._id}>
                                        {record.records.map((att, aidx) => (
                                            <tr key={`${record._id}-${aidx}`} className={aidx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                                {aidx === 0 && (
                                                    <td rowSpan={record.records.length} className="px-6 py-4 text-sm font-medium text-slate-900 border-r border-slate-200">
                                                        {new Date(record.date).toLocaleDateString('en-GB', {
                                                            weekday: 'short',
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </td>
                                                )}
                                                <td className="px-6 py-4 text-sm font-medium text-slate-900">
                                                    {att.student?.name || 'Unknown'}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600">
                                                    {att.student?.email || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${att.status === 'present'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                        }`}>
                                                        <span className={`h-2 w-2 rounded-full ${att.status === 'present' ? 'bg-green-600' : 'bg-red-600'
                                                            }`}></span>
                                                        {att.status.charAt(0).toUpperCase() + att.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center text-sm text-slate-600">
                                                    {new Date(record.createdAt).toLocaleTimeString('en-GB', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Student Summary Section */}
            {Object.keys(stats.studentStats).length > 0 && (
                <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900 mb-6">Student Summary</h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {Object.entries(stats.studentStats).map(([studentId, stat]) => (
                            <div key={studentId} className="rounded-xl border border-slate-200 p-4 bg-slate-50 hover:shadow-md transition">
                                <h3 className="font-semibold text-slate-900">{stat.name}</h3>
                                <div className="mt-3 flex gap-4">
                                    <div className="flex-1">
                                        <p className="text-xs text-slate-600 mb-1">Present</p>
                                        <p className="text-2xl font-bold text-green-600">{stat.present}</p>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-slate-600 mb-1">Absent</p>
                                        <p className="text-2xl font-bold text-red-600">{stat.absent}</p>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-slate-600 mb-1">Rate</p>
                                        <p className="text-2xl font-bold text-blue-600">
                                            {stat.present + stat.absent > 0
                                                ? Math.round((stat.present / (stat.present + stat.absent)) * 100)
                                                : 0}%
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ViewClassAttendance