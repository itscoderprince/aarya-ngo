// ✅ src/app/api/volunteers/route.js

// Ensure Node.js runtime for PDFKit and filesystem access
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { connectDB } from "@/lib/mongodb";
import Volunteer from "@/models/Volunteer";
import { generateIDCardPDF, generateCertificatePDF } from "@/lib/pdf-generator";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // ✅ Connect to MongoDB
    await connectDB();

    const { searchParams } = new URL(request.url);
    const volunteerId = searchParams.get("volunteerId");
    const type = searchParams.get("type");

    if (!volunteerId || !type) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    // ✅ Fetch volunteer record
    const volunteer = await Volunteer.findOne({ volunteerId });
    if (!volunteer) {
      return NextResponse.json({ error: "Volunteer not found" }, { status: 404 });
    }

    // ✅ Generate the requested PDF
    let pdfBuffer;
    if (type === "id-card") {
      pdfBuffer = await generateIDCardPDF(volunteer);
    } else if (type === "certificate") {
      pdfBuffer = await generateCertificatePDF(volunteer);
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    // ✅ Return PDF as download response
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${volunteerId}_${type}.pdf"`,
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Expires: "0",
      },
    });

  } catch (error) {
    console.error("❌ [PDF Generation Error]", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          "An unexpected error occurred while generating the PDF. Please try again later.",
      },
      { status: 500 }
    );
  }
}
