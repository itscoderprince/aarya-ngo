import { PDFDocument } from "pdfkit-table"

export async function generateIDCardPDF(volunteer) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        bufferPages: true,
      })

      const chunks = []
      doc.on("data", (chunk) => chunks.push(chunk))
      doc.on("end", () => resolve(Buffer.concat(chunks)))

      // Purple gradient background
      doc.rect(50, 100, 500, 300)
      doc.fillColor("#667eea")
      doc.fill()

      // White border
      doc.lineWidth(2)
      doc.strokeColor("white")
      doc.rect(55, 105, 490, 290)
      doc.stroke()

      // Title
      doc.fillColor("white")
      doc.fontSize(24).font("Helvetica-Bold")
      doc.text("VOLUNTEER ID CARD", 60, 120, { width: 480, align: "center" })

      // Subtitle
      doc.fontSize(12)
      doc.text("Prayas by Aarya Foundation", 60, 150, { width: 480, align: "center" })

      // Profile picture placeholder or actual image
      if (volunteer.profilePicUrl) {
        try {
          doc.image(volunteer.profilePicUrl, 220, 170, { width: 100, height: 100 })
        } catch (e) {
          doc.rect(220, 170, 100, 100).stroke()
          doc.fontSize(10).text("Photo", 220, 210, { width: 100, align: "center" })
        }
      } else {
        doc.rect(220, 170, 100, 100).stroke()
        doc.fontSize(10).text("No Photo", 220, 210, { width: 100, align: "center" })
      }

      // Info section
      doc.fillColor("white")
      doc.fontSize(9).font("Helvetica-Bold")
      doc.text("VOLUNTEER ID", 70, 290)
      doc.fontSize(16).font("Helvetica-Bold")
      doc.text(volunteer.volunteerId, 70, 308)

      doc.fontSize(9).font("Helvetica-Bold").fillColor("white")
      doc.text("NAME", 70, 335)
      doc.fontSize(12).font("Helvetica-Bold")
      doc.text(volunteer.name, 70, 350)

      doc.fontSize(9).font("Helvetica-Bold").fillColor("rgba(255,255,255,0.8)")
      doc.text(`BLOOD GROUP: ${volunteer.bloodGroup} | PHONE: ${volunteer.mobile}`, 70, 375)

      doc.fontSize(9).fillColor("rgba(255,255,255,0.8)")
      doc.text(
        `MEMBERSHIP: ${volunteer.validity === "1year" ? "1 Year" : volunteer.validity === "3year" ? "3 Years" : "Lifetime"}`,
        70,
        395,
      )

      doc.fontSize(9).fillColor("rgba(255,255,255,0.7)")
      doc.text(`APPROVED: ${new Date(volunteer.approvalDate).toLocaleDateString("en-IN")}`, 70, 415)

      doc.end()
    } catch (error) {
      console.log("[v0] PDF generation error:", error)
      reject(error)
    }
  })
}

export async function generateCertificatePDF(volunteer) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        bufferPages: true,
      })

      const chunks = []
      doc.on("data", (chunk) => chunks.push(chunk))
      doc.on("end", () => resolve(Buffer.concat(chunks)))

      // Cream background
      doc.fillColor("#fffef5").rect(0, 0, 612, 792).fill()

      // Gold border
      doc.lineWidth(3)
      doc.strokeColor("#d4af37")
      doc.rect(40, 40, 532, 712)
      doc.stroke()

      // Inner gold border
      doc.lineWidth(1)
      doc.rect(50, 50, 512, 692)
      doc.stroke()

      // Header
      doc.fillColor("#8b7355").fontSize(11).font("Helvetica").text("✦ CERTIFICATE OF RECOGNITION ✦", 60, 80, {
        width: 492,
        align: "center",
        letterSpacing: 4,
      })

      // Main title
      doc.fontSize(40).font("Helvetica-Bold").fillColor("#1a1a1a").text("CERTIFICATE", 60, 130, {
        width: 492,
        align: "center",
      })

      // Decorative line
      doc.strokeColor("#d4af37").lineWidth(2)
      doc.moveTo(100, 190).lineTo(512, 190).stroke()

      // Main text
      doc
        .fontSize(14)
        .fillColor("#666")
        .font("Helvetica")
        .text("This is to certify that", 60, 220, { width: 492, align: "center" })

      // Volunteer name
      doc
        .fontSize(32)
        .font("Helvetica-Bold")
        .fillColor("#1a1a1a")
        .text(volunteer.name, 60, 260, { width: 492, align: "center", underline: true })

      // Recognition text
      doc
        .fontSize(13)
        .fillColor("#555")
        .font("Helvetica")
        .text(
          "has been recognized as a dedicated and committed\nVOLUNTEER\nof\nPrayas by Aarya Foundation\n\nfor their valuable contribution to the service of society",
          60,
          310,
          { width: 492, align: "center", lineGap: 5 },
        )

      // Details box
      doc.rect(70, 430, 472, 80).stroke()

      doc.fontSize(11).font("Helvetica-Bold").fillColor("#1a1a1a").text("Volunteer ID:", 80, 445)
      doc.fontSize(13).font("Helvetica-Bold").fillColor("#10b981").text(volunteer.volunteerId, 80, 462)

      doc
        .fontSize(11)
        .font("Helvetica-Bold")
        .fillColor("#1a1a1a")
        .text(
          `Membership: ${volunteer.validity === "1year" ? "1 Year" : volunteer.validity === "3year" ? "3 Years" : "Lifetime"}`,
          280,
          445,
        )

      doc.fontSize(11).font("Helvetica-Bold").fillColor("#1a1a1a").text("Date of Issue:", 80, 490)
      doc
        .fontSize(12)
        .font("Helvetica")
        .fillColor("#666")
        .text(
          new Date(volunteer.approvalDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          80,
          507,
        )

      // Footer
      doc.fontSize(13).font("Helvetica-Bold").fillColor("#1a1a1a").text("Issued by", 60, 550, {
        width: 492,
        align: "center",
      })

      doc.fontSize(16).font("Helvetica-Bold").text("PRAYAS BY AARYA FOUNDATION", 60, 570, {
        width: 492,
        align: "center",
        letterSpacing: 1,
      })

      doc.fontSize(11).fillColor("#999").text("Bringing positive change to society", 60, 595, {
        width: 492,
        align: "center",
      })

      // Bottom decorative line
      doc.strokeColor("#d4af37").lineWidth(2)
      doc.moveTo(100, 630).lineTo(512, 630).stroke()

      // Verification text
      doc
        .fontSize(10)
        .fillColor("#d4af37")
        .font("Helvetica-Bold")
        .text("◆ DIGITALLY VERIFIED & AUTHENTIC ◆", 60, 650, { width: 492, align: "center" })

      doc.end()
    } catch (error) {
      console.log("[v0] Certificate PDF generation error:", error)
      reject(error)
    }
  })
}
