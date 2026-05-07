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
        <section className="rounded-3xl border border-black/20 bg-linear-to-r from-slate-900 via-indigo-700 to-blue-600 p-6 text-white overflow-hidden relative sm:p-8">
          <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute -bottom-6 left-6 h-36 w-36 rounded-full bg-white/10 blur-3xl"></div>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-200 opacity-80">Welcome to Admin Dashboard</p>
              <h1 className="text-4xl font-semibold tracking-tight">Track your metrics and manage your academy from one place</h1>
              <p className="max-w-xl text-slate-200/90">Monitor classes, student enrollment, and user approvals with a clean, modern dashboard designed for administrators.</p>
            </div>
            <div className="rounded-3xl border border-black/20 bg-white/10 p-5 backdrop-blur-sm">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-200">Current session</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-indigo-700 shadow-lg">📈</div>
                <div>
                  <p className="text-sm text-slate-200">Live performance</p>
                  <p className="text-2xl font-semibold">Stable</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {loading ? (
            [...Array(4)].map((_, index) => (
              <div key={index} className="h-36 rounded-3xl bg-white/80 p-6 shadow-sm animate-pulse"></div>
            ))
          ) : (
            statCards.map((card) => (
              <Link
                key={card.title}
                to={card.link}
                className="group rounded-3xl bg-white p-6 ring-1 ring-black/20 border border-black/20 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-emerald-500 hover:border-opacity-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-500">{card.title}</p>
                    <p className="mt-4 text-3xl font-semibold text-slate-900">{card.value}</p>
                  </div>
                  <div className={`flex h-14 w-14 items-center justify-center rounded-3xl text-2xl text-white ${card.color}`}>
                    {card.icon}
                  </div>
                </div>
                <div className="mt-5 flex items-center text-sm font-semibold text-slate-500 transition-colors group-hover:text-slate-900">
                  <span>View details</span>
                  <span className="ml-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors group-hover:bg-slate-900 group-hover:text-white">→</span>
                </div>
              </Link>
            ))
          )}
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.7fr_1fr]">
          <div className="rounded-3xl border border-black/20 bg-white p-6 ring-1 ring-black/20 transition-all duration-300 ease-out hover:border-emerald-500 hover:border-opacity-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">Quick Actions</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900">Take action fast</h2>
              </div>
              <div className="rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm">Recommended</div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <Link
                to="/admin/classes/create"
                className="group rounded-3xl border border-black/20 bg-slate-50 p-4 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-emerald-500 hover:border-opacity-100 hover:bg-white"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-indigo-100 text-indigo-700 shadow-sm">
                  ➕
                </div>
                <div className="mt-4 text-sm font-semibold text-slate-900">Create Class</div>
                <p className="mt-2 text-sm text-slate-500">Setup a new tuition session</p>
              </Link>
              <Link
                to="/admin/classes"
                className="group rounded-3xl border border-black/20 bg-slate-50 p-4 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-emerald-500 hover:border-opacity-100 hover:bg-white"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-700 shadow-sm">
                  📚
                </div>
                <div className="mt-4 text-sm font-semibold text-slate-900">Manage Classes</div>
                <p className="mt-2 text-sm text-slate-500">Edit existing schedules</p>
              </Link>
              <Link
                to="/admin/users"
                className="group rounded-3xl border border-black/20 bg-slate-50 p-4 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-emerald-500 hover:border-opacity-100 hover:bg-white"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-purple-100 text-purple-700 shadow-sm">
                  👥
                </div>
                <div className="mt-4 text-sm font-semibold text-slate-900">User Management</div>
                <p className="mt-2 text-sm text-slate-500">Approve and verify users</p>
              </Link>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-black/20">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-500">Recent Activity</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900">Activity tracking</h2>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Soon</span>
            </div>
            <div className="mt-8 rounded-3xl border border-dashed border-black/20 bg-slate-50 p-10 text-center text-slate-500 transition-all duration-300 ease-out hover:border-emerald-500 hover:border-opacity-100">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-3xl shadow-sm">📉</div>
              <p className="font-semibold text-slate-900">Activity tracking coming soon</p>
              <p className="mt-2 text-sm text-slate-500">
                Once the platform is live, you’ll see a chronological log of all system changes and updates here.
              </p>
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard