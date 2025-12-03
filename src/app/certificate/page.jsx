"use client"

import { useState } from "react"
import { Search, Download, CheckCircle, AlertCircle, Loader2, Shield, User, Calendar } from "lucide-react"

// Color constants
const COLORS = {
    navy: 'rgb(2, 39, 65)',
    yellow: 'rgb(255, 183, 11)',
}

export default function CertificatePage() {
    const [searchId, setSearchId] = useState("")
    const [loading, setLoading] = useState(false)
    const [volunteer, setVolunteer] = useState(null)
    const [error, setError] = useState("")

    const handleSearch = async (e) => {
        e.preventDefault()
        if (!searchId.trim()) return

        setLoading(true)
        setError("")
        setVolunteer(null)

        try {
            const response = await fetch(`/api/volunteers?volunteerId=${searchId.trim()}&mode=public`)
            if (response.ok) {
                const result = await response.json()
                const data = result.data || result

                if (data && data.status === 'approved') {
                    setVolunteer(data)
                } else if (data && data.status !== 'approved') {
                    setError("This volunteer profile is not yet approved.")
                } else {
                    setError("Volunteer not found. Please check the ID.")
                }
            } else {
                setError("Volunteer not found. Please check the ID.")
            }
        } catch (err) {
            console.error("Search error:", err)
            setError("An error occurred. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const downloadPDF = async (type) => {
        if (!volunteer) return
        try {
            const response = await fetch(`/api/volunteers/download-pdf?volunteerId=${volunteer.volunteerId}&type=${type}`)
            if (response.ok) {
                const blob = await response.blob()
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement("a")
                a.href = url
                a.download = `${volunteer.volunteerId}_${type}.pdf`
                document.body.appendChild(a)
                a.click()
                window.URL.revokeObjectURL(url)
                document.body.removeChild(a)
            } else {
                alert("Failed to download. Please try again.")
            }
        } catch (err) {
            console.error("Download error:", err)
            alert("An error occurred during download.")
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 flex flex-col items-center">

            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-end max-w-5xl mx-auto mb-12 w-full gap-6">
                <div className="text-center lg:text-left max-w-xl w-full lg:w-auto">
                    <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: COLORS.navy }}>
                        Verify & Download Certificate
                    </h1>
                    <p className="text-gray-600 text-lg leading-relaxed">
                        Enter your Volunteer ID to verify your membership and download your official certificate and ID card.
                    </p>
                </div>

                {/* Search Box */}
                <div className="w-full lg:w-auto min-w-[320px] max-w-md bg-white p-2 rounded-2xl shadow-lg border border-gray-100">
                    <form onSubmit={handleSearch} className="flex items-center gap-2">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <Search className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                placeholder="Enter Volunteer ID"
                                className="w-full pl-10 pr-4 py-3 rounded-xl border-none focus:ring-0 text-gray-900 placeholder-gray-400 font-medium bg-transparent"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !searchId.trim()}
                            className="px-6 py-3 rounded-xl font-bold text-white shadow-md transition-all hover:opacity-90 disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
                            style={{ backgroundColor: COLORS.navy }}
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify"}
                        </button>
                    </form>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-xl border border-red-100 mb-8 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">{error}</span>
                </div>
            )}

            {/* Result Card */}
            {volunteer && (
                <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* Card Header */}
                    <div className="bg-[#022741] p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>

                        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                            <div className="w-24 h-24 rounded-full border-4 border-white/20 shadow-xl overflow-hidden bg-white">
                                {volunteer.profilePicUrl ? (
                                    <img src={volunteer.profilePicUrl} alt={volunteer.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <User className="w-10 h-10" />
                                    </div>
                                )}
                            </div>

                            <div className="text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                                    <h2 className="text-2xl font-bold">{volunteer.name}</h2>
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                </div>
                                <p className="text-blue-200 font-mono mb-3">{volunteer.volunteerId}</p>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#FFB70B] text-[#022741] uppercase tracking-wide">
                                    Verified Member
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <p className="text-xs font-bold text-gray-500 uppercase mb-1">Membership Plan</p>
                                <p className="text-lg font-bold text-[#022741]">
                                    {volunteer.validity === 'lifetime' ? 'Lifetime Membership' :
                                        volunteer.validity === 'free' ? 'Free Membership' :
                                            `${volunteer.validity} Plan`}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <p className="text-xs font-bold text-gray-500 uppercase mb-1">Joined Date</p>
                                <div className="flex items-center gap-2 text-[#022741] font-bold">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    {new Date(volunteer.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => downloadPDF('certificate')}
                                className="flex-1 py-3.5 px-6 rounded-xl font-bold text-[#022741] shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                style={{ backgroundColor: COLORS.yellow }}
                            >
                                <Download className="w-5 h-5" />
                                Download Certificate
                            </button>

                            <button
                                onClick={() => downloadPDF('id-card')}
                                className="flex-1 py-3.5 px-6 rounded-xl font-bold text-gray-700 bg-white border-2 border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                            >
                                <User className="w-5 h-5" />
                                Download ID Card
                            </button>
                        </div>
                    </div>

                </div>
            )}
        </div>
    )
}