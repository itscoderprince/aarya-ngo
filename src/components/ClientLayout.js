"use client"

import { usePathname } from "next/navigation"
import Navbar from "@/components/Shared/Navbar"
import Footer from "@/components/Shared/Footer"
import { Toaster } from "react-hot-toast"

export default function ClientLayout({ children }) {
    const pathname = usePathname()
    const isAdmin = pathname?.startsWith("/admin")

    return (
        <>
            {!isAdmin && <Navbar />}
            {children}
            {!isAdmin && <Footer />}
            <Toaster position="top-right" />
        </>
    )
}
