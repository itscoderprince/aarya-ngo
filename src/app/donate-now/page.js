"use client";

import { useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PersonIcon from "@mui/icons-material/Person";
import CreditCardIcon from "@mui/icons-material/CreditCard";

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "pan" ? value.toUpperCase() : value, // PAN uppercase
    }));
  };

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setIsCustom(false);
    setFormData((prev) => ({
      ...prev,
      amount: amount,
      customAmount: "",
    }));
  };

  const handleCustomAmount = (value) => {
    if (Number(value) < 1) value = ""; // Prevent 0 or negative amount
    setIsCustom(true);
    setSelectedAmount(null);
    setFormData((prev) => ({
      ...prev,
      customAmount: value,
      amount: Number(value) || 0,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const finalAmount = isCustom ? formData.customAmount : selectedAmount;

      if (!finalAmount || finalAmount < 1) {
        alert("Please enter a valid donation amount");
        setIsLoading(false);
        return;
      }

      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, amount: finalAmount }),
      });

      const data = await response.json();

      if (data.success && data.paymentUrl) {
        window.location.href = data.paymentUrl; // ✅ Redirect to PhonePe
      } else {
        alert(data.message || "Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>

      <div className="min-h-screen bg-white">
        <main className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <FavoriteIcon className="text-yellow-400 text-4xl mr-3" />
              <h1 className="text-4xl font-bold text-black">Make a Donation</h1>
            </div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Your generous contribution helps us create a brighter tomorrow for those in need. Every donation makes a meaningful difference.
            </p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Details */}
              <div>
                <h2 className="text-2xl font-bold text-black mb-6 flex items-center">
                  <PersonIcon className="mr-2 text-yellow-400" />
                  Personal Information
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <InputField label="Full Name *" type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="Enter your full name" />
                  <InputField label="Email Address *" type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="Enter your email" />
                  <InputField label="Phone Number *" type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="Enter your phone no" />
                  <InputField label="PAN Number (Optional)" type="text" name="pan" value={formData.pan} maxLength="10" onChange={handleInputChange} placeholder="Enter PAN for tax benefits" />
                </div>
              </div>

              {/* Amount Selection */}
              <div>
                <h2 className="text-2xl font-bold text-black mb-6 flex items-center">
                  <CreditCardIcon className="mr-2 text-yellow-400" />
                  Choose Donation Amount
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                  {predefinedAmounts.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => handleAmountSelect(amount)}
                      className={`py-4 px-6 rounded-lg border-2 font-semibold transition-all ${
                        selectedAmount === amount && !isCustom
                          ? "bg-yellow-400 border-yellow-400 text-black"
                          : "bg-white border-gray-300 text-gray-700 hover:border-yellow-400"
                      }`}
                    >
                      ₹{amount.toLocaleString()}
                    </button>
                  ))}
                </div>

                <label className="block text-sm font-medium text-gray-700 mb-2">Custom Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                  <input
                    type="number"
                    value={formData.customAmount}
                    onChange={(e) => handleCustomAmount(e.target.value)}
                    className={`w-full pl-8 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                      isCustom ? "border-yellow-400 bg-yellow-50" : "border-gray-300 focus:border-yellow-400"
                    }`}
                    placeholder="Enter custom amount"
                    min="1"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="text-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 px-12 rounded-lg text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FavoriteIcon className="mr-2" />
                      Donate ₹{isCustom ? formData.customAmount || 0 : selectedAmount} Now
                    </>
                  )}
                </button>

                <p className="text-sm text-gray-500 mt-4">
                  Secure payment powered by PhonePe. Your donation is safe and encrypted.
                </p>
              </div>
            </form>
          </div>
        </main>
      </div>
    </>
  );
}

// ✅ Reusable Input component
function InputField(props) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{props.label}</label>
      <input {...props} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none transition-colors" />
    </div>
  );
}
