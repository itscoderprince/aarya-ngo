import PDFDocument from "pdfkit"
import fs from "fs"
import path from "path"

// Utility to safely register a local TTF font (avoids Helvetica.afm errors)
function getFont(doc) {
  try {
    const fontPath = path.join(process.cwd(), "public", "fonts", "Roboto-Regular.ttf")
    if (fs.existsSync(fontPath)) {
      doc.registerFont("Roboto", fontPath)
      doc.font("Roboto")
    } else {
      console.warn("⚠️ Font file not found at:", fontPath, "Using Times-Roman fallback.")
      doc.font("Times-Roman")
    }
  } catch (err) {
    console.error("Font registration failed:", err)
    doc.font("Times-Roman")
  }
}

export async function generateIDCardPDF(volunteer) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: [400, 250], margin: 20 })
      getFont(doc)

      const chunks = []
      doc.on("data", (chunk) => chunks.push(chunk))
      doc.on("end", () => resolve(Buffer.concat(chunks)))

      // Background
      doc.fillColor("#667eea").rect(0, 0, 400, 250).fill()

      // Title
      doc.fillColor("white").fontSize(16).text("VOLUNTEER ID CARD", 20, 15, {
        width: 360,
        align: "center",
      })
      doc.fontSize(10).text("Prayas by Aarya Foundation", 20, 35, { width: 360, align: "center" })

      // Profile Image
      if (volunteer.profilePicUrl) {
        try {
          doc.image(volunteer.profilePicUrl, 150, 55, { width: 100, height: 80 })
        } catch {
          doc.rect(150, 55, 100, 80).strokeColor("white").stroke()
        }
      }

      // ID and Name
      doc.fontSize(8).fillColor("rgba(255,255,255,0.8)").text("VOLUNTEER ID", 20, 145)
      doc.fontSize(14).fillColor("white").text(volunteer.volunteerId || "N/A", 20, 158)

      doc.fontSize(8).fillColor("rgba(255,255,255,0.8)").text("NAME", 20, 180)
      doc.fontSize(11).fillColor("white").text(volunteer.name || "N/A", 20, 191)

      // Details
      doc
        .fontSize(8)
        .fillColor("rgba(255,255,255,0.7)")
        .text(`Blood: ${volunteer.bloodGroup || "N/A"} | Phone: ${volunteer.mobile || "N/A"}`, 20, 210)

      doc
        .fontSize(8)
        .text(
          `Membership: ${
            volunteer.validity === "1year"
              ? "1 Yr"
              : volunteer.validity === "3year"
              ? "3 Yrs"
              : "Lifetime"
          }`,
          20,
          222,
        )

      doc
        .fontSize(7)
        .fillColor("rgba(255,255,255,0.6)")
        .text(
          `Approved: ${
            volunteer.approvalDate
              ? new Date(volunteer.approvalDate).toLocaleDateString()
              : "N/A"
          }`,
          20,
          233,
        )

      doc.end()
    } catch (error) {
      console.log("[v0] ID Card PDF generation error:", error.message)
      reject(error)
    }
  })
}

export async function generateCertificatePDF(volunteer) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 50 })
      getFont(doc)

      const chunks = []
      doc.on("data", (chunk) => chunks.push(chunk))
      doc.on("end", () => resolve(Buffer.concat(chunks)))

      // Background and border
      doc.fillColor("#fffef5").rect(0, 0, 612, 792).fill()
      doc.lineWidth(4).strokeColor("#d4af37").rect(40, 40, 532, 712).stroke()
      doc.lineWidth(1).rect(50, 50, 512, 692).stroke()

      // Header
      doc.fontSize(11).fillColor("#8b7355").text("✦ CERTIFICATE OF RECOGNITION ✦", 100, 80, {
        width: 412,
        align: "center",
      })

      // Title
      doc.fontSize(48).fillColor("#1a1a1a").text("CERTIFICATE", 100, 130, {
        width: 412,
        align: "center",
      })

      // Decorative line
      doc.strokeColor("#d4af37").lineWidth(2).moveTo(120, 200).lineTo(492, 200).stroke()

      // Main content
      doc.fontSize(14).fillColor("#666").text("This is to certify that", 100, 230, {
        width: 412,
        align: "center",
      })

      doc.fontSize(36).fillColor("#1a1a1a").text(volunteer.name || "N/A", 100, 270, {
        width: 412,
        align: "center",
      })

      doc.strokeColor("#1a1a1a").lineWidth(1).moveTo(150, 315).lineTo(462, 315).stroke()

      doc.fontSize(13).fillColor("#555").text("has been recognized as a dedicated and committed", 100, 330, {
        width: 412,
        align: "center",
      })
      doc.fontSize(16).fillColor("#667eea").text("VOLUNTEER", 100, 350, { width: 412, align: "center" })
      doc.fontSize(12).fillColor("#555").text("of", 100, 370, { width: 412, align: "center" })
      doc.fontSize(14).fillColor("#667eea").text("Prayas by Aarya Foundation", 100, 385, {
        width: 412,
        align: "center",
      })
      doc.fontSize(12).fillColor("#666").text("for their valuable contribution to the service of society", 100, 410, {
        width: 412,
        align: "center",
      })

      // Details box
      doc.strokeColor("#d4af37").lineWidth(1).rect(80, 450, 452, 80).stroke()
      doc.fontSize(11).fillColor("#1a1a1a").text(`Volunteer ID: ${volunteer.volunteerId || "N/A"}`, 95, 462)
      doc
        .fontSize(11)
        .text(
          `Membership: ${
            volunteer.validity === "1year"
              ? "1 Year"
              : volunteer.validity === "3year"
              ? "3 Years"
              : "Lifetime"
          }`,
          95,
          482,
        )
      doc.text(
        `Date of Issue: ${
          volunteer.approvalDate
            ? new Date(volunteer.approvalDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "N/A"
        }`,
        95,
        502,
      )

      // Footer
      doc.fontSize(12).fillColor("#1a1a1a").text("Issued by", 100, 570, {
        width: 412,
        align: "center",
      })
      doc.fontSize(14).text("PRAYAS BY AARYA FOUNDATION", 100, 590, {
        width: 412,
        align: "center",
      })
      doc.fontSize(11).fillColor("#999").text("Bringing positive change to society", 100, 610, {
        width: 412,
        align: "center",
      })

      // Bottom line + verification
      doc.strokeColor("#d4af37").lineWidth(2).moveTo(120, 650).lineTo(492, 650).stroke()
      doc.fontSize(10).fillColor("#d4af37").text("◆ DIGITALLY VERIFIED & AUTHENTIC ◆", 100, 670, {
        width: 412,
        align: "center",
      })

      doc.end()
    } catch (error) {
      console.log("[v0] Certificate PDF generation error:", error.message)
      reject(error)
    }
  })
}
