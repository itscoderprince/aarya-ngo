import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import Navbar from "@/components/Shared/Navbar";
import Footer from "@/components/Shared/Footer";
import ClientLayout from "@/components/ClientLayout";

const geistSans = Geist({
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
});

export const metadata = {
  title: "Prayas by Aarya Foundation - Making a Difference",
  description:
    "Join Prayas by Aarya Foundation in creating positive change in communities worldwide. Donate, volunteer, and help us build a better tomorrow.",
  generator: "Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
        <style>{`
          html {
            font-family: ${GeistSans.style.fontFamily};
          }
        `}</style>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-white text-slate-900 antialiased`}
        suppressHydrationWarning
      >
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
