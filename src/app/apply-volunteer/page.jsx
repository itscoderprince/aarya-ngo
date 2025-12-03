"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"

// --- Configuration ---
const THEME = {
  navy: "#022741",
  yellow: "#FFB70B",
  bg: "bg-gray-50",
}

// --- Icons Object ---
const Icons = {
  User: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Mail: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Phone: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
  Calendar: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Droplet: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>,
  Map: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Upload: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>,
  Check: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>,
  Tag: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>,
  ShieldCheck: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Refresh: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
}

// --- Reusable Input Component (Compacted) ---
const FormInput = ({ label, icon: IconComponent, ...props }) => (
  <div>
    <label className="block text-xs font-bold mb-1 uppercase tracking-wide opacity-90" style={{ color: THEME.navy }}>{label}</label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#022741] transition-colors">
        <IconComponent />
      </div>
      <input
        className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:bg-white transition-all placeholder-gray-400"
        style={{ '--tw-ring-color': THEME.navy }}
        {...props}
      />
    </div>
  </div>
)

// --- Main Component ---
export default function VolunteerForm({ isAdmin = false }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isFree, setIsFree] = useState(false)

  const [formData, setFormData] = useState({
    name: "", email: "", dob: "", bloodGroup: "", address: "", mobile: "", validity: "1year", referral: ""
  })
  const [profilePic, setProfilePic] = useState(null)
  const [profilePreview, setProfilePreview] = useState(null)

  const validityOptions = useMemo(() => [
    { value: "1year", label: "1 Year", price: 501 },
    { value: "3year", label: "3 Years", price: 1100 },
    { value: "lifetime", label: "Lifetime", price: 5100 },
  ], [])

  useEffect(() => {
    return () => {
      if (profilePreview) URL.revokeObjectURL(profilePreview)
    }
  }, [profilePreview])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === "dob") {
      if (new Date(value) > new Date()) return setError("Date of birth cannot be in the future")
      setError("")
    }
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleProfilePicChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfilePic(file)
      setProfilePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const selectedPlan = validityOptions.find(opt => opt.value === formData.validity)
      const finalAmount = isFree ? 0 : (selectedPlan?.price || 0)

      const submitFormData = new FormData()
      Object.keys(formData).forEach(key => {
        if (key === 'mobile') submitFormData.append('phone', formData[key])
        else submitFormData.append(key, formData[key])
      })

      submitFormData.append("amount", finalAmount)
      submitFormData.append("paymentType", "VOLUNTEER")
      if (profilePic) submitFormData.append("profilePic", profilePic)

      const response = await fetch("/api/create-payment", {
        method: "POST",
        body: submitFormData,
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Submission failed")

      // Handle standardized API response
      const paymentData = data.data || data;

      if (paymentData.redirectUrl) {
        window.location.href = paymentData.redirectUrl
      } else {
        setSuccess(true)
        setTimeout(() => router.push("/volunteers"), 2000)
      }

    } catch (err) {
      setError(err.message || "An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-sm rounded-xl shadow-2xl p-6 text-center border-t-4" style={{ borderColor: THEME.yellow }}>
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3 text-green-600">
            <Icons.Check />
          </div>
          <h1 className="text-xl font-bold mb-1" style={{ color: THEME.navy }}>Application Submitted!</h1>
          <p className="text-gray-500 text-sm">{isFree ? "Added successfully." : "Redirecting..."}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-6 px-4 bg-gray-50 font-sans flex items-center justify-center">

      {/* COMPACT CONTAINER (5XL) */}
      <div className="w-full max-w-5xl">

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border-t-4" style={{ borderColor: THEME.yellow }}>

          {/* Reduced padding from p-8 to p-6 */}
          <div className="p-6">

            {/* Header - Compact */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
              <div>
                <h1 className="text-2xl font-extrabold" style={{ color: THEME.navy }}>
                  {isAdmin ? "Add Volunteer (Admin)" : "Volunteer Application"}
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  {isAdmin ? "Create new entry." : "Join our mission. Fill details below."}
                </p>
              </div>
              {isAdmin && (
                <label className="flex items-center space-x-2 bg-blue-50 px-3 py-1.5 rounded-lg cursor-pointer border border-blue-100">
                  <input
                    type="checkbox"
                    checked={isFree}
                    onChange={(e) => setIsFree(e.target.checked)}
                    className="w-4 h-4 rounded text-[#022741] focus:ring-[#022741]"
                  />
                  <span className="text-xs font-bold text-[#022741]">Admin Override (Free)</span>
                </label>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded mb-6 text-sm">
                <span className="font-bold">Error:</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* INPUTS GRID - Compact Gap */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
                <FormInput label="Full Name *" name="name" value={formData.name} onChange={handleChange} required icon={Icons.User} />
                <FormInput label="Email Address *" type="email" name="email" value={formData.email} onChange={handleChange} required icon={Icons.Mail} />
                <FormInput label="Mobile Number *" type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required icon={Icons.Phone} />
                <FormInput label="Date of Birth *" type="date" name="dob" max={new Date().toISOString().split("T")[0]} value={formData.dob} onChange={handleChange} required icon={Icons.Calendar} />

                <div>
                  <label className="block text-xs font-bold mb-1 uppercase tracking-wide opacity-90" style={{ color: THEME.navy }}>Blood Group *</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#022741] transition-colors"><Icons.Droplet /></div>
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 appearance-none transition-all"
                      style={{ '--tw-ring-color': THEME.navy }}
                      required
                    >
                      <option value="">Select Group</option>
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                    </select>
                  </div>
                </div>

                <FormInput label="Referral Code" name="referral" placeholder="Optional" value={formData.referral} onChange={handleChange} icon={Icons.Tag} />

                {/* Address - Compact */}
                <div className="mb-5 grid col-span-2">
                  <label className="block text-xs font-bold mb-1 uppercase tracking-wide opacity-90" style={{ color: THEME.navy }}>Full Address *</label>
                  <div className="relative group">
                    <div className="absolute top-2.5 left-3 flex items-start pointer-events-none text-gray-400 group-focus-within:text-[#022741] transition-colors"><Icons.Map /></div>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={3}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 resize-none transition-all"
                      style={{ '--tw-ring-color': THEME.navy }}
                      required
                    />
                  </div>
                </div>

                {/* UPLOADS SECTION - Compact Height (h-24) */}
                <div className="mb-5">
                  <label className="block text-xs font-bold mb-1 uppercase tracking-wide opacity-90" style={{ color: THEME.navy }}>Profile Photo</label>
                  <label className={`
                  relative flex flex-row items-center w-full h-22 border-2 border-dashed rounded-xl cursor-pointer transition-all overflow-hidden group bg-white
                  ${profilePreview ? 'border-green-500' : 'border-gray-300 hover:bg-gray-50'}
                `}>

                    {/* Left Side: Preview or Icon */}
                    <div className="w-24 h-full flex-shrink-0 border-r border-gray-100 flex items-center justify-center bg-gray-50">
                      {profilePreview ? (
                        <div className="relative w-full h-full p-1.5">
                          <img src={profilePreview} alt="Preview" className="w-full h-full object-contain" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                            <Icons.Refresh />
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                          <div style={{ color: THEME.navy }}><Icons.Upload /></div>
                        </div>
                      )}
                    </div>

                    {/* Right Side: Instructions */}
                    <div className="flex-1 px-5 flex flex-col justify-center">
                      {profilePreview ? (
                        <div>
                          <p className="font-bold text-green-600 text-sm flex items-center gap-2"><Icons.Check /> Photo Selected</p>
                          <p className="text-xs text-gray-400 mt-0.5 truncate">{profilePic?.name}</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm text-gray-700 font-semibold">Click to upload photo</p>
                          <p className="text-xs text-gray-400 mt-0.5">JPG/PNG. Max 2MB.</p>
                          {isFree && (
                            <span className="inline-flex items-center mt-1 px-1.5 py-0.5 bg-blue-50 text-blue-800 text-[10px] font-bold rounded">
                              Admin Mode
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <input type="file" className="hidden" onChange={handleProfilePicChange} accept="image/*" />
                  </label>
                </div>
              </div>


              {/* MEMBERSHIP SECTION - Compact Padding */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
                <label className="block text-sm font-bold mb-3" style={{ color: THEME.navy }}>Select Membership Plan</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {validityOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`
                        relative flex flex-col items-center p-3 cursor-pointer rounded-lg border-2 transition-all duration-200 text-center bg-white
                        ${formData.validity === option.value ? "shadow-sm scale-[1.01]" : "hover:border-gray-300"}
                        ${isFree && formData.validity !== option.value ? "opacity-50" : "opacity-100"}
                      `}
                      style={{ borderColor: formData.validity === option.value ? THEME.navy : 'transparent' }}
                    >
                      <input
                        type="radio"
                        name="validity"
                        value={option.value}
                        checked={formData.validity === option.value}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">
                        {option.label.split(" - ")[0]}
                      </span>
                      <span className="text-xl font-black" style={{ color: THEME.navy }}>
                        {isFree ? <span className="text-green-600">FREE</span> : `₹${option.price.toLocaleString()}`}
                      </span>
                      {formData.validity === option.value && (
                        <div className="absolute top-2 right-2 text-xs" style={{ color: THEME.navy }}><Icons.Check /></div>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* BUTTONS - Compact Height */}
              <div className="flex flex-col md:flex-row gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 px-6 rounded-xl text-white font-bold text-base shadow-md hover:opacity-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: THEME.navy }}
                >
                  {loading ? "Processing..." : (
                    isFree
                      ? "Register (Free)"
                      : `Pay ₹${validityOptions.find(o => o.value === formData.validity)?.price || 0} & Submit`
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-none md:w-28 py-3 px-4 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  )
}