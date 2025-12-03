"use client"

import { X, User, Phone, Calendar, MapPin, FileText, CreditCard, Clock, CheckCircle, AlertCircle, Shield, Mail, Droplet } from "lucide-react"

export default function VolunteerDetailModal({ volunteer, onClose }) {
  if (!volunteer) return null

  const formatDate = (date) => {
    if (!date) return "N/A"
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        style={{ maxHeight: '90vh' }}
      >

        {/* Header - Compact */}
        <div className="bg-[#022741] text-white px-6 py-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
              <User className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">Volunteer Profile</h2>
              <p className="text-blue-200 text-xs opacity-80">ID: {volunteer.volunteerId || "N/A"}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors backdrop-blur-sm"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content - Grid Layout */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">

            {/* Left Column: Profile & Key Info (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              {/* Profile Card */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-gray-100 border-4 border-white shadow-md overflow-hidden mb-3">
                  {volunteer.profilePicUrl ? (
                    <img src={volunteer.profilePicUrl} alt={volunteer.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50"><User size={32} /></div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{volunteer.name}</h3>
                <div className="flex gap-2 mb-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${volunteer.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' :
                      volunteer.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                    {volunteer.status.toUpperCase()}
                  </span>
                </div>

                <div className="w-full space-y-3 text-left">
                  <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                    <Mail className="w-4 h-4 text-blue-500" />
                    <span className="truncate">{volunteer.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                    <Phone className="w-4 h-4 text-green-500" />
                    <span>{volunteer.mobile}</span>
                  </div>
                </div>
              </div>

              {/* Membership Status */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#022741]" /> Membership
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 p-2 rounded-lg text-center">
                    <p className="text-[10px] text-blue-600 font-bold uppercase">Plan</p>
                    <p className="text-sm font-bold text-blue-900">{volunteer.validity === 'free' ? 'Free' : volunteer.validity}</p>
                  </div>
                  <div className="bg-green-50 p-2 rounded-lg text-center">
                    <p className="text-[10px] text-green-600 font-bold uppercase">Paid</p>
                    <p className="text-sm font-bold text-green-900">₹{volunteer.amount}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Details (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              {/* Personal & Address */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <h4 className="text-sm font-bold text-gray-900 mb-4 border-b pb-2">Personal Details</h4>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Date of Birth</p>
                    <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" /> {formatDate(volunteer.dob)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Blood Group</p>
                    <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      <Droplet className="w-3.5 h-3.5 text-red-500" /> {volunteer.bloodGroup}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500 mb-1">Address</p>
                    <p className="text-sm text-gray-700 flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" /> {volunteer.address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Notes & Timeline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 h-full">
                  <h4 className="text-xs font-bold text-amber-800 mb-2 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" /> Notes
                  </h4>
                  <p className="text-sm text-amber-900 leading-relaxed">
                    {volunteer.notes || "No notes available for this volunteer."}
                  </p>
                </div>

                <div className="bg-gray-100 p-4 rounded-xl border border-gray-200 h-full">
                  <h4 className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Timeline
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Applied</span>
                      <span className="font-medium text-gray-900">{formatDate(volunteer.createdAt)}</span>
                    </div>
                    {volunteer.approvalDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Approved</span>
                        <span className="font-medium text-green-700">{formatDate(volunteer.approvalDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Documents Link */}
              {volunteer.paymentReceiptUrl && (
                <div className="bg-cyan-50 p-3 rounded-lg border border-cyan-100 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-cyan-800">
                    <CreditCard className="w-4 h-4" />
                    <span className="text-sm font-medium">Payment Receipt Available</span>
                  </div>
                  <a
                    href={volunteer.paymentReceiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-cyan-100 hover:bg-cyan-200 text-cyan-800 px-3 py-1.5 rounded-md transition font-bold"
                  >
                    View Receipt
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-white shrink-0 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-lg transition text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
