"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Heart,
  User,
  Mail,
  Phone,
  FileText,
  IndianRupee,
  Loader2,
  ShieldCheck,
} from "lucide-react";

// --- Constants & Config ---
const COLORS = {
  navy: "#022741",
  yellow: "#FFB70B",
  grayBorder: "#E5E7EB",
};

const PREDEFINED_AMOUNTS = [500, 1000, 2100, 5000, 11000];

// --- Reusable Sub-Components ---
const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  icon: Icon,
  placeholder,
  required = false,
  maxLength,
  helperText,
  className = "",
}) => (
  <div className={className}>
    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#022741] transition-colors">
        <Icon className="w-4 h-4" />
      </div>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md 
        focus:border-[#022741] focus:ring-1 focus:ring-[#022741] outline-none transition-all 
        placeholder:text-gray-400 ${name === "pan" ? "uppercase" : ""}`}
      />
    </div>
    {helperText && <p className="text-[10px] text-gray-400 mt-1 ml-1">{helperText}</p>}
  </div>
);

const AmountSelector = ({
  amounts,
  selectedAmount,
  isCustom,
  customAmount,
  onSelectAmount,
  onCustomChange,
}) => (
  <div className="space-y-3">
    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
      Select Donation Amount
    </label>

    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
      {amounts.map((amount) => {
        const isSelected = selectedAmount === amount && !isCustom;
        return (
          <button
            key={amount}
            type="button"
            onClick={() => onSelectAmount(amount)}
            className={`py-2 px-1 rounded-md text-sm font-semibold transition-all border
            ${isSelected
                ? "bg-[#022741] border-[#022741] text-white shadow-sm"
                : "bg-white border-gray-200 text-gray-600 hover:border-[#FFB70B] hover:bg-yellow-50"
              }`}
          >
            ₹{amount.toLocaleString()}
          </button>
        );
      })}
    </div>

    <div className="relative mt-2">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
        <IndianRupee className="w-4 h-4" />
      </div>
      <input
        type="number"
        value={customAmount}
        onChange={(e) => onCustomChange(e.target.value)}
        placeholder="Enter custom amount (e.g. 7500)"
        min="1"
        className={`w-full pl-9 pr-3 py-2 text-sm border rounded-md focus:outline-none transition-colors font-semibold
        ${isCustom
            ? "border-[#FFB70B] bg-yellow-50 text-[#022741]"
            : "border-gray-300 focus:border-[#022741]"
          }`}
      />
    </div>
  </div>
);

// --- Main Component ---

export default function DonateClient() {
  const searchParams = useSearchParams();

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

  useEffect(() => {
    const amountParam = searchParams.get("amount");
    if (amountParam) {
      const amount = Number(amountParam);
      if (!isNaN(amount) && amount > 0) {
        if (PREDEFINED_AMOUNTS.includes(amount)) {
          setSelectedAmount(amount);
          setIsCustom(false);
        } else {
          setIsCustom(true);
          setSelectedAmount(null);
          setFormData((prev) => ({ ...prev, customAmount: amount.toString() }));
        }
      }
    }
  }, [searchParams]);

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
    if (value !== "" && Number(value) < 0) return;

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

      const response = await res.json();
      const paymentData = response.data || response;

      if (response.success && paymentData.redirectUrl) {
        window.location.href = paymentData.redirectUrl;
      } else {
        alert(response.message || "Unable to initiate payment.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert("Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 text-center sm:text-left">
          <h1
            className="text-2xl sm:text-3xl font-bold flex items-center justify-center sm:justify-start gap-2.5"
            style={{ color: COLORS.navy }}
          >
            <Heart className="w-7 h-7 text-red-500 fill-current animate-pulse" />
            Make a Donation
          </h1>
          <p className="text-gray-500 mt-2 text-sm max-w-lg mx-auto sm:mx-0 leading-relaxed">
            Your generous contribution supports our mission and brings hope.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="w-full h-1.5" style={{ backgroundColor: COLORS.yellow }}></div>

          <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-6">
            {/* INPUT FIELDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Full Name"
                name="name"
                icon={User}
                value={formData.name}
                onChange={handleInputChange}
                placeholder="John Doe"
                required
              />

              <InputField
                label="Phone Number"
                name="phone"
                type="tel"
                icon={Phone}
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+91 98765 43210"
                required
              />

              <InputField
                label="Email Address"
                name="email"
                type="email"
                icon={Mail}
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                required
              />

              <InputField
                label="PAN Card"
                name="pan"
                icon={FileText}
                value={formData.pan}
                onChange={handleInputChange}
                maxLength={10}
                placeholder="ABCDE1234F"
                helperText="For 80G Tax Exemption (Optional)"
              />
            </div>

            <hr className="border-gray-100" />

            {/* AMOUNT SELECTOR */}
            <AmountSelector
              amounts={PREDEFINED_AMOUNTS}
              selectedAmount={selectedAmount}
              isCustom={isCustom}
              customAmount={formData.customAmount}
              onSelectAmount={handleAmountSelect}
              onCustomChange={handleCustomAmount}
            />

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-lg font-bold text-base shadow-md hover:shadow-lg transition-all 
                transform active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed 
                flex items-center justify-center gap-2 text-white"
                style={{ backgroundColor: COLORS.navy }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Donate ₹{isCustom ? formData.customAmount || 0 : selectedAmount} Securely
                  </>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500 bg-gray-50 py-2.5 rounded-md border border-gray-100">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                <span>Secured by <strong>PhonePe</strong>. Encrypted & Safe.</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
