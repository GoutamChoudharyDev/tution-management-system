import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleToggleSidebar = () => {
    setIsSidebarOpen(prev => !prev)
  }

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false)
  }

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: '📊'
    },
    {
      name: 'Classes',
      path: '/admin/classes',
      icon: '📚'
    },
    {
      name: 'Attendance',
      path: '/admin/attendance',
      icon: '✓'
    },
    {
      name: 'User Management',
      path: '/admin/users',
      icon: '👥'
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col bg-white border-r border-black/20 shadow-sm lg:flex">
        <div className="flex h-16 items-center px-5 border-b border-black/20">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-linear-to-br from-indigo-600 to-violet-600 text-white shadow-lg">
            <span className="text-xl">🎓</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-semibold">Tuition Admin</p>
            <p className="text-xs text-slate-500">Management Panel</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-semibold transition-all duration-200 ${isActive
                  ? 'bg-slate-100 text-slate-900 ring-1 ring-black/20 border border-emerald-500'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 hover:border hover:border-emerald-500 hover:border-opacity-100'
                  }`}
              >
                <span className={`inline-flex h-9 w-9 items-center justify-center rounded-2xl text-lg ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-indigo-500 group-hover:text-white'
                  }`}>
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="px-4 pb-6">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-2xl border border-black/20 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-500 hover:border-opacity-100 hover:bg-white hover:text-slate-900 cursor-pointer"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-rose-500 text-white">🚪</span>
            Logout
          </button>
        </div>
      </aside>

      <div className="fixed inset-x-0 top-0 z-40 border-b border-black/20 bg-white/95 backdrop-blur-sm lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="inline-flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-3xl bg-linear-to-br from-indigo-600 to-violet-600 text-white">
              🎓
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Tuition Admin</p>
              <p className="text-xs text-slate-500">Dashboard</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleToggleSidebar}
            className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-black/20 bg-white text-slate-900 transition hover:border-emerald-500 hover:border-opacity-100 cursor-pointer"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div className={`fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-all duration-300 ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={handleCloseSidebar}>
        <aside
          className="absolute left-0 top-0 h-full w-64 bg-white border-r border-black/20 px-4 py-5 shadow-xl"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-4">
            <div>
              <p className="text-sm font-semibold">Tuition Admin</p>
              <p className="text-xs text-slate-500">Management Panel</p>
            </div>
            <button
              type="button"
              onClick={handleCloseSidebar}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-black/20 text-slate-900 transition hover:border-emerald-500 hover:border-opacity-100 cursor-pointer"
            >
              ✕
            </button>
          </div>
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={handleCloseSidebar}
                  className={`group flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-semibold transition-all duration-200 ${isActive
                    ? 'bg-slate-100 text-slate-900 ring-1 ring-black/20 border border-emerald-500'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 hover:border hover:border-emerald-500 hover:border-opacity-100'
                    }`}
                >
                  <span className={`inline-flex h-9 w-9 items-center justify-center rounded-2xl text-lg ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-indigo-500 group-hover:text-white'
                    }`}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
          <div className="mt-6">
            <button
              onClick={() => {
                handleLogout()
                handleCloseSidebar()
              }}
              className="flex w-full items-center gap-3 rounded-2xl border border-black/20 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-500 hover:border-opacity-100 hover:bg-white hover:text-slate-900 cursor-pointer"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-500 text-white">🚪</span>
              Logout
            </button>
          </div>
        </aside>
      </div>

      {/* Main Content */}
      <div className="min-h-screen bg-slate-50 lg:ml-64 lg:pt-0 pt-20">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-black/20 bg-slate-50/90 backdrop-blur-sm">
          <div className="flex flex-col gap-3 px-6 py-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Overview</p>
              <h1 className="text-2xl font-semibold text-slate-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-3 rounded-3xl bg-white/90 px-4 py-2 ring-1 ring-black/20">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">Admin User</p>
                <p className="text-xs text-slate-500">Super Administrator</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-linear-to-br from-indigo-600 to-slate-800 text-white">
                AU
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout