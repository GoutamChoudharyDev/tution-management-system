import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getSingleClassApi, updateClassApi } from './class.api'
import { toast } from "react-toastify"

const EditClass = () => {
    const [form, setForm] = useState({
        name: "",
        subject: "",
    })

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();

    //! Fetch class details on mount
    useEffect(() => {
        const fetchClass = async () => {
            try {
                setFetching(true);
                const res = await getSingleClassApi(id);
                setForm({
                    name: res.class.name,
                    subject: res.class.subject,
                });
                toast.success("Class details loaded");
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to fetch class details");
                navigate("/admin/classes");
            } finally {
                setFetching(false);
            }
        }

        fetchClass();
    }, [id, navigate])

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();

            setLoading(true);

            const res = await updateClassApi(id, form);

            toast.success("Class Updated Successfully");

            navigate("/admin/classes")

        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update class")
        } finally {
            setLoading(false);
        }
    }

    if (fetching) {
        return (
            <div className="max-w-3xl mx-auto py-16">
                <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm animate-pulse">
                    <div className="h-6 w-48 rounded-full bg-slate-200 mb-6" />
                    <div className="space-y-4">
                        <div className="h-14 rounded-3xl bg-slate-100" />
                        <div className="h-10 rounded-3xl bg-slate-100" />
                        <div className="h-10 rounded-3xl bg-slate-100" />
                        <div className="h-12 rounded-3xl bg-slate-100" />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="rounded-3xl border border-black/20 bg-white p-8 shadow-sm">
                <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-3">
                        <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">Edit Class</p>
                        <div>
                            <h1 className="text-3xl font-semibold text-slate-900">Update class details</h1>
                            <p className="mt-3 text-sm text-slate-500">Adjust the class name or subject and save your changes.</p>
                        </div>
                    </div>
                    <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">Current class</div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                                Class Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                type="text"
                                placeholder="Enter class name"
                                className="w-full rounded-2xl border border-black/20 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                            />
                        </div>

                        <div>
                            <label htmlFor="subject" className="block text-sm font-semibold text-slate-700 mb-2">
                                Subject
                            </label>
                            <input
                                id="subject"
                                name="subject"
                                value={form.subject}
                                onChange={handleChange}
                                required
                                type="text"
                                placeholder="Enter subject"
                                className="w-full rounded-2xl border border-black/20 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                            />
                        </div>
                    </div>

                    <div className="rounded-3xl border border-black/10 bg-slate-50 p-4 text-sm text-slate-600">
                        Tip: Confirm the subject name is consistent with other classes so students can easily recognize it.
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <Link
                            to="/admin/classes"
                            className="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-500 hover:text-slate-900"
                        >
                            Cancel
                        </Link>
                        <button
                            disabled={loading}
                            type="submit"
                            className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60 cursor-pointer"
                        >
                            {loading ? "Updating..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditClass
