"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Mail, Calendar, User, MessageSquare, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react"

export default function AdminContacts() {
    const router = useRouter()
    const [contacts, setContacts] = useState([])
    const [loading, setLoading] = useState(true)
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 1
    })

    useEffect(() => {
        fetchContacts()
        markMessagesAsRead()
    }, [pagination.page])

    const markMessagesAsRead = async () => {
        try {
            const token = localStorage.getItem("adminToken")
            if (token) {
                await fetch("/api/admin/contacts", {
                    method: "PUT",
                    headers: { Authorization: `Bearer ${token}` }
                })
                // Trigger a custom event to update sidebar
                window.dispatchEvent(new Event("messagesRead"))
            }
        } catch (error) {
            console.error("Failed to mark messages as read:", error)
        }
    }

    const fetchContacts = async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem("adminToken")
            if (!token) {
                router.push("/admin/login")
                return
            }

            const response = await fetch(`/api/admin/contacts?page=${pagination.page}&limit=${pagination.limit}`, {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (response.status === 401) {
                localStorage.removeItem("adminToken")
                router.push("/admin/login")
                return
            }

            const result = await response.json()
            if (result.success) {
                setContacts(result.data)
                setPagination(prev => ({ ...prev, ...result.pagination }))
            }
        } catch (error) {
            console.error("Failed to fetch contacts:", error)
        } finally {
            setLoading(false)
        }
    }

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.pages) {
            setPagination(prev => ({ ...prev, page: newPage }))
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#022741]">Messages</h1>
                    <p className="text-gray-500 mt-1">View inquiries from the Contact Us form.</p>
                </div>
                <button
                    onClick={fetchContacts}
                    className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors w-fit"
                    title="Refresh"
                >
                    <ArrowUpRight className="w-5 h-5" />
                </button>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Sender</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Message</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[#022741]"></div>
                                    </td>
                                </tr>
                            ) : contacts.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500 text-sm">
                                        No messages found.
                                    </td>
                                </tr>
                            ) : (
                                contacts.map((contact) => (
                                    <tr key={contact._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(contact.createdAt).toLocaleDateString()}
                                            </div>
                                            <div className="text-xs text-gray-400 pl-6">
                                                {new Date(contact.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-start gap-3">
                                                <div className="mt-1 bg-blue-50 p-1.5 rounded-full text-blue-600 shrink-0">
                                                    <User className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 text-sm">{contact.name}</p>
                                                    <a href={`mailto:${contact.email}`} className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-0.5">
                                                        <Mail className="w-3 h-3" />
                                                        {contact.email}
                                                    </a>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-3">
                                                <div className="mt-1 text-gray-400 shrink-0">
                                                    <MessageSquare className="w-4 h-4" />
                                                </div>
                                                <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">
                                                    {contact.message}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${contact.status === 'new' ? 'bg-blue-100 text-blue-700' :
                                                    contact.status === 'read' ? 'bg-gray-100 text-gray-700' :
                                                        'bg-green-100 text-green-700'}`}>
                                                {contact.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
                        <p className="text-sm text-gray-500">
                            Showing page <span className="font-bold text-gray-900">{pagination.page}</span> of <span className="font-bold text-gray-900">{pagination.pages}</span>
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handlePageChange(pagination.page - 1)}
                                disabled={pagination.page === 1}
                                className="p-2 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={pagination.page === pagination.pages}
                                className="p-2 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
