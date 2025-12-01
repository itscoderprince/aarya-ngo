"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

// Icons Component - Using the Navy Blue Color directly in SVG
const Icons = {
  User: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Mail: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Phone: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
  Calendar: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Droplet: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>,
  Map: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Upload: () => <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>,
  Check: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>,
  Tag: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>,
  ShieldCheck: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
}

// Pass isAdmin={true} when using this on the admin dashboard
export default function VolunteerForm({ isAdmin = false }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // Admin only state for free entry
  const [isFree, setIsFree] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dob: "",
    bloodGroup: "",
    address: "",
    mobile: "",
    validity: "1year",
    referral: "", // Added referral field
  })
  const [receipt, setReceipt] = useState(null)
  const [profilePic, setProfilePic] = useState(null)

  const validityOptions = [
    { value: "1year", label: "1 Year", price: 501 },
    { value: "3year", label: "3 Years", price: 1100 },
    { value: "lifetime", label: "Lifetime", price: 5100 },
  ]

  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0]
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === "dob") {
      const selectedDate = new Date(value)
      const today = new Date()
      if (selectedDate > today) {
        setError("Date of birth cannot be in the future")
        return
      }
      setError("")
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e) => {
    setReceipt(e.target.files[0])
  }

  const handleProfilePicChange = (e) => {
    setProfilePic(e.target.files[0])
  }

  // Calculate final amount
  const selectedPlan = validityOptions.find(opt => opt.value === formData.validity)
  const finalAmount = isFree ? 0 : (selectedPlan?.price || 0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Validation: If NOT free (Standard User), receipt is mandatory
      if (!isFree && !receipt) {
        setError("Please upload payment receipt")
        setLoading(false)
        return
      }
      const submitFormData = new FormData()

      // Standard Fields
      submitFormData.append("name", formData.name)
      submitFormData.append("email", formData.email)
      submitFormData.append("phone", formData.mobile) // Mapped to 'phone' as per your API snippet
      submitFormData.append("dob", formData.dob)
      submitFormData.append("bloodGroup", formData.bloodGroup)
      submitFormData.append("address", formData.address)
      submitFormData.append("referral", formData.referral) // Send referral

      // Payment Logic Fields
      submitFormData.append("amount", finalAmount)
      submitFormData.append("paymentType", "VOLUNTEER")
      submitFormData.append("validity", formData.validity)

      // Files
      if (receipt) submitFormData.append("receipt", receipt)
      if (profilePic) submitFormData.append("profilePic", profilePic)

      // Determine Endpoint (You might want a different one for admin, but using one for now)
      const endpoint = "/api/create-payment" // Or your specific volunteer endpoint

      const response = await fetch(endpoint, {
        method: "POST",
        body: submitFormData,
        // Note: Do NOT set Content-Type header when using FormData, browser sets it automatically with boundary
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to submit application")
        setLoading(false)
        return
      }

      // Check if it's a paid flow (redirectUrl exists) or free flow
      if (data.redirectUrl) {
        // Redirect to PhonePe
        window.location.href = data.redirectUrl
      } else {
        // Free Flow - Show success message
        setSuccess(true)
        setTimeout(() => {
          router.push("/volunteers")
        }, 2000)
      }

    } catch (err) {
      console.log("[v0] Error:", err)
      setError("An error occurred. Please try again.")
      setLoading(false)
    }
  }

  // Style variables
  const navyColor = 'rgb(2, 39, 65)'
  const yellowColor = 'rgb(255, 183, 11)'

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-8 text-center border-t-4" style={{ borderColor: yellowColor }}>
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
            <Icons.Check />
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: navyColor }}>Application Submitted!</h1>
          <p className="text-gray-600 mb-6">
            {isFree ? "Volunteer added successfully by Admin." : "Thank you! Your application is pending admin approval."}
          </p>
          <p className="text-sm text-gray-400">Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border-t-4" style={{ borderColor: yellowColor }}>

          <div className="p-6 sm:p-10">
            <h1 className="text-3xl font-extrabold mb-2" style={{ color: navyColor }}>
              {isAdmin ? "Add Volunteer (Admin)" : "Apply to be a Volunteer"}
            </h1>
            <p className="text-gray-600 mb-8 text-lg">
              {isAdmin ? "Create a new volunteer entry manually." : "Join our mission. Please fill in the details below."}
            </p>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-8">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* INPUTS SECTION */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">

                {/* Name */}
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: navyColor }}>Full Name *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" style={{ color: navyColor }}>
                      <Icons.User />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:bg-white transition-all"
                      style={{ '--tw-ring-color': navyColor }}
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: navyColor }}>Email Address *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" style={{ color: navyColor }}>
                      <Icons.Mail />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:bg-white transition-all"
                      style={{ '--tw-ring-color': navyColor }}
                      required
                    />
                  </div>
                </div>

                {/* Mobile */}
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: navyColor }}>Mobile Number *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" style={{ color: navyColor }}>
                      <Icons.Phone />
                    </div>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:bg-white transition-all"
                      style={{ '--tw-ring-color': navyColor }}
                      required
                    />
                  </div>
                </div>

                {/* DOB */}
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: navyColor }}>Date of Birth *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" style={{ color: navyColor }}>
                      <Icons.Calendar />
                    </div>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      max={getTodayDate()}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:bg-white transition-all"
                      style={{ '--tw-ring-color': navyColor }}
                      required
                    />
                  </div>
                </div>

                {/* Blood Group */}
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: navyColor }}>Blood Group *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" style={{ color: navyColor }}>
                      <Icons.Droplet />
                    </div>
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:bg-white transition-all appearance-none"
                      style={{ '--tw-ring-color': navyColor }}
                      required
                    >
                      <option value="">Select Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>

                {/* Referral Code - NEW FIELD */}
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: navyColor }}>Referral Code (Optional)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" style={{ color: navyColor }}>
                      <Icons.Tag />
                    </div>
                    <input
                      type="text"
                      name="referral"
                      value={formData.referral}
                      onChange={handleChange}
                      placeholder="Enter code"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:bg-white transition-all"
                      style={{ '--tw-ring-color': navyColor }}
                    />
                  </div>
                </div>

              </div>

              {/* Full Width Address */}
              <div className="mb-6">
                <label className="block text-sm font-bold mb-2" style={{ color: navyColor }}>Full Address *</label>
                <div className="relative">
                  <div className="absolute top-3 left-3 flex items-start pointer-events-none" style={{ color: navyColor }}>
                    <Icons.Map />
                  </div>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="2"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:bg-white transition-all resize-none"
                    style={{ '--tw-ring-color': navyColor }}
                    required
                  />
                </div>
              </div>

              {/* MEMBERSHIP SECTION */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-lg font-bold" style={{ color: navyColor }}>Select Membership Plan</label>

                  {/* ADMIN ONLY: Free Tick Button */}
                  {isAdmin && (
                    <label className="flex items-center space-x-2 cursor-pointer bg-white px-3 py-1 rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={isFree}
                        onChange={(e) => setIsFree(e.target.checked)}
                        className="w-5 h-5 rounded text-blue-900 focus:ring-blue-900"
                        style={{ accentColor: navyColor }}
                      />
                      <span className="text-sm font-bold" style={{ color: navyColor }}>Mark as Paid/Free (Admin)</span>
                    </label>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {validityOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`
                        relative flex flex-col items-center p-4 cursor-pointer rounded-xl border-2 transition-all duration-200 text-center bg-white
                        ${formData.validity === option.value ? "shadow-md" : "hover:border-gray-300"}
                      `}
                      style={{
                        borderColor: formData.validity === option.value ? navyColor : 'transparent',
                        opacity: isFree && formData.validity !== option.value ? 0.5 : 1
                      }}
                    >
                      <input
                        type="radio"
                        name="validity"
                        value={option.value}
                        checked={formData.validity === option.value}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        {option.label.split(" - ")[0]}
                      </span>
                      <span className="text-2xl font-bold mt-1" style={{ color: navyColor }}>
                        {isFree ? <span className="text-green-600">FREE</span> : `₹${option.price.toLocaleString()}`}
                      </span>
                      {formData.validity === option.value && (
                        <div className="absolute top-2 right-2" style={{ color: navyColor }}>
                          <Icons.Check />
                        </div>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* UPLOADS SECTION */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

                {/* Profile Pic Upload */}
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: navyColor }}>Profile Photo</label>
                  <label className={`
                      flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors
                      ${profilePic ? 'bg-green-50 border-green-400' : 'bg-gray-50 border-gray-300 hover:bg-gray-100'}
                    `}>
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {profilePic ? (
                        <div className="text-center p-2">
                          <p className="text-sm text-green-700 font-bold">✓ Photo Selected</p>
                          <p className="text-xs text-gray-500 mt-1 truncate max-w-[200px]">{profilePic.name}</p>
                        </div>
                      ) : (
                        <>
                          <div style={{ color: navyColor }}><Icons.Upload /></div>
                          <p className="text-sm text-gray-500"><span className="font-semibold">Click to upload</span> photo</p>
                        </>
                      )}
                    </div>
                    <input type="file" className="hidden" onChange={handleProfilePicChange} accept="image/*" />
                  </label>
                </div>

                {/* Receipt Upload - HIDDEN IF FREE/ADMIN-VERIFIED */}
                {!isFree && (
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: navyColor }}>Payment Receipt *</label>
                    <label className={`
                        flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors
                        ${receipt ? 'bg-green-50 border-green-400' : 'bg-gray-50 border-gray-300 hover:bg-gray-100'}
                        `}>
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {receipt ? (
                          <div className="text-center p-2">
                            <p className="text-sm text-green-700 font-bold">✓ Receipt Uploaded</p>
                            <p className="text-xs text-gray-500 mt-1 truncate max-w-[200px]">{receipt.name}</p>
                          </div>
                        ) : (
                          <>
                            <div style={{ color: navyColor }}><Icons.Upload /></div>
                            <p className="text-sm text-gray-500"><span className="font-semibold">Click to upload</span> proof</p>
                          </>
                        )}
                      </div>
                      <input type="file" className="hidden" onChange={handleFileChange} accept="image/*,.pdf" required={!isFree} />
                    </label>
                  </div>
                )}

                {/* Information Box if Free */}
                {isFree && (
                  <div className="flex items-center justify-center p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="text-center">
                      <div className="text-blue-900 mb-2 flex justify-center"><Icons.ShieldCheck /></div>
                      <p className="text-sm text-blue-900 font-semibold">Admin Verification Active</p>
                      <p className="text-xs text-blue-700">Receipt upload is skipped.</p>
                    </div>
                  </div>
                )}

              </div>

              {/* BUTTONS */}
              <div className="flex flex-col md:flex-row gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-4 px-6 rounded-xl text-white font-bold text-lg shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: navyColor }}
                >
                  {loading ? "Processing..." : (
                    isFree
                      ? `Register Volunteer (Free/Paid)`
                      : `Pay ₹${selectedPlan?.price || 0} & Submit Application`
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-none md:w-32 py-4 px-6 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
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