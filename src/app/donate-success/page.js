"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  XCircle,
  Loader2,
  Download,
  Home,
  FileText,
  Calendar,
  CreditCard,
  Printer
} from "lucide-react";

export default function DonateSuccessPage() {
  const searchParams = useSearchParams();
  const [transactionId, setTransactionId] = useState("");
  const [donationDetails, setDonationDetails] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Colors
  const navyColor = '#022741';
  const yellowColor = '#FFB70B';

  // ------------------------------
  // VERIFY PAYMENT LOGIC
  // ------------------------------
  const verifyPayment = async (txnId) => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId: txnId }),
      });

      const data = await res.json();

      console.log("Payment verified:", data);

      if (data.success && data.data) {
        setDonationDetails(data.data);
        setPaymentStatus(data.data.status || "");
      } else {
        setPaymentStatus("FAILED");
      }
    } catch (err) {
      console.error("VERIFY ERROR:", err);
      setPaymentStatus("FAILED");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const txnId = searchParams.get("txnId") || searchParams.get("merchantOrderId");
    if (txnId) {
      setTransactionId(txnId);
      verifyPayment(txnId);
    } else {
      setIsLoading(false);
    }
  }, [searchParams]);

  // ------------------------------
  // DOWNLOAD ACTION
  // ------------------------------
  const downloadReceipt = () => {
    const receiptUrl = donationDetails?.receiptPdfUrl;
    if (!receiptUrl) {
      alert("Receipt is being generated. Please check your email shortly.");
      return;
    }
    window.open(receiptUrl, "_blank");
  };

  // ------------------------------
  // LOADING STATE
  // ------------------------------
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#FFB70B] mb-4" />
        <h2 className="text-xl font-bold" style={{ color: navyColor }}>Verifying Contribution...</h2>
        <p className="text-gray-500 text-sm mt-2">Please do not close this window.</p>
      </div>
    );
  }

  // ------------------------------
  // MAIN RENDER
  // ------------------------------
  // FIX: Case-insensitive check for success status
  const normalizedStatus = paymentStatus?.toLowerCase() || "";
  const isSuccess = normalizedStatus === "payment_success" || normalizedStatus === "completed" || normalizedStatus === "success";
  const isPending = normalizedStatus === "pending";

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
      <main className="max-w-2xl mx-auto">

        {/* 1. STATUS HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-3xl font-extrabold mb-2" style={{ color: navyColor }}>
            {isSuccess ? "Thank You for Your Gift!" : isPending ? "Processing Donation..." : "Payment Failed"}
          </h1>
          <p className="text-gray-600 mx-auto">
            {isSuccess
              ? "Your generosity helps us continue our mission. A receipt has been sent to your email."
              : "We couldn't verify the payment status immediately. Please check your dashboard."}
          </p>
        </div>

        {/* 2. DIGITAL RECEIPT CARD */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 relative">

          {/* Top Decorative Bar */}
          <div className="h-2 w-full" style={{ backgroundColor: isSuccess ? '#22c55e' : '#ef4444' }}></div>

          <div className="p-6 md:p-8">

            {/* Amount & Status Row */}
            <div className="flex justify-between items-center pb-6 border-b border-dashed border-gray-300">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Total Amount Donated</p>
                <p className="text-4xl font-bold" style={{ color: navyColor }}>
                  ₹{donationDetails?.amount?.toLocaleString() || "0"}
                </p>
              </div>

              {/* Green Tick Badge (Right Side) - PAYTM STYLE */}
              {isSuccess && (
                <div className="flex flex-col items-center justify-center bg-green-50 px-4 py-2 rounded-lg border border-green-100">
                  {/* "fill-green-600" makes the circle solid green, "text-white" makes the tick white */}
                  <CheckCircle className="w-7 h-7 text-white fill-green-600 mb-1" />
                  <span className="text-xs font-bold text-green-700 uppercase tracking-wider">Paid</span>
                </div>
              )}
            </div>

            {/* Details Grid */}
            <div className="py-6 space-y-4">

              <div className="grid grid-cols-2 gap-4">
                <DetailRow
                  label="Transaction ID"
                  value={transactionId}
                  isMono={true}
                />
                <DetailRow
                  label="Date"
                  value={new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  icon={<Calendar className="w-3 h-3 mr-1" />}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <DetailRow
                  label="Donor Name"
                  value={donationDetails?.donorName || "N/A"}
                />
                <DetailRow
                  label="Payment Method"
                  value="Online / UPI"
                  icon={<CreditCard className="w-3 h-3 mr-1" />}
                />
              </div>

              {donationDetails?.donorEmail && (
                <div className="pt-2">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Receipt Sent To</p>
                  <p className="font-semibold text-gray-800">{donationDetails.donorEmail}</p>
                </div>
              )}
            </div>

            {/* 80G Badge */}
            <div className="mt-2 bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <p className="text-xs text-blue-800 font-medium">
                This donation is eligible for <strong>50% Tax Exemption</strong> under section 80G of the Income Tax Act.
              </p>
            </div>

          </div>

          {/* Cutout Effect (Optional visual flair for receipt look) */}
          <div className="absolute top-[108px] -left-3 w-6 h-6 bg-gray-50 rounded-full"></div>
          <div className="absolute top-[108px] -right-3 w-6 h-6 bg-gray-50 rounded-full"></div>
        </div>

        {/* 3. ACTION BUTTONS */}
        {isSuccess && (
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={downloadReceipt}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
              style={{ backgroundColor: yellowColor, color: navyColor }}
            >
              <Download className="w-5 h-5" />
              Download Receipt
            </button>

            <Link
              href="/"
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
            >
              <Home className="w-5 h-5" />
              Return Home
            </Link>
          </div>
        )}

        {/* Print Option */}
        <div className="mt-6 text-center">
          <button
            onClick={() => window.print()}
            className="text-xs text-gray-400 flex items-center justify-center gap-1 mx-auto hover:text-gray-600 transition-colors"
          >
            <Printer className="w-3 h-3" /> Print Confirmation
          </button>
        </div>

      </main>
    </div>
  );
}

// Helper Component for Rows
function DetailRow({ label, value, isMono, icon }) {
  return (
    <div>
      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1 flex items-center">
        {icon} {label}
      </p>
      <p className={`font-semibold text-gray-800 break-all ${isMono ? "font-mono text-sm" : "text-base"}`}>
        {value}
      </p>
    </div>
  );
}