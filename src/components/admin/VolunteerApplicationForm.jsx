"use client"

import { useState, useEffect, useMemo } from "react"
import {
  User, Mail, Phone, Calendar, Droplet, MapPin, Upload, RefreshCcw, Check, Tag, Loader2
} from "lucide-react"

// --- Configuration ---
const THEME = {
  navy: "#022741",
  yellow: "#FFB70B",
  bg: "bg-gray-50",
}

// --- Reusable Input Component (Compacted) ---
const FormInput = ({ label, icon: IconComponent, ...props }) => (
  <div>
    <label className="block text-xs font-bold mb-1 uppercase tracking-wide opacity-90" style={{ color: THEME.navy }}>{label}</label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#022741] transition-colors">
        <IconComponent className="w-4 h-4" />
      </div>
      <input
        className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:bg-white transition-all placeholder-gray-400"
        style={{ '--tw-ring-color': THEME.navy }}
        {...props}
      />
    </div>
  </div>
)

export default function VolunteerApplicationForm({ volunteer, onSubmit, onCancel, isAdminCreate = false }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Admin Override State
  const [isFree, setIsFree] = useState(false)

  const [formData, setFormData] = useState({
    name: volunteer?.name || "",
    email: volunteer?.email || "",
    dob: volunteer?.dob ? new Date(volunteer.dob).toISOString().split("T")[0] : "",
    bloodGroup: volunteer?.bloodGroup || "",
    address: volunteer?.address || "",
    mobile: volunteer?.mobile || "",
    validity: volunteer?.validity || "1year",
    referral: volunteer?.referral || "",
    status: volunteer?.status || "pending"
  })

  const [profilePic, setProfilePic] = useState(null)
  const [profilePreview, setProfilePreview] = useState(volunteer?.profilePicUrl || null)

  const validityOptions = useMemo(() => [
    { value: "1year", label: "1 Year", price: 501 },
    { value: "3year", label: "3 Years", price: 1100 },
    { value: "lifetime", label: "Lifetime", price: 5100 },
  ], [])

  useEffect(() => {
    return () => {
      if (profilePreview && profilePreview !== volunteer?.profilePicUrl) {
        URL.revokeObjectURL(profilePreview)
      }
    }
  }, [profilePreview, volunteer])

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
        if (key === 'referral') submitFormData.append('referralCode', formData[key])
        else submitFormData.append(key, formData[key])
      })

      // Admin specific fields
      submitFormData.append("amount", finalAmount)
      submitFormData.append("isAdminCreate", "true")
      submitFormData.append("isFree", isFree.toString())

      // If editing, handle status if needed, though typically status is handled separately
      if (formData.status) submitFormData.append("status", formData.status)

      if (profilePic) submitFormData.append("profilePic", profilePic)

      await onSubmit(submitFormData)
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="animate-in fade-in duration-300">

      {/* Header Controls (Admin Override) */}
      {isAdminCreate && (
        <div className="flex justify-end mb-6">
          <label className="flex items-center space-x-2 bg-blue-50 px-3 py-1.5 rounded-lg cursor-pointer border border-blue-100 hover:bg-blue-100 transition">
            <input
              type="checkbox"
              checked={isFree}
              onChange={(e) => setIsFree(e.target.checked)}
              className="w-4 h-4 rounded text-[#022741] focus:ring-[#022741]"
            />
            <span className="text-xs font-bold text-[#022741]">Admin Override (Free Membership)</span>
          </label>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded mb-6 text-sm flex items-center gap-2">
          <span className="font-bold">Error:</span> {error}
        </div>
      )}

      {/* INPUTS GRID - Compact Gap */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
        <FormInput label="Full Name *" name="name" value={formData.name} onChange={handleChange} required icon={User} />
        <FormInput label="Email Address *" type="email" name="email" value={formData.email} onChange={handleChange} required icon={Mail} />
        <FormInput label="Mobile Number *" type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required icon={Phone} />
        <FormInput label="Date of Birth *" type="date" name="dob" max={new Date().toISOString().split("T")[0]} value={formData.dob} onChange={handleChange} required icon={Calendar} />

        <div>
          <label className="block text-xs font-bold mb-1 uppercase tracking-wide opacity-90" style={{ color: THEME.navy }}>Blood Group *</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#022741] transition-colors"><Droplet className="w-4 h-4" /></div>
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

        <FormInput label="Referral Code" name="referral" placeholder="Optional" value={formData.referral} onChange={handleChange} icon={Tag} />

        {/* Address - Compact */}
        <div className="mb-5 grid col-span-2">
          <label className="block text-xs font-bold mb-1 uppercase tracking-wide opacity-90" style={{ color: THEME.navy }}>Full Address *</label>
          <div className="relative group">
            <div className="absolute top-2.5 left-3 flex items-start pointer-events-none text-gray-400 group-focus-within:text-[#022741] transition-colors"><MapPin className="w-4 h-4" /></div>
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
            <div className="w-24 h-full flex-shrink-0 border-r border-gray-100 flex items-center justify-center bg-gray-50 p-2">
              {profilePreview ? (
                <div className="relative w-full h-full">
                  <img src={profilePreview} alt="Preview" className="w-full h-full object-contain" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white rounded">
                    <RefreshCcw className="w-5 h-5" />
                  </div>
                </div>
              ) : (
                <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                  <div style={{ color: THEME.navy }}><Upload className="w-6 h-6" /></div>
                </div>
              )}
            </div>

            {/* Right Side: Instructions */}
            <div className="flex-1 px-4 py-2 flex flex-col justify-center">
              {profilePreview ? (
                <div>
                  <p className="font-bold text-green-600 text-sm flex items-center gap-2"><Check className="w-4 h-4" /> Photo Selected</p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{profilePic?.name || "Existing Image"}</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-700 font-semibold">Click to upload photo</p>
                  <p className="text-xs text-gray-400 mt-0.5">JPG/PNG. Max 2MB.</p>
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
                <div className="absolute top-2 right-2 text-xs" style={{ color: THEME.navy }}><Check className="w-4 h-4" /></div>
              )}
            </label>
          ))}
        </div>
      </div>

      {/* BUTTONS - Compact Height */}
      <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          className="flex-none md:w-28 py-2.5 px-4 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-2.5 px-6 rounded-xl text-white font-bold text-base shadow-md hover:opacity-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{ backgroundColor: THEME.navy }}
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? "Saving..." : (
            isFree
              ? "Register (Free)"
              : `Save Volunteer`
          )}
        </button>
      </div>
    </form>
  )
}
