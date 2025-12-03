"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Heart, Loader2 } from "lucide-react"

export default function DonateButton({ size = "medium", className = "", amount = null, showAmount = false }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleDonate = () => {
    setIsLoading(true)
    // Simulate a small delay for better UX or just redirect immediately
    // If amount is present, we could pass it via query params: /donate-now?amount=${amount}
    // For now, simple redirect.
    const url = amount ? `/donate-now?amount=${amount}` : "/donate-now"
    router.push(url)
  }

  const sizeClasses = {
    small: "px-4 py-2 text-sm",
    medium: "px-6 py-3 text-base",
    large: "px-8 py-4 text-lg",
  }

  return (
    <button
      onClick={handleDonate}
      disabled={isLoading}
      className={`
        ${sizeClasses[size]}
        font-semibold rounded-lg transition-all duration-200
        flex items-center space-x-2 hover:shadow-lg hover:scale-105
        disabled:opacity-70 disabled:cursor-not-allowed
        ${className}
      `}
      style={{
        backgroundColor: "#ffb70b",
        color: "#022741",
      }}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <Heart className="w-5 h-5 fill-current" />
      )}
      <span>{isLoading ? "Processing..." : showAmount && amount ? `Donate ₹${amount}` : "Donate Now"}</span>
    </button>
  )
}
