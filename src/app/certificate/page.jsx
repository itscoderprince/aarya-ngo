"use client";

import {
    FileText,
    Award,
    Scale,
    Building2,
    CreditCard,
    BookOpen,
    Eye,
    Download,
    ShieldCheck
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

// --- Configuration ---
const DOCUMENTS = [
    {
        id: 1,
        title: "Certificate of Incorporation",
        regNumber: "CIN: U85300DL2021NPL390883",
        type: "Legal",
        icon: Building2,
        link: "/pdfs/SPICE + Part B_Approval Letter_AB3993429 (2).pdf",
        description: "Official registration certificate of the foundation."
    },
    {
        id: 3,
        title: "80G Certificate",
        regNumber: "AAPCP7816BF20251",
        type: "Donor Benefit",
        icon: HeartIcon,
        link: "/pdfs/AAPCP7816BF20251_signed.pdf",
        description: "Allows donors to claim 50% tax deduction."
    },
    {
        id: 4,
        title: "PAN Card",
        regNumber: "AAPCP7816B",
        type: "Identity",
        icon: CreditCard,
        link: "/pdfs/PAN.pdf",
        description: "Permanent Account Number of the organization."
    },
    {
        id: 5,
        title: "TAN Certificate",
        regNumber: "DELN10541F",
        type: "Compliance",
        icon: FileText,
        link: "/pdfs/TAN.pdf",
        description: "Tax Deduction and Collection Account Number."
    },
    {
        id: 6,
        title: "Memorandum of Association",
        regNumber: "MOA",
        type: "Constitution",
        icon: BookOpen,
        link: "/pdfs/MOA.pdf",
        description: "Defines the constitution and scope of powers."
    },
    {
        id: 7,
        title: "Articles of Association",
        regNumber: "AOA",
        type: "Rules",
        icon: Scale,
        link: "/pdfs/AOA.pdf",
        description: "Rules and regulations for management."
    }
];

// Helper Icon for 80G
function HeartIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
        >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
    );
}

const COLORS = {
    navy: "#022741",
    yellow: "#FFB70B",
    lightBlue: "#F0F4F8",
};

export default function LegalDocuments() {
    const router = useRouter();

    const handlePreview = (link) => {
        if (!link) return alert("Document not available yet.");
        window.open(link, "_blank");
    };

    const handleDownload = (link, filename) => {
        if (!link) return alert("Document not available yet.");

        // For external links (like Google Drive), open in new tab
        if (link.startsWith("http")) {
            window.open(link, "_blank");
            return;
        }

        // For local files, try to trigger download
        const a = document.createElement('a');
        a.href = link;
        a.download = filename || 'document.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen" id="certificates">
            <div className="max-w-7xl mx-auto">

                {/* Section Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-[#022741] text-xs font-bold uppercase tracking-wider mb-4"
                    >
                        <ShieldCheck className="w-4 h-4" />
                        Transparency & Trust
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6"
                        style={{ color: COLORS.navy }}
                    >
                        Legal & Compliance Documents
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-600 max-w-2xl mx-auto text-lg"
                    >
                        We believe in complete transparency. Access our official registration certificates,
                        tax exemption proofs (80G/12A), and governing documents below.
                    </motion.p>
                </div>

                {/* Documents Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {DOCUMENTS.map((doc, index) => (
                        <motion.div
                            key={doc.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
                        >
                            {/* Color Stripe Top */}
                            <div className="h-1.5 w-full bg-gray-100 group-hover:bg-[#FFB70B] transition-colors duration-300"></div>

                            <div className="p-6 flex flex-col flex-grow">
                                {/* Header: Icon & Type */}
                                <div className="flex justify-between items-start mb-5">
                                    <div className="p-3.5 rounded-xl bg-[#022741] text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <doc.icon className="w-6 h-6" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#022741] bg-blue-50 px-2.5 py-1 rounded-lg">
                                        {doc.type}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="flex-grow">
                                    <h3 className="font-bold text-xl leading-tight mb-2 text-gray-900 group-hover:text-[#022741] transition-colors">
                                        {doc.title}
                                    </h3>
                                    <p className="text-xs font-mono text-gray-500 mb-4 bg-gray-50 inline-block px-2 py-0.5 rounded border border-gray-100">
                                        {doc.regNumber}
                                    </p>
                                    <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                                        {doc.description}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="mt-6 pt-4 border-t border-gray-100 flex gap-3">
                                    <button
                                        onClick={() => handlePreview(doc.link)}
                                        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gray-50 text-gray-700 hover:bg-[#022741] hover:text-white transition-all text-sm font-bold group/btn"
                                    >
                                        <Eye className="w-4 h-4" />
                                        Preview
                                    </button>
                                    <button
                                        onClick={() => handleDownload(doc.link, `${doc.title}.pdf`)}
                                        className="flex items-center justify-center p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:border-[#FFB70B] hover:text-[#FFB70B] hover:bg-yellow-50 transition-all"
                                        title="Download PDF"
                                    >
                                        <Download className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom Trust Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 bg-[#022741] rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 text-white shadow-2xl relative overflow-hidden"
                >
                    {/* Abstract Background Decoration */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FFB70B] opacity-10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

                    <div className="relative z-10 text-center md:text-left">
                        <h3 className="text-2xl sm:text-3xl font-bold mb-3 flex items-center justify-center md:justify-start gap-3">
                            <ShieldCheck className="text-[#FFB70B] w-8 h-8" />
                            100% Tax Exemption
                        </h3>
                        <p className="text-blue-100 text-base sm:text-lg max-w-xl leading-relaxed">
                            All donations are eligible for tax deduction under Section 80G of the Income Tax Act.
                            We maintain strict financial transparency and are audited annually.
                        </p>
                    </div>

                    <button
                        className="relative z-10 whitespace-nowrap px-8 py-4 rounded-xl font-bold text-[#022741] bg-[#FFB70B] hover:bg-white hover:text-[#022741] transition-all shadow-[0_0_20px_rgba(255,183,11,0.3)] hover:shadow-[0_0_30px_rgba(255,183,11,0.5)] transform hover:-translate-y-1"
                        onClick={() => router.push('/donate-now')}
                    >
                        Donate & Save Tax
                    </button>
                </motion.div>

            </div>
        </section>
    );
}