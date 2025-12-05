"use client"

import { useState } from "react"
import { MapPin, Phone, Mail, Clock, Send, User, MessageSquare } from "lucide-react"
import { toast } from "react-hot-toast"

export default function ReachUsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Message sent successfully! We'll get back to you soon.")
        setFormData({ name: "", email: "", message: "" })
      } else {
        toast.error(data.message || "Failed to send message.")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Color Constants
  const navyColor = '#022741'
  const yellowColor = '#FFB70B'

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">

      <div className="max-w-7xl mx-auto">

        {/* 1. SIMPLE HEADER */}
        <div className="mb-8 text-left border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-bold" style={{ color: navyColor }}>Contact Us</h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">
            We are here to help and answer any question you might have.
          </p>
        </div>

        {/* 2. MAIN GRID LAYOUT */}
        <div className="grid lg:grid-cols-3 gap-6 items-start">

          {/* LEFT COLUMN: CONTACT FORM (Spans 2 cols) */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md border-t-4 p-6 md:p-8" style={{ borderColor: yellowColor }}>
            <h2 className="text-xl font-bold mb-6" style={{ color: navyColor }}>Send a Message</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: navyColor }}>Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your Name"
                      required
                      className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:bg-white transition-all text-sm"
                      style={{ '--tw-ring-color': navyColor }}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: navyColor }}>Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                      className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:bg-white transition-all text-sm"
                      style={{ '--tw-ring-color': navyColor }}
                    />
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: navyColor }}>Message</label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none text-gray-400">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="8"
                    placeholder="Write your query here..."
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:bg-white transition-all resize-none text-sm"
                    style={{ '--tw-ring-color': navyColor }}
                  ></textarea>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 text-white px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{ backgroundColor: navyColor }}
                >
                  {loading ? "Sending..." : "Send Message"}
                  {!loading && <Send className="w-4 h-4" />}
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT COLUMN: COMPACT INFO + BIG MAP */}
          <div className="lg:col-span-1 flex flex-col gap-4 h-full">

            {/* 1. COMPACT CONTACT INFO (Small height) */}
            <div className="rounded-xl p-5 shadow-md text-white relative overflow-hidden shrink-0" style={{ backgroundColor: navyColor }}>
              {/* Decorative Circle */}
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-16 h-16 rounded-full bg-white opacity-5"></div>

              {/* 4. CONTACT INFO */}
              <div>
                <h3 className="font-bold text-lg mb-6 border-b-2 inline-block pb-1" style={{ borderColor: yellowColor }}>
                  Contact Us
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-3 text-sm text-gray-400">
                    <MapPin className="w-5 h-5 flex-shrink-0" style={{ color: yellowColor }} />
                    <span>
                      Saraswati Vidya Nivas, Karamtoli,<br />
                      Behind Dr S N Yadav, Morabadi,<br />
                      Ranchi, Jharkhand 834001
                    </span>
                  </div>

                  <div className="flex gap-3 text-sm text-gray-400 items-center">
                    <Phone className="w-4 h-4 flex-shrink-0" style={{ color: yellowColor }} />
                    <span>+91 62002 18724</span>
                  </div>

                  <div className="flex gap-3 text-sm text-gray-400 items-center">
                    <Mail className="w-4 h-4 flex-shrink-0" style={{ color: yellowColor }} />
                    <span>prayasbyaaryafoundation@gmail.com</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. BIG MAP (Fills remaining height) */}
            <div className="flex-1 bg-white rounded-xl shadow-md p-1 min-h-[400px] border border-gray-100 relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224345.8392912864!2d77.06889905049347!3d28.527582005823206!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce2b3e6921f47%3A0xdeb9d989c7f4f40!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1692739377772!5m2!1sen!2sin"
                className="absolute inset-0 w-full h-full rounded-lg"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}