import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getAllClassesApi, getAllStudentsOfClassApi } from '../class/class.api'
import { markAttendanceApi } from './attendance.api'

const MarkAttendance = () => {
    //! Initialize state for selected class, date, and students
    const [classes, setClasses] = useState([]);       // all classes
    const [selectedClass, setSelectedClass] = useState(''); // selected class id
    const [students, setStudents] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [attendance, setAttendance] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    //! get allClasses for dropdown and students for selected class and date
    useEffect(() => {
        const fetchClasses = async () => {
            const res = await getAllClassesApi();
            setClasses(res.allClasses);
        }

        fetchClasses();
    }, []);

    //! get students of selected class
    useEffect(() => {
        const fetchStudents = async () => {
            if (!selectedClass || !selectedDate) return;

            const res = await getAllStudentsOfClassApi(selectedClass);

            setStudents(res.students.students);
        }

        fetchStudents();
    }, [selectedClass, selectedDate]);

    //! handle attendance change
    const handleMarkAttendance = (studentId, status) => {
        setAttendance((prev) => ({
            ...prev,
            [studentId]: status
        }));
    }

    //! handle cancel - navigate back to classes page 
    const handleCancel = () => {
        navigate('/admin/classes')
    }

    //! handle submit - validate inputs and submit attendance records
    const handleSubmit = async () => {
        if (!selectedClass) {
            return toast.error('Please select a class before submitting attendance')
        }

        if (!selectedDate) {
            return toast.error('Please select a date before submitting attendance')
        }

        if (students.length === 0) {
            return toast.error('No students are available to mark attendance')
        }

        const records = students.map((student) => ({
            student: student._id,
            status: attendance[student._id] || 'absent'
        }))

        try {
            setLoading(true)
            await markAttendanceApi({
                classId: selectedClass,
                date: selectedDate,
                records
            })
            toast.success('Attendance submitted successfully')
            navigate('/admin/classes')
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit attendance')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Mark Attendance</h1>
                    <p className="mt-2 text-slate-600">Record attendance for your classes</p>
                </div>
                <Link
                    to="/admin/classes"
                    className="inline-flex items-center gap-2 rounded-lg bg-slate-200 px-4 py-2 text-slate-900 hover:bg-slate-300 transition-colors"
                >
                    ← Back
                </Link>
            </div>

            {/* Filters */}
            <div className="mb-6 grid gap-4 rounded-2xl border border-black/10 bg-white p-6 md:grid-cols-3">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Select Class
                    </label>
                    <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    >
                        <option value="">Choose a class...</option>
                        {classes.map((cls) => (
                            <option key={cls._id} value={cls._id}>
                                {cls.name} ({cls.subject})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Select Date
                    </label>
                    <input
                        type="date"
                        name="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                </div>
            </div>

            {/* Attendance Table */}
            <div className="rounded-2xl border border-black/10 bg-white overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Student Name</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Email</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">Mark</th>
                            </tr>
                        </thead>

                        <tbody>
                            {students.map((student, idx) => {
                                const currentStatus = attendance[student._id] || 'not marked';
                                return (
                                    <tr key={student._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-900">
                                            {student.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {student.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${currentStatus === 'present'
                                                ? 'bg-green-100 text-green-700'
                                                : currentStatus === 'absent'
                                                    ? 'bg-red-100 text-red-700'
                                                    : 'bg-slate-100 text-slate-700'
                                                }`}>
                                                <span className={`h-2 w-2 rounded-full ${currentStatus === 'present'
                                                    ? 'bg-green-600'
                                                    : currentStatus === 'absent'
                                                        ? 'bg-red-600'
                                                        : 'bg-slate-400'
                                                    }`}></span>
                                                {currentStatus === 'not marked' ? 'Not marked' : currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => handleMarkAttendance(student._id, 'present')}
                                                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${attendance[student._id] === 'present'
                                                        ? 'bg-green-600 text-white'
                                                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                        }`}>
                                                    ✓ Present
                                                </button>
                                                <button
                                                    onClick={() => handleMarkAttendance(student._id, 'absent')}
                                                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${attendance[student._id] === 'absent'
                                                        ? 'bg-red-600 text-white'
                                                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                        }`}>
                                                    ✗ Absent
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                {students.length === 0 && (
                    <div className="px-6 py-12 text-center text-slate-500">
                        No students found
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-4">
                <button
                    onClick={handleCancel}
                    type="button"
                    className="rounded-lg bg-slate-200 px-6 py-2 text-slate-900 font-medium hover:bg-slate-300 transition cursor-pointer"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    type="button"
                    disabled={loading}
                    className={`rounded-lg px-6 py-2 font-medium transition cursor-pointer ${loading ? 'bg-slate-400 text-slate-700 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                    {loading ? 'Submitting...' : 'Submit Attendance'}
                </button>
            </div>
        </div>
    )
}

export default MarkAttendance