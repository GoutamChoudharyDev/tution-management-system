import React, { useEffect, useState } from 'react'
import { getAllUsersApi, approveUserApi } from './admin.api'
import { toast } from 'react-toastify'

const UserManagement = () => {
  //! useStates 
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [approvingUserId, setApprovingUserId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  //! Fetch all users when component mounts 
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await getAllUsersApi()
      setUsers(res.users)
    } catch (error) {
      toast.error('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  //! approve user function 
  const handleApproveUser = async (userId) => {
    try {
      setApprovingUserId(userId)
      await approveUserApi(userId)
      toast.success('User approved successfully')

      // Update the user status in the local state
      setUsers(users.map(user =>
        user._id === userId
          ? { ...user, status: 'approved' }
          : user
      ))
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve user')
    } finally {
      setApprovingUserId(null)
    }
  }

  const pendingUsers = users.filter(user => user.status === 'pending')
  const approvedUsers = users.filter(user => user.status === 'approved')
  const filteredUsers = users.filter((user) => {
    const query = searchTerm.toLowerCase().trim()
    if (!query) return true
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query)
    )
  })

  const filteredPending = filteredUsers.filter(user => user.status === 'pending')
  const filteredApproved = filteredUsers.filter(user => user.status === 'approved')

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-black/20 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">User Management</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Review and approve users</h1>
            <p className="mt-2 text-sm text-slate-500">Manage pending accounts, approve users, and keep your admin roster up to date.</p>
          </div>
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
            <div className="rounded-3xl border border-black/10 bg-slate-50 px-4 py-4 text-sm text-slate-800">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Pending</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{pendingUsers.length}</p>
            </div>
            <div className="rounded-3xl border border-black/10 bg-slate-50 px-4 py-4 text-sm text-slate-800">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Approved</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{approvedUsers.length}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-80">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔎</span>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or role"
              className="w-full rounded-2xl border border-black/20 bg-slate-50 px-12 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          <p className="text-sm text-slate-500 text-center sm:text-right">Showing {filteredUsers.length} of {users.length} users</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section className="rounded-3xl border border-black/20 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Pending Approvals</h2>
              <p className="mt-2 text-sm text-slate-500">Review and approve new user accounts.</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">{filteredPending.length} visible</span>
          </div>

          {filteredPending.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-black/20 bg-slate-50 p-10 text-center text-slate-500">
              No pending users match your search.
            </div>
          ) : (
            <>
              <div className="mt-6 space-y-4 sm:hidden">
                {filteredPending.map((user) => (
                  <div key={user._id} className="rounded-3xl border border-black/10 bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                        <p className="mt-1 text-sm text-slate-600">{user.email}</p>
                        <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">{user.role}</p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="mt-4 text-right">
                      <button
                        onClick={() => handleApproveUser(user._id)}
                        disabled={approvingUserId === user._id}
                        className="inline-flex items-center rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                      >
                        {approvingUserId === user._id ? 'Approving...' : 'Approve'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 overflow-x-auto hidden sm:block">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Name</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Email</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Role</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Joined</th>
                      <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {filteredPending.map((user) => (
                      <tr key={user._id} className="hover:bg-slate-50">
                        <td className="px-5 py-4 text-sm font-semibold text-slate-900">{user.name}</td>
                        <td className="px-5 py-4 text-sm text-slate-600">{user.email}</td>
                        <td className="px-5 py-4 text-sm text-slate-600 capitalize">{user.role}</td>
                        <td className="px-5 py-4 text-sm text-slate-600">{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => handleApproveUser(user._id)}
                            disabled={approvingUserId === user._id}
                            className="inline-flex items-center rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60 cursor-pointer"
                          >
                            {approvingUserId === user._id ? 'Approving...' : 'Approve'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>

        <section className="rounded-3xl border border-black/20 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Approved Users</h2>
              <p className="mt-2 text-sm text-slate-500">Active accounts already approved by the admin.</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">{filteredApproved.length} visible</span>
          </div>

          {filteredApproved.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-black/20 bg-slate-50 p-10 text-center text-slate-500">
              No approved users match your search.
            </div>
          ) : (
            <>
              <div className="mt-6 space-y-4 sm:hidden">
                {filteredApproved.map((user) => (
                  <div key={user._id} className="rounded-3xl border border-black/10 bg-slate-50 p-4">
                    <div className="flex flex-col gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                        <p className="mt-1 text-sm text-slate-600">{user.email}</p>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
                        <span className="capitalize">{user.role}</span>
                        <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 overflow-hidden rounded-3xl border border-black/10 hidden sm:block">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Name</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Email</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Role</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {filteredApproved.map((user) => (
                        <tr key={user._id} className="hover:bg-slate-50">
                          <td className="px-5 py-4 text-sm font-semibold text-slate-900">{user.name}</td>
                          <td className="px-5 py-4 text-sm text-slate-600">{user.email}</td>
                          <td className="px-5 py-4 text-sm text-slate-600 capitalize">{user.role}</td>
                          <td className="px-5 py-4 text-sm text-slate-600">{new Date(user.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  )
}

export default UserManagement