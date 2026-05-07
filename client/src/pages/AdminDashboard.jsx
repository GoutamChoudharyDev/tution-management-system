import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../components/layout/AdminLayout'
import { getAllClassesApi } from '../features/class/class.api'
import { getAllUsersApi } from '../features/admin/admin.api'
import { toast } from 'react-toastify'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    pendingUsers: 0,
    approvedUsers: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)

        // Fetch classes
        const classesRes = await getAllClassesApi()

        // Fetch users
        const usersRes = await getAllUsersApi()

        // Calculate stats
        const totalClasses = classesRes.allClasses.length
        const totalStudents = classesRes.allClasses.reduce((sum, cls) => sum + cls.students.length, 0)
        const pendingUsers = usersRes.users.filter(user => user.status === 'pending').length
        const approvedUsers = usersRes.users.filter(user => user.status === 'approved').length

        setStats({
          totalClasses,
          totalStudents,
          pendingUsers,
          approvedUsers
        })
      } catch (error) {
        toast.error('Failed to load dashboard statistics')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: 'Total Classes',
      value: stats.totalClasses,
      icon: '📚',
      color: 'bg-blue-500',
      link: '/admin/classes'
    },
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: '👨‍🎓',
      color: 'bg-green-500',
      link: '/admin/classes'
    },
    {
      title: 'Pending Approvals',
      value: stats.pendingUsers,
      icon: '⏳',
      color: 'bg-yellow-500',
      link: '/admin/users'
    },
    {
      title: 'Approved Users',
      value: stats.approvedUsers,
      icon: '✅',
      color: 'bg-purple-500',
      link: '/admin/users'
    }
  ]

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome to Admin Dashboard</h1>
          <p className="text-blue-100">
            Manage classes, students, and user approvals from your centralized admin panel.
          </p>
        </div>

        {/* Statistics Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((card, index) => (
              <Link
                key={index}
                to={card.link}
                className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform`}>
                    {card.icon}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            <p className="text-sm text-gray-600 mt-1">Common administrative tasks</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                to="/admin/classes/create"
                className="flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-blue-200 transition-colors">
                  <span className="text-blue-600 text-lg">➕</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Create Class</h3>
                  <p className="text-sm text-gray-600">Add a new tuition class</p>
                </div>
              </Link>

              <Link
                to="/admin/classes"
                className="flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-green-200 transition-colors">
                  <span className="text-green-600 text-lg">📋</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Manage Classes</h3>
                  <p className="text-sm text-gray-600">View and edit classes</p>
                </div>
              </Link>

              <Link
                to="/admin/users"
                className="flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-purple-200 transition-colors">
                  <span className="text-purple-600 text-lg">👥</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">User Management</h3>
                  <p className="text-sm text-gray-600">Approve pending users</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <p className="text-sm text-gray-600 mt-1">Latest system activities</p>
          </div>
          <div className="p-6">
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">📈</div>
              <p>Activity tracking coming soon...</p>
              <p className="text-sm mt-1">Monitor user registrations, class creations, and more</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard