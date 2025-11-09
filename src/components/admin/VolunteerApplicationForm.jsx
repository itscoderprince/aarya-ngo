"use client"

import { useState } from "react"

export default function VolunteerApplicationForm({ volunteer, onSubmit, onCancel, isAdminCreate = false }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: volunteer?.name || "",
    dob: volunteer?.dob ? new Date(volunteer.dob).toISOString().split("T")[0] : "",
    bloodGroup: volunteer?.bloodGroup || "",
    address: volunteer?.address || "",
    mobile: volunteer?.mobile || "",
    validity: volunteer?.validity || "1year",
    status: volunteer?.status || (isAdminCreate ? "approved" : "pending"),
    notes: volunteer?.notes || "",
    isPublished: volunteer?.isPublished || false,
  })
  const [receipt, setReceipt] = useState(null)
  const [profilePic, setProfilePic] = useState(null)
  const [currentProfilePic, setCurrentProfilePic] = useState(volunteer?.profilePicUrl || null)
  // END CHANGE

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleFileChange = (e) => {
    setReceipt(e.target.files[0])
  }

  const handleProfilePicChange = (e) => {
    setProfilePic(e.target.files[0])
  }
  // END CHANGE

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const submitFormData = new FormData()
      submitFormData.append("name", formData.name)
      submitFormData.append("dob", formData.dob)
      submitFormData.append("bloodGroup", formData.bloodGroup)
      submitFormData.append("address", formData.address)
      submitFormData.append("mobile", formData.mobile)
      submitFormData.append("validity", formData.validity)

      if (profilePic) {
        submitFormData.append("profilePic", profilePic)
      }
      // END CHANGE

      if (!isAdminCreate) {
        if (!receipt) {
          setError("Receipt is required")
          setLoading(false)
          return
        }
        submitFormData.append("receipt", receipt)
      }

      if (isAdminCreate) {
        submitFormData.append("isAdminCreate", "true")
        submitFormData.append("status", formData.status)
        submitFormData.append("notes", formData.notes)
        submitFormData.append("isPublished", formData.isPublished)
      }

      await onSubmit(submitFormData)
      setLoading(false)
    } catch (err) {
      console.log("[v0] Form submit error:", err)
      setError("An error occurred. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {isAdminCreate ? "Create New Volunteer" : "Volunteer Application"}
      </h2>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
          {currentProfilePic && (
            <div className="mb-3">
              <img
                src={currentProfilePic || "/placeholder.svg"}
                alt="Current profile"
                className="w-32 h-32 object-cover rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-2">Current profile picture</p>
            </div>
          )}
          <input
            type="file"
            onChange={handleProfilePicChange}
            accept="image/*"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          <p className="text-xs text-gray-500 mt-1">Upload your profile picture (JPG or PNG)</p>
        </div>
        {/* END CHANGE */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group *</label>
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            >
              <option value="">Select Blood Group</option>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number *</label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            rows="3"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Membership Validity *</label>
          <div className="space-y-2">
            {[
              { value: "1year", label: "1 Year - ₹501" },
              { value: "3year", label: "3 Years - ₹1,100" },
              { value: "lifetime", label: "Lifetime - ₹5,100" },
            ].map((option) => (
              <label
                key={option.value}
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer"
              >
                <input
                  type="radio"
                  name="validity"
                  value={option.value}
                  checked={formData.validity === option.value}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span className="ml-3 text-gray-700 font-medium">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {!isAdminCreate && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Receipt (Image/PDF) *</label>
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*,.pdf"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Upload proof of payment (JPG, PNG, or PDF)</p>
          </div>
        )}

        {isAdminCreate && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="flex items-end">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isPublished"
                    checked={formData.isPublished}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Publish to Public List</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                rows="3"
              />
            </div>
          </>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 font-medium"
          >
            {loading ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg hover:bg-gray-400 font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
