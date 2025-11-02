"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import Navbar from "@/components/Shared/Navbar";
import Footer from "@/components/Shared/Footer";

// ✅ Correct MUI Icons
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EmailIcon from "@mui/icons-material/Email";
import HomeIcon from "@mui/icons-material/Home";
import DownloadIcon from "@mui/icons-material/Download";

export default function DonateSuccessPage() {
  const searchParams = useSearchParams();
  const [transactionId, setTransactionId] = useState("");
  const [donationDetails, setDonationDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const verifyPayment = async (txnId) => {
    try {
      const response = await fetch("/api/verify-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transactionId: txnId }),
      });

      const data = await response.json();

      if (data.success && data.donorDetails) {
        setDonationDetails(data.donorDetails);
      }
    } catch (error) {
      console.error("Payment verification error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const txnId = searchParams.get("txnId");
    if (txnId) {
      setTransactionId(txnId);
      verifyPayment(txnId);
    }
  }, [searchParams]);

  const downloadReceipt = () => {
    alert("Receipt download feature will be implemented soon");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        <main className="max-w-4xl mx-auto px-6 py-12">
          {isLoading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
              <p className="text-gray-600">Verifying your payment...</p>
            </div>
          ) : (
            <div className="text-center">
              <div className="mb-8">
                <CheckCircleIcon className="text-green-500 text-8xl mx-auto mb-4" />
                <h1 className="text-4xl font-bold text-black mb-4">
                  Thank You for Your Donation!
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Your generous contribution has been successfully processed.
                </p>
              </div>

              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-8 mb-8 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-black mb-4">
                  Payment Confirmation
                </h2>

                {transactionId && (
                  <div className="bg-white rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-600 mb-1">Transaction ID</p>
                    <p className="font-mono text-lg text-black">{transactionId}</p>
                  </div>
                )}

                {donationDetails && (
                  <div className="bg-white rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-2 gap-4 text-left">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Amount</p>
                        <p className="font-bold text-2xl text-green-600">
                          ₹{donationDetails.amount?.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Date</p>
                        <p className="font-semibold text-black">
                          {new Date().toLocaleDateString("en-IN")}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Donor Name</p>
                        <p className="font-semibold text-black">
                          {donationDetails.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Email</p>
                        <p className="font-semibold text-black">
                          {donationDetails.email}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-center text-green-600 mb-4">
                  <CheckCircleIcon className="mr-2" />
                  <span className="font-semibold">Payment Successful</span>
                </div>

                <p className="text-gray-600">
                  A confirmation email has been sent to your registered email.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                  <EmailIcon className="text-yellow-400 text-4xl mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-black mb-2">Email Sent</h3>
                  <p className="text-gray-600">
                    Check your inbox for your donation receipt.
                  </p>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                  <span className="text-4xl mx-auto mb-4 block">📄</span>
                  <h3 className="text-xl font-bold text-black mb-2">Tax Benefits</h3>
                  <p className="text-gray-600">
                    Donation eligible for 80G tax deduction.
                  </p>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                  <DownloadIcon className="text-yellow-400 text-4xl mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-black mb-2">Download Receipt</h3>
                  <button
                    onClick={downloadReceipt}
                    className="text-yellow-600 hover:text-yellow-700 font-semibold underline"
                  >
                    Download PDF Receipt
                  </button>
                </div>
              </div>

              <Link
                href="/"
                className="inline-flex items-center bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-lg transition-colors"
              >
                <HomeIcon className="mr-2" />
                Return to Home
              </Link>

              <div className="text-center mt-4">
                <p className="text-gray-600 mb-2">Want to donate again?</p>
                <a
                  href="/donate-now"
                  className="text-yellow-600 hover:text-yellow-700 font-semibold underline"
                >
                  Donate Again
                </a>
              </div>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}
