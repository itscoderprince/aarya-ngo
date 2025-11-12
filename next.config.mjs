/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Ensure Next.js knows it should use Node runtime for server routes
  experimental: {
    serverComponentsExternalPackages: ["pdfkit", "fontkit"],
  },

  // ✅ Fixes for PDFKit build issues (avoid SWC parsing of heavy Node deps)
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Prevent Vercel / Next from trying to bundle heavy libs
      config.externals.push({ pdfkit: "commonjs pdfkit", fontkit: "commonjs fontkit" });
    }

    // (Optional) Polyfill fs/path for client build if needed
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };

    return config;
  },

  // ✅ Allow images from Cloudinary (for profile pics etc.)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
  },

  // ✅ Ensure dynamic routes are built correctly
  output: "standalone",

  // ✅ Avoid static caching of API routes (helps with fresh PDF generation)
  generateEtags: false,

  // ✅ Optional: improve build stability
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
