"use client"

import { X } from "lucide-react"

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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600/90 to-blue-700/90 backdrop-blur-md text-white p-5 flex justify-between items-center border-b border-white/20">
          <div className="flex items-center gap-3">
            {volunteer.profilePicUrl && (
              <img
                src={volunteer.profilePicUrl || "/placeholder.svg"}
                alt={volunteer.name}
                className="w-12 h-12 object-cover rounded-full border-2 border-white/50"
              />
            )}
            <div>
              <h2 className="text-xl font-bold">{volunteer.name}</h2>
              <p className="text-blue-100 text-sm">{volunteer.mobile}</p>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-blue-800/50 p-2 rounded-lg transition backdrop-blur-sm">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Status & Health Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 backdrop-blur-sm p-4 rounded-xl border border-blue-200/50">
              <p className="text-xs font-semibold text-blue-600 mb-1">Status</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                  volunteer.status === "pending"
                    ? "bg-yellow-400/80 text-yellow-900"
                    : volunteer.status === "approved"
                      ? "bg-green-400/80 text-green-900"
                      : "bg-red-400/80 text-red-900"
                }`}
              >
                {volunteer.status.charAt(0).toUpperCase() + volunteer.status.slice(1)}
              </span>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100/50 backdrop-blur-sm p-4 rounded-xl border border-red-200/50">
              <p className="text-xs font-semibold text-red-600 mb-1">Blood Group</p>
              <p className="text-lg font-bold text-red-900">{volunteer.bloodGroup}</p>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 backdrop-blur-sm p-4 rounded-xl border border-slate-200/50">
            <h4 className="text-sm font-bold text-slate-700 mb-3">Personal Information</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-slate-600 text-xs mb-1">Date of Birth</p>
                <p className="font-semibold text-slate-900">{formatDate(volunteer.dob)}</p>
              </div>
              <div>
                <p className="text-slate-600 text-xs mb-1">Phone</p>
                <p className="font-semibold text-slate-900">{volunteer.mobile}</p>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 backdrop-blur-sm p-4 rounded-xl border border-slate-200/50">
            <p className="text-xs font-bold text-slate-700 mb-2">Address</p>
            <p className="text-sm text-slate-900 leading-relaxed">{volunteer.address}</p>
          </div>

          {/* Membership Details */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 backdrop-blur-sm p-3 rounded-lg border border-purple-200/50">
              <p className="text-xs font-semibold text-purple-600 mb-1">Validity</p>
              <p className="font-bold text-purple-900 text-sm">
                {volunteer.validity === "1year" ? "1 Yr" : volunteer.validity === "3year" ? "3 Yr" : "Lifetime"}
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100/50 backdrop-blur-sm p-3 rounded-lg border border-green-200/50">
              <p className="text-xs font-semibold text-green-600 mb-1">Amount</p>
              <p className="font-bold text-green-900 text-sm">₹{volunteer.amount}</p>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 backdrop-blur-sm p-3 rounded-lg border border-indigo-200/50">
              <p className="text-xs font-semibold text-indigo-600 mb-1">Published</p>
              <p className="font-bold text-indigo-900 text-sm">{volunteer.isPublished ? "Yes" : "No"}</p>
            </div>
          </div>

          {/* Notes */}
          {volunteer.notes && (
            <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 backdrop-blur-sm p-4 rounded-xl border border-amber-200/50">
              <p className="text-xs font-bold text-amber-700 mb-2">Notes</p>
              <p className="text-sm text-amber-900">{volunteer.notes}</p>
            </div>
          )}

          {/* Documents */}
          {volunteer.paymentReceiptUrl && (
            <div className="bg-gradient-to-br from-cyan-50 to-cyan-100/50 backdrop-blur-sm p-4 rounded-xl border border-cyan-200/50">
              <p className="text-xs font-bold text-cyan-700 mb-2">Payment Receipt</p>
              <a
                href={volunteer.paymentReceiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-cyan-600 hover:text-cyan-700 font-semibold hover:underline break-all"
              >
                View Document →
              </a>
            </div>
          )}

          {/* Timeline */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 backdrop-blur-sm p-4 rounded-xl border border-gray-200/50 text-xs">
            <p className="font-bold text-gray-700 mb-2">Timeline</p>
            <div className="space-y-1 text-gray-600">
              <p>
                Applied: <span className="font-semibold text-gray-800">{formatDate(volunteer.createdAt)}</span>
              </p>
              {volunteer.approvalDate && (
                <p>
                  Approved: <span className="font-semibold text-gray-800">{formatDate(volunteer.approvalDate)}</span>
                </p>
              )}
              {volunteer.approvedBy && (
                <p>
                  By: <span className="font-semibold text-gray-800">{volunteer.approvedBy}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white/50 backdrop-blur-md border-t border-white/20 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition backdrop-blur-sm text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
