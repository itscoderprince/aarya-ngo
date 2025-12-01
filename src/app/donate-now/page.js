"use client";

import { useState } from "react";
import {
  Heart,
  User,
  Mail,
  Phone,
  CreditCard,
  ShieldCheck,
  IndianRupee,
  Loader2,
  FileText
} from "lucide-react";

export default function DonateNowPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    pan: "",
    amount: 500,
    customAmount: "",
  });

  const [selectedAmount, setSelectedAmount] = useState(500);
  const [isCustom, setIsCustom] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const predefinedAmounts = [500, 1000, 2100, 5000, 11000];

  // -------------------------
  // HANDLE INPUTS
  // -------------------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "pan" ? value.toUpperCase() : value,
    }));
  };

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setIsCustom(false);
    setFormData((prev) => ({
      ...prev,
      amount,
      customAmount: "",
    }));
  };

  const handleCustomAmount = (value) => {
    if (Number(value) < 0) return;
    setIsCustom(true);
    setSelectedAmount(null);
    setFormData((prev) => ({
      ...prev,
      customAmount: value,
      amount: Number(value) || 0,
    }));
  };

  // -------------------------
  // SUBMIT PAYMENT
  // -------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData);

    const finalAmount = isCustom ? Number(formData.customAmount) : selectedAmount;

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      alert("Please fill all required details.");
      return;
    }

    if (!finalAmount || finalAmount < 10) {
      alert("Minimum donation is ₹10");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          pan: formData.pan,
          amount: finalAmount,
          paymentType: "donation",
        }),
      });

      const data = await res.json();

      console.log(data);

      if (data.success && data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        alert(data.message || "Unable to initiate payment.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert("Something went wrong. Try again.");
    }

    setIsLoading(false);
  };

  // Colors
  const navyColor = '#022741';
  const yellowColor = '#FFB70B';

  return (
    <div className="min-h-screen bg-gray-50 py-5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">

        {/* 1. COMPACT HEADER */}
        <div className="mb-6 border-b border-gray-200 pb-3">
          <h1 className="text-3xl font-bold flex items-center gap-3" style={{ color: navyColor }}>
            <Heart className="w-8 h-8 text-red-500 fill-current" />
            Make a Donation
          </h1>
          <p className="text-gray-500 mt-2 text-sm sm:text-base max-w-2xl">
            Your generous contribution supports our mission and brings hope to those in need.
          </p>
        </div>

        {/* 2. MAIN FORM CARD */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">

          {/* FIX: Solid Top Border Div (No clipping issues) */}
          <div className="w-full h-2" style={{ backgroundColor: yellowColor }}></div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">

            {/* SECTION 1: PERSONAL DETAILS */}
            <div>
              {/* <h2 className="text-xl font-bold mb-5 flex items-center gap-2" style={{ color: navyColor }}>
                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-800">
                  <User className="w-5 h-5" />
                </div>
                Your Details
              </h2> */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <User className="w-5 h-5" />
                    </div>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="John Doe"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-[#022741] focus:ring-1 focus:ring-[#022741] outline-none transition-all text-base"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Phone className="w-5 h-5" />
                    </div>
                    <input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-[#022741] focus:ring-1 focus:ring-[#022741] outline-none transition-all text-base"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-[#022741] focus:ring-1 focus:ring-[#022741] outline-none transition-all text-base"
                    />
                  </div>
                </div>

                {/* PAN Card */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">PAN (Optional)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FileText className="w-5 h-5" />
                    </div>
                    <input
                      name="pan"
                      value={formData.pan}
                      onChange={handleInputChange}
                      maxLength={10}
                      placeholder="ABCDE1234F"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-[#022741] focus:ring-1 focus:ring-[#022741] outline-none transition-all text-base uppercase placeholder:normal-case"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1 ml-1">For 80G Tax Exemption.</p>
                </div>
              </div>
            </div>

            {/* SECTION 2: AMOUNT SELECTION */}
            <div>
              {/* <h2 className="text-xl font-bold mb-5 flex items-center gap-2" style={{ color: navyColor }}>
                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-800">
                  <CreditCard className="w-5 h-5" />
                </div>
                Choose Amount
              </h2> */}

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-5">
                {predefinedAmounts.map((amount) => (
                  <button
                    type="button"
                    key={amount}
                    onClick={() => handleAmountSelect(amount)}
                    className={`py-3 px-2 rounded-lg font-bold text-base transition-all border-2
                      ${selectedAmount === amount && !isCustom
                        ? "bg-[#022741] border-[#022741] text-white shadow-md transform -translate-y-0.5"
                        : "bg-white border-gray-200 text-gray-600 hover:border-yellow-400 hover:bg-yellow-50"
                      }`}
                  >
                    ₹{amount.toLocaleString()}
                  </button>
                ))}
              </div>

              {/* Custom Amount Input */}
              <div className="relative">
                <label className="text-sm font-semibold text-gray-500 mb-2 block">Or enter custom amount</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <IndianRupee className="w-5 h-5" />
                  </div>
                  <input
                    type="number"
                    value={formData.customAmount}
                    onChange={(e) => handleCustomAmount(e.target.value)}
                    placeholder="Enter amount (e.g. 5000)"
                    min="1"
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-colors font-bold text-xl
                      ${isCustom ? "border-yellow-400 bg-yellow-50 text-[#022741]" : "border-gray-200 focus:border-[#022741]"}`}
                  />
                </div>
              </div>
            </div>

            {/* SUBMIT BUTTON AREA */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ backgroundColor: yellowColor, color: navyColor }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Donate ₹{isCustom ? formData.customAmount || 0 : selectedAmount} Securely
                  </>
                )}
              </button>

              <div className="mt-5 flex items-center justify-center gap-2 text-sm text-gray-500 bg-gray-50 py-3 rounded-lg border border-gray-100">
                <ShieldCheck className="w-5 h-5 text-green-600" />
                <span>Secure payment powered by <strong>PhonePe</strong>. Encrypted & Safe.</span>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
