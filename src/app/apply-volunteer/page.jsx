"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function ApplyVolunteer() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    bloodGroup: "",
    address: "",
    mobile: "",
    validity: "1year",
  })
  const [receipt, setReceipt] = useState(null)

  const validityOptions = [
    { value: "1year", label: "1 Year - ₹501", price: 501 },
    { value: "3year", label: "3 Years - ₹1,100", price: 1100 },
    { value: "lifetime", label: "Lifetime - ₹5,100", price: 5100 },
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e) => {
    setReceipt(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (!receipt) {
        setError("Please upload payment receipt")
        setLoading(false)
        return
      }

      const submitFormData = new FormData()
      submitFormData.append("name", formData.name)
      submitFormData.append("dob", formData.dob)
      submitFormData.append("bloodGroup", formData.bloodGroup)
      submitFormData.append("address", formData.address)
      submitFormData.append("mobile", formData.mobile)
      submitFormData.append("validity", formData.validity)
      submitFormData.append("receipt", receipt)

      const response = await fetch("/api/volunteers", {
        method: "POST",
        body: submitFormData,
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to submit application")
        setLoading(false)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push("/volunteers")
      }, 2000)
    } catch (err) {
      setError("An error occurred. Please try again.")
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md text-center">
          <div className="text-5xl mb-4">✓</div>
          <h1 className="text-3xl font-bold text-green-600 mb-4">Application Submitted!</h1>
          <p className="text-gray-600 mb-4">
            Thank you for applying to be a volunteer. Your application has been received and is pending admin approval.
          </p>
          <p className="text-sm text-gray-500">Redirecting you to volunteers page...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Apply to be a Volunteer</h1>
          <p className="text-gray-600 mb-6">Fill in the form below to submit your volunteer application.</p>

          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
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
                {validityOptions.map((option) => (
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

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Note:</span> Your application will be reviewed by our admin team and
                approved based on verification of your details and payment.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 font-medium"
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg hover:bg-gray-400 font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
