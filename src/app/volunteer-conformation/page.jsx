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
    User,
    Calendar,
    IdCard,
    Printer,
    Copy,
    Check,
    LayoutDashboard,
    Mail
} from "lucide-react";

export default function VolunteerSuccessClient() {
    const searchParams = useSearchParams();
    const [transactionId, setTransactionId] = useState("");
    const [volunteerDetails, setVolunteerDetails] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isCopied, setIsCopied] = useState(false);

    // Theme Colors
    const navyColor = "#022741";
    const yellowColor = "#FFB70B";

    // 1. VERIFY PAYMENT
    const verifyPayment = async (txnId) => {
        try {
            setIsLoading(true);
            const res = await fetch("/api/verify-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ transactionId: txnId }),
            });

            const data = await res.json();
            console.log("Volunteer Verified:", data);

            if (data.success && data.data) {
                setVolunteerDetails(data.data);
                setPaymentStatus(data.data.status || "PENDING");
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

    // Initialize from URL
    useEffect(() => {
        const txnId = searchParams.get("txnId") || searchParams.get("merchantOrderId");
        if (txnId) {
            setTransactionId(txnId);
            verifyPayment(txnId);
        } else {
            setIsLoading(false);
        }
    }, [searchParams]);

    // Copy Referral Code
    const copyReferral = () => {
        if (volunteerDetails?.referralCode) {
            navigator.clipboard.writeText(volunteerDetails.referralCode);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    // LOADING STATE
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-[#FFB70B] mb-4" />
                <h2 className="text-xl font-bold" style={{ color: navyColor }}>Finalizing Membership...</h2>
                <p className="text-gray-500 text-sm mt-2">Generating ID Card & Credentials...</p>
            </div>
        );
    }

    // SUCCESS STATES
    const isSuccess = ["PAYMENT_SUCCESS", "COMPLETED", "approved", "PENDING", "pending"].includes(paymentStatus);

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
            <main className="max-w-2xl mx-auto">

                {/* HEADER */}
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-extrabold mb-2" style={{ color: navyColor }}>
                        {isSuccess ? "Welcome to the Team!" : "Verification Failed"}
                    </h1>
                    <p className="text-gray-600">
                        {isSuccess
                            ? `Congratulations ${volunteerDetails?.name || "Volunteer"}! Your application has been submitted successfully. Our team will review your application and after verification, it will be approved. We will contact you soon.`
                            : "We couldn't verify the payment status immediately. Please contact support."}
                    </p>
                </div>

                {/* RECEIPT CARD */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 relative">

                    <div className="h-2 w-full" style={{ backgroundColor: isSuccess ? "#22c55e" : "#ef4444" }}></div>

                    <div className="p-6 md:p-8">

                        {/* AMOUNT */}
                        <div className="flex justify-between items-center pb-6 border-b border-dashed border-gray-300">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Membership Fee Paid</p>
                                <p className="text-4xl font-bold" style={{ color: navyColor }}>
                                    ₹{volunteerDetails?.amount?.toLocaleString() || "0"}
                                </p>
                            </div>

                            {isSuccess && (
                                <div className="flex flex-col items-center bg-green-50 px-4 py-2 rounded-lg border border-green-100">
                                    <CheckCircle className="w-7 h-7 text-white fill-green-600 mb-1" />
                                    <span className="text-xs font-bold text-green-700 uppercase">Success</span>
                                </div>
                            )}
                        </div>

                        {/* INFORMATION GRID */}
                        <div className="py-6 space-y-6">

                            <div className="grid grid-cols-2 gap-4">
                                <DetailRow
                                    label="Volunteer Name"
                                    value={volunteerDetails?.name || "N/A"}
                                    icon={<User className="w-3 h-3 mr-1" />}
                                />
                                <DetailRow
                                    label="Date"
                                    value={new Date().toLocaleDateString("en-IN")}
                                    icon={<Calendar className="w-3 h-3 mr-1" />}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <DetailRow label="Transaction ID" value={transactionId} isMono />
                                <DetailRow
                                    label="Role / Type"
                                    value={volunteerDetails?.volunteerType?.toUpperCase() || "VOLUNTEER"}
                                    icon={<IdCard className="w-3 h-3 mr-1" />}
                                />
                            </div>

                            {/* REFERRAL + ID */}
                            {isSuccess && (
                                <div className="bg-[#f8fafc] border border-gray-200 rounded-xl p-4 mt-4">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

                                        <div>
                                            <p className="text-xs text-gray-400 uppercase mb-1">Volunteer ID</p>
                                            <p className="text-lg font-mono font-bold" style={{ color: navyColor }}>
                                                {volunteerDetails?.volunteerId || "Generating..."}
                                            </p>
                                        </div>

                                        <div className="w-full sm:w-auto bg-white border border-gray-200 rounded-lg p-2 pl-3 flex items-center justify-between gap-3 shadow-sm">
                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase font-bold">Referral Code</p>
                                                <p className="font-mono font-bold text-gray-800">
                                                    {volunteerDetails?.referralCode || "---"}
                                                </p>
                                            </div>

                                            <button
                                                onClick={copyReferral}
                                                className="p-2 hover:bg-gray-100 rounded-md"
                                            >
                                                {isCopied ? (
                                                    <Check className="w-4 h-4 text-green-600" />
                                                ) : (
                                                    <Copy className="w-4 h-4 text-gray-400" />
                                                )}
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            )}

                        </div>

                        {/* EMAIL NOTE */}
                        <div className="mt-2 bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-start gap-3">
                            <Mail className="w-5 h-5 text-blue-600" />
                            <p className="text-xs text-blue-800 font-medium">
                                Your <strong>ID Card</strong> & <strong>Certificate</strong> have been emailed to you.
                            </p>
                        </div>

                    </div>

                    {/* CUTOUT DESIGN */}
                    <div className="absolute top-[108px] -left-3 w-6 h-6 bg-gray-50 rounded-full" />
                    <div className="absolute top-[108px] -right-3 w-6 h-6 bg-gray-50 rounded-full" />
                </div>

                {/* ACTION BUTTONS */}
                {isSuccess && (
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/dashboard/volunteer"
                            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                            style={{ backgroundColor: yellowColor, color: navyColor }}
                        >
                            <LayoutDashboard className="w-5 h-5" />
                            Access Dashboard
                        </Link>

                        <Link
                            href="/"
                            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
                        >
                            <Home className="w-5 h-5" />
                            Return Home
                        </Link>
                    </div>
                )}

                {/* PRINT BUTTON */}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => window.print()}
                        className="text-xs text-gray-400 flex items-center gap-1 mx-auto hover:text-gray-600"
                    >
                        <Printer className="w-3 h-3" /> Print Confirmation
                    </button>
                </div>

            </main>
        </div>
    );
}

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
