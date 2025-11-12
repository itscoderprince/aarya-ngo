// ✅ Force Node.js runtime (required for PDFKit + fs + path)
export const runtime = "nodejs";

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

    // ✅ Basic parameter validation
    if (!volunteerId || !type) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    // ✅ Find volunteer in database
    const volunteer = await Volunteer.findOne({ volunteerId });
    if (!volunteer) {
      return NextResponse.json({ error: "Volunteer not found" }, { status: 404 });
    }

    // ✅ Generate PDF based on type
    let pdfBuffer;
    if (type === "id-card") {
      pdfBuffer = await generateIDCardPDF(volunteer);
    } else if (type === "certificate") {
      pdfBuffer = await generateCertificatePDF(volunteer);
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    // ✅ Return PDF as downloadable response
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${volunteerId}_${type}.pdf"`,
        "Cache-Control": "no-store",
      },
    });

  } catch (error) {
    console.error("[v0] PDF download error:", error);
    return NextResponse.json(
      {
        error: error?.message || "Failed to generate PDF. Please try again later.",
      },
      { status: 500 }
    );
  }
}
