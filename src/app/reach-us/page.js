"use client"

import { useState } from "react"
import Navbar from "../../components/Shared/Navbar"
import Footer from "../../components/Shared/Footer"


export default function ReachUsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    alert("Thank you for contacting us! We will get back to you soon.")
    setFormData({ name: "", email: "", message: "" })
  }

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="bg-[rgb(1,23,40)] text-white text-center py-16 px-6 lg:px-20">
        <h1 className="text-4xl font-bold mb-4">Reach Us</h1>
        <p className="max-w-2xl mx-auto text-lg">
          Have questions or want to get involved? We’d love to hear from you.
        </p>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 px-6 lg:px-20 bg-gray-50">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-[rgb(1,23,40)] mb-6">Contact Us</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(255,183,11)]"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(255,183,11)]"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(255,183,11)]"
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-[rgb(1,23,40)] text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="bg-white p-8 rounded-xl shadow">
            {/* <h2 className="text-2xl font-bold text-[rgb(1,23,40)] mb-6">Our Office</h2> */}
            {/* <p className="text-gray-700 mb-4">
              Prayas by Aarya Foundation <br />
              123 NGO Street, New Delhi, India
            </p> */}
            <p className="text-gray-700 mb-2">
              <strong>Phone:</strong> +91 98765 43210
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Email:</strong> contact@prayasfoundation.org
            </p>
            <p className="text-gray-700 mb-6">
              <strong>Hours:</strong> Mon - Fri (9:00 AM – 6:00 PM)
            </p>

            {/* Google Map Embed */}
            <div className="w-full h-64">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224345.8392912864!2d77.06889905049347!3d28.527582005823206!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce2b3e6921f47%3A0xdeb9d989c7f4f40!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1692739377772!5m2!1sen!2sin"
                width="100%"
                height="100%"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
