import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import Login from '../features/auth/Login'
import SignUp from '../features/auth/SignUp'
import AdminDashboard from '../pages/AdminDashboard'
import StudentDashboard from '../pages/StudentDashboard'

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

        </Routes>
    )
}

export default AppRoutes
