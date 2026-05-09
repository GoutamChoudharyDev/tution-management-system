import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import Login from '../features/auth/Login'
import SignUp from '../features/auth/SignUp'
import AdminDashboard from '../pages/AdminDashboard'
import StudentDashboard from '../pages/StudentDashboard'
import ClassList from '../features/class/ClassList'
import ClassDetails from '../features/class/ClassDetails'
import CreateClass from '../features/class/CreateClass'
import EditClass from '../features/class/EditClass'
import UserManagement from '../features/admin/UserManagement'
import MarkAttendance from '../features/attendance/MarkAttendance'
import StudentAttendance from '../features/attendance/StudentAttendance'
import AdminLayout from '../components/layout/AdminLayout'

const AppRoutes = () => {
    return (
        <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/register' element={<SignUp />} />

            {/* protected routes */}
            <Route
                path='/admin'
                element={
                    <ProtectedRoute role="admin">
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path='/student'
                element={
                    <ProtectedRoute role="student">
                        <StudentDashboard />
                    </ProtectedRoute>
                }
            />

            {/* Admin routes with layout */}
            <Route
                path='/admin/classes/create'
                element={
                    <ProtectedRoute role="admin">
                        <AdminLayout>
                            <CreateClass />
                        </AdminLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path='/admin/classes/edit/:id'
                element={
                    <ProtectedRoute role="admin">
                        <AdminLayout>
                            <EditClass />
                        </AdminLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path='/admin/classes'
                element={
                    <ProtectedRoute role="admin">
                        <AdminLayout>
                            <ClassList />
                        </AdminLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path='/admin/classes/:id'
                element={
                    <ProtectedRoute role="admin">
                        <AdminLayout>
                            <ClassDetails />
                        </AdminLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path='/admin/users'
                element={
                    <ProtectedRoute role="admin">
                        <AdminLayout>
                            <UserManagement />
                        </AdminLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path='/admin/attendance'
                element={
                    <ProtectedRoute role="admin">
                        <AdminLayout>
                            <MarkAttendance />
                        </AdminLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path='/student/attendance'
                element={
                    <ProtectedRoute role="student">
                        <StudentAttendance />
                    </ProtectedRoute>
                }
            />
        </Routes>
    )
}

export default AppRoutes
