"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

// --- ICONS (Optimized for the new layout) ---
const Icons = {
  Search: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Download: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>,
  Phone: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
  Map: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Drop: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>,
  Badge: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>,
  User: () => <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Plus: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
}

// Color constants
const COLORS = {
  navy: 'rgb(2, 39, 65)',
  yellow: 'rgb(255, 183, 11)',
}

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchId, setSearchId] = useState("")
  const [searchResult, setSearchResult] = useState(null)
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    fetchVolunteers()
  }, [])

  const fetchVolunteers = async () => {
    try {
      const response = await fetch("/api/volunteers")
      if (response.ok) {
        const data = await response.json()
        setVolunteers(data)
      }
    } catch (err) {
      console.error("Failed to fetch volunteers:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchId.trim()) {
      setSearchResult(null)
      return
    }

    setSearching(true)
    try {
      const response = await fetch(`/api/volunteers?volunteerId=${searchId}`)
      if (response.ok) {
        const data = await response.json()
        setSearchResult(data)
      } else {
        setSearchResult(null)
        alert("Volunteer not found")
      }
    } catch (err) {
      console.error("Search error:", err)
      setSearchResult(null)
    } finally {
      setSearching(false)
    }
  }

  const clearSearch = () => {
    setSearchId("")
    setSearchResult(null)
  }

  const downloadPDF = async (volunteerId, type) => {
    try {
      const response = await fetch(`/api/volunteers/download-pdf?volunteerId=${volunteerId}&type=${type}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${volunteerId}_${type}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (err) {
      console.error("Download error:", err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-[1600px] mx-auto">
        
        {/* TOP TOOLBAR */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-10">
          
          <div className="flex items-center gap-3">
            <div className="h-8 w-2 rounded-full" style={{ backgroundColor: COLORS.yellow }}></div>
            <h2 className="text-3xl font-bold" style={{ color: COLORS.navy }}>
               All Volunteers ({volunteers.length})
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
            <div className="relative flex-grow sm:flex-grow-0 sm:w-80 shadow-sm rounded-lg bg-white">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Icons.Search />
              </div>
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Search by ID..."
                className="w-full pl-10 pr-24 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:border-transparent text-base"
                style={{ '--tw-ring-color': COLORS.navy }}
              />
              <div className="absolute inset-y-1 right-1">
                <button
                  onClick={handleSearch}
                  disabled={searching}
                  className="h-full px-4 rounded-md font-semibold text-white text-sm transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: COLORS.navy }}
                >
                  {searching ? "..." : "Search"}
                </button>
              </div>
            </div>

            {searchResult && (
               <button
                 onClick={clearSearch}
                 className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold text-sm transition-colors"
               >
                 Clear
               </button>
            )}

            <Link
              href="/volunteers/apply"
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 whitespace-nowrap"
              style={{ backgroundColor: COLORS.yellow, color: COLORS.navy }}
            >
              <Icons.Plus />
              <span>Join Now</span>
            </Link>
          </div>
        </div>

        {/* SEARCH RESULT */}
        {searchResult && (
          <div className="mb-12 animate-fade-in-up">
             <div className="flex items-center gap-2 mb-4 opacity-75">
                <Icons.Search />
                <h3 className="text-lg font-bold" style={{ color: COLORS.navy }}>Search Result Found</h3>
             </div>
            <div className="max-w-sm">
               <VolunteerCard volunteer={searchResult} downloadPDF={downloadPDF} />
            </div>
          </div>
        )}

        {/* MAIN GRID */}
        <div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm h-80 animate-pulse border border-gray-200">
                  <div className="h-24 bg-gray-200 rounded-t-2xl"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : volunteers.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="inline-block p-6 rounded-full bg-gray-50 mb-6">
                 <div className="text-gray-300"><Icons.User /></div>
              </div>
              <p className="text-gray-500 text-xl font-medium">No volunteers found yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {volunteers.map((volunteer) => (
                <VolunteerCard key={volunteer._id} volunteer={volunteer} downloadPDF={downloadPDF} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

// --- NEW PROFESSIONAL CARD DESIGN ---
function VolunteerCard({ volunteer, downloadPDF }) {
  const isLifetime = volunteer.validity === "lifetime";
  
  return (
    <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100">
      
      {/* 1. HEADER BANNER (Navy Blue) */}
      <div className="h-24 w-full relative" style={{ backgroundColor: COLORS.navy }}>
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
           {isLifetime ? (
             <span className="text-[10px] font-bold px-2 py-1 rounded bg-[#FFB70B] text-[#022741] shadow-sm uppercase tracking-wide">
               Lifetime
             </span>
           ) : (
             <span className="text-[10px] font-bold px-2 py-1 rounded bg-white/20 text-white backdrop-blur-sm shadow-sm uppercase tracking-wide">
               Member
             </span>
           )}
        </div>
        {/* ID Badge */}
        <div className="absolute top-3 right-3 text-right">
           <span className="block text-[10px] text-gray-300 uppercase tracking-widest">ID No.</span>
           <span className="text-sm font-mono font-bold text-white tracking-wide">
             {volunteer.volunteerId?.split('-').pop() || '000'}
           </span>
        </div>
      </div>

      {/* 2. AVATAR (Overlapping) */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
        <div className="w-28 h-28 rounded-full p-1 bg-white shadow-lg">
          <div className="w-full h-full rounded-full overflow-hidden bg-gray-50 relative">
             {volunteer.profilePicUrl ? (
               <img
                 src={volunteer.profilePicUrl || "/placeholder.svg"}
                 alt={volunteer.name}
                 className="w-full h-full object-cover"
               />
             ) : (
               <div className="w-full h-full flex items-center justify-center text-gray-300">
                 <Icons.User />
               </div>
             )}
          </div>
        </div>
      </div>

      {/* 3. BODY CONTENT */}
      <div className="pt-16 pb-6 px-6 flex flex-col flex-grow text-center">
        
        {/* Name & Email */}
        <div className="mb-6">
          <h3 className="text-xl font-bold leading-tight mb-1" style={{ color: COLORS.navy }}>
            {volunteer.name}
          </h3>
          <p className="text-sm text-gray-500 font-medium truncate px-2">{volunteer.email}</p>
        </div>

        {/* Info Grid (Compacts the empty space) */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100 flex-grow flex flex-col justify-center">
           <div className="grid grid-cols-2 gap-4 mb-3 border-b border-gray-200 pb-3">
              {/* Phone */}
              <div className="flex flex-col items-center">
                 <div className="text-gray-400 mb-1"><Icons.Phone /></div>
                 <span className="text-xs font-bold text-gray-700">{volunteer.mobile}</span>
              </div>
              {/* Blood Group */}
              <div className="flex flex-col items-center border-l border-gray-200 pl-4">
                 <div className="text-red-500 mb-1"><Icons.Drop /></div>
                 <span className="text-xs font-bold text-gray-700">{volunteer.bloodGroup}</span>
              </div>
           </div>
           
           {/* Location */}
           <div className="flex items-center justify-center gap-2 text-gray-600">
              <div style={{ color: COLORS.navy }}><Icons.Map /></div>
              <span className="text-xs font-medium line-clamp-1 text-left">{volunteer.address}</span>
           </div>
        </div>

        {/* Action Buttons (Full width look) */}
        <div className="grid grid-cols-2 gap-3 mt-auto">
          <button
            onClick={() => downloadPDF(volunteer.volunteerId, "id-card")}
            className="flex items-center justify-center gap-2 py-2.5 px-2 rounded-lg bg-white border hover:bg-gray-50 transition-colors group"
            style={{ borderColor: 'rgba(2,39,65,0.2)' }}
          >
            <div className="text-gray-500 group-hover:text-[#022741] transition-colors"><Icons.Badge /></div>
            <span className="text-xs font-bold text-gray-600 group-hover:text-[#022741]">ID Card</span>
          </button>
          
          <button
            onClick={() => downloadPDF(volunteer.volunteerId, "certificate")}
            className="flex items-center justify-center gap-2 py-2.5 px-2 rounded-lg transition-colors shadow-sm hover:shadow-md hover:brightness-105"
            style={{ backgroundColor: COLORS.yellow }}
          >
            <div style={{ color: COLORS.navy }}><Icons.Download /></div>
            <span className="text-xs font-bold" style={{ color: COLORS.navy }}>Certificate</span>
          </button>
        </div>

      </div>
    </div>
  )
}