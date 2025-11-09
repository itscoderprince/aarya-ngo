"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

// ✅ Correct MUI Icons
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ReplayIcon from "@mui/icons-material/Replay";
import HomeIcon from "@mui/icons-material/Home";

export default function DonateFailedPage() {
  const searchParams = useSearchParams();
  const [transactionId, setTransactionId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const txnId = searchParams.get("txnId");
    const error = searchParams.get("error");

    if (txnId) setTransactionId(txnId);
    if (error) setErrorMessage(decodeURIComponent(error));
  }, [searchParams]);

  return (
    <>


      <div className="min-h-screen bg-white">
        <main className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center">
            {/* ❌ Payment Failed Icon & Title */}
            <div className="mb-8">
              <ErrorOutlineIcon className="text-red-500 text-8xl mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-black mb-4">Payment Failed</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Unfortunately, your donation could not be processed. Please try again.
              </p>
            </div>

            {/* ❌ Error Box */}
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8 mb-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-red-800 mb-4">Payment Details</h2>

              {transactionId && (
                <div className="bg-white rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600 mb-1">Transaction ID</p>
                  <p className="font-mono text-lg text-black">{transactionId}</p>
                </div>
              )}

              <div className="flex items-center justify-center text-red-600 mb-4">
                <ErrorOutlineIcon className="mr-2" />
                <span className="font-semibold">Payment Failed</span>
              </div>

              {errorMessage && (
                <div className="bg-white rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600 mb-1">Error Details</p>
                  <p className="text-red-700">{errorMessage}</p>
                </div>
              )}

              <p className="text-red-700">
                Your payment was not processed. No amount has been charged.
              </p>
            </div>

            {/* ℹ️ Common Issues */}
            <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-8 mb-8 max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-black mb-6">Common Issues & Solutions</h2>

              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div>
                  <h3 className="font-semibold text-black mb-2">Payment Gateway Issues</h3>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Check your internet connection</li>
                    <li>• Ensure sufficient balance</li>
                    <li>• Verify card/UPI details</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-black mb-2">Technical Issues</h3>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Try a different browser</li>
                    <li>• Clear cache & cookies</li>
                    <li>• Disable ad blockers</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-black mb-2">Bank Issues</h3>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Check if online transactions are enabled</li>
                    <li>• Verify transaction limit</li>
                    <li>• Contact your bank</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-black mb-2">Other Options</h3>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Try another payment method</li>
                    <li>• Try UPI / Net Banking</li>
                    <li>• Email us for manual payment</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/donate-now"
                  className="inline-flex items-center bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-lg transition-colors"
                >
                  <ReplayIcon className="mr-2" />
                  Try Again
                </a>

                <Link
                  href="/"
                  className="inline-flex items-center bg-gray-200 hover:bg-gray-300 text-black font-bold py-3 px-8 rounded-lg transition-colors"
                >
                  <HomeIcon className="mr-2" />
                  Return to Home
                </Link>
              </div>

              <div className="text-center">
                <p className="text-gray-600 mb-2">Need help?</p>
                <a
                  href="mailto:prayasbyaaryafoundation@gmail.com"
                  className="text-yellow-600 hover:text-yellow-700 font-semibold underline"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>

          {/* Support Section */}
          <div className="mt-16 bg-black text-white rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">We Are Here to Help</h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-6">
              Still facing issues? Reach out to us — we’ll assist you quickly.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-2">Email Support</h3>
                <p className="text-gray-300">prayasbyaaryafoundation@gmail.com</p>
                <p className="text-sm text-gray-400 mt-1">Response within 24 hours</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-2">Alternative Donation</h3>
                <p className="text-gray-300">Bank / Manual Transfer available</p>
                <p className="text-sm text-gray-400 mt-1">Email us for bank details</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
