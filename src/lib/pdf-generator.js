import { createRequire } from "module"
const require = createRequire(import.meta.url)

const PDFDocument = require("pdfkit")
const fs = require("fs")
const path = require("path")

function getFontPath() {
  const publicFont = path.join(process.cwd(), "public", "fonts", "arial.ttf")
  const systemFonts = [
    "C:/Windows/Fonts/arial.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/System/Library/Fonts/Arial.ttf",
  ]
  if (fs.existsSync(publicFont)) return publicFont
  for (const f of systemFonts) if (fs.existsSync(f)) return f
  return "Helvetica"
}

async function loadImageBuffer(imageUrl) {
  try {
    if (fs.existsSync(imageUrl)) return fs.readFileSync(imageUrl)
    if (imageUrl.startsWith("http")) {
      const res = await fetch(imageUrl)
      if (!res.ok) throw new Error("Image fetch failed")
      return Buffer.from(await res.arrayBuffer())
    }
    return null
  } catch (err) {
    console.warn("⚠️ Image load failed:", err.message)
    return null
  }
}

// ===================================================
// 🪪 PREMIUM VOLUNTEER ID CARD (ENHANCED UI/UX)
// ===================================================
export async function generateIDCardPDF(volunteer) {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: [400, 250],
        margin: 0,
        autoFirstPage: false,
        bufferPages: false,
      })

      const fontPath = getFontPath()
      doc.font(fontPath)

      const chunks = []
      doc.on("data", (chunk) => chunks.push(chunk))
      doc.on("end", () => {
        resolve(Buffer.concat(chunks))
      })
      doc.on("error", reject)

      doc.addPage({ size: [400, 250], margin: 0 })

      doc.rect(0, 0, 400, 85).fill("#1e40af")
      doc.rect(0, 85, 400, 85).fill("#6366f1")
      doc.rect(0, 170, 400, 80).fill("#3730a3")

      doc.lineWidth(4).strokeColor("#ffffff").rect(8, 8, 384, 234).stroke()
      doc.lineWidth(2).strokeColor("#c7d2fe").rect(11, 11, 378, 228).stroke()

      const logoPath = path.join(process.cwd(), "public", "logo.png")
      if (fs.existsSync(logoPath)) {
        try {
          doc.fillColor("#ffffff").circle(33, 33, 25).fill()
          doc.image(logoPath, 16, 16, { width: 34, height: 34 })
          // Gold accent ring
          doc.strokeColor("#fbbf24").lineWidth(1.2).circle(33, 33, 26).stroke()
          doc.strokeColor("#e0e7ff").lineWidth(0.8).circle(33, 33, 23).stroke()
        } catch (err) {
          console.warn("Logo loading failed:", err.message)
        }
      }

      doc
        .fillColor("white")
        .fontSize(17)
        .text("VOLUNTEER ID", 65, 16, { width: 320, align: "right" })
        .fontSize(8.5)
        .fillColor("#fef3c7")
        .text("Prayas by Aarya Foundation", 65, 38, { width: 320, align: "right" })

      const photoX = 150
      const photoY = 58
      const photoW = 90
      const photoH = 90
      const imgBuffer = volunteer.profilePicUrl ? await loadImageBuffer(volunteer.profilePicUrl) : null

      doc.circle(photoX + 45, photoY + 45, 50).fillAndStroke("#ffffff", "#ffffff")
      doc
        .circle(photoX + 45, photoY + 45, 50)
        .strokeColor("#fbbf24")
        .lineWidth(0.5)
        .stroke()

      if (imgBuffer) {
        try {
          doc.image(imgBuffer, photoX + 3, photoY + 3, {
            width: photoW - 6,
            height: photoH - 6,
          })
          doc
            .circle(photoX + 45, photoY + 45, 41)
            .strokeColor("#6366f1")
            .lineWidth(2.5)
            .stroke()
          doc
            .circle(photoX + 45, photoY + 45, 44)
            .strokeColor("#fbbf24")
            .lineWidth(1)
            .stroke()
        } catch {
          doc
            .rect(photoX + 3, photoY + 3, photoW - 6, photoH - 6)
            .fillColor("#f3f4f6")
            .fill()
          doc
            .fillColor("#9ca3af")
            .fontSize(7)
            .text("NO PHOTO", photoX + 3, photoY + 40, {
              width: photoW - 6,
              align: "center",
            })
        }
      } else {
        doc
          .rect(photoX + 3, photoY + 3, photoW - 6, photoH - 6)
          .fillColor("#f3f4f6")
          .fill()
        doc
          .fillColor("#9ca3af")
          .fontSize(7)
          .text("NO PHOTO", photoX + 3, photoY + 40, {
            width: photoW - 6,
            align: "center",
          })
      }

      const infoY = 162

      doc.fontSize(5.5).fillColor("#fef3c7").text("ID", 20, infoY)
      doc
        .fontSize(11.5)
        .fillColor("#ffffff")
        .text(volunteer.volunteerId || "N/A", 20, infoY + 8)

      doc
        .fontSize(5.5)
        .fillColor("#fef3c7")
        .text("NAME", 20, infoY + 25)
      doc
        .fontSize(9.5)
        .fillColor("#ffffff")
        .text((volunteer.name || "N/A").substring(0, 20), 20, infoY + 31)

      doc
        .fontSize(5.5)
        .fillColor("#bfdbfe")
        .text(`${volunteer.bloodGroup || "N/A"} • ${(volunteer.mobile || "N/A").substring(0, 10)}`, 20, infoY + 48)

      const membershipText = volunteer.validity === "1year" ? "1Y" : volunteer.validity === "3year" ? "3Y" : "LT"
      doc
        .fontSize(5.5)
        .fillColor("#bfdbfe")
        .text(`MEMBER: ${membershipText}`, 20, infoY + 57)

      doc
        .fontSize(5)
        .fillColor("#fbbf24")
        .text(
          `✓ ${volunteer.approvalDate ? new Date(volunteer.approvalDate).toLocaleDateString("en-US", { year: "2-digit", month: "2-digit", day: "2-digit" }) : "N/A"}`,
          20,
          infoY + 66,
        )

      if (volunteer.qrCodeUrl) {
        const qrBuffer = await loadImageBuffer(volunteer.qrCodeUrl)
        if (qrBuffer) {
          doc.fillColor("#ffffff").rect(308, 158, 78, 78).fill()
          doc.image(qrBuffer, 310, 160, { width: 74, height: 74 })
          doc.strokeColor("#fbbf24").lineWidth(1.8).rect(308, 158, 78, 78).stroke()
          doc.strokeColor("#6366f1").lineWidth(0.8).rect(308, 158, 78, 78).stroke()
        }
      }

      doc.lineWidth(1).strokeColor("#fbbf24").moveTo(10, 244).lineTo(390, 244).stroke()
      doc.lineWidth(0.5).strokeColor("#e0e7ff").moveTo(10, 245).lineTo(390, 245).stroke()

      doc.fontSize(4.5).fillColor("#fbbf24").text("✓ OFFICIAL CARD", 0, 239, {
        align: "center",
        width: 400,
      })

      doc.end()
    } catch (err) {
      console.error("[v0] ID Card PDF generation error:", err.message)
      reject(err)
    }
  })
}

// ===================================================
// 🎓 PREMIUM CERTIFICATE (ENHANCED UI/UX)
// ===================================================
export async function generateCertificatePDF(volunteer) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 40, bufferPages: true })
      const fontPath = getFontPath()
      doc.font(fontPath)

      const chunks = []
      doc.on("data", (chunk) => chunks.push(chunk))
      doc.on("end", () => resolve(Buffer.concat(chunks)))
      doc.on("error", reject)

      const pageWidth = doc.page.width
      const pageHeight = doc.page.height

      doc.fillColor("#fffdf9").rect(0, 0, pageWidth, pageHeight).fill()

      doc
        .lineWidth(5)
        .strokeColor("#daa520")
        .rect(35, 35, pageWidth - 70, pageHeight - 70)
        .stroke()
      doc
        .lineWidth(2)
        .strokeColor("#f0e68c")
        .rect(42, 42, pageWidth - 84, pageHeight - 84)
        .stroke()
      doc
        .lineWidth(1)
        .strokeColor("#daa520")
        .rect(48, 48, pageWidth - 96, pageHeight - 96)
        .stroke()

      doc
        .fontSize(9)
        .fillColor("#8b6914")
        .text("★ CERTIFICATE OF RECOGNITION ★", 60, 65, {
          width: pageWidth - 120,
          align: "center",
        })

      doc
        .fontSize(48)
        .fillColor("#1a1a1a")
        .text("CERTIFICATE", 60, 90, {
          width: pageWidth - 120,
          align: "center",
        })

      doc
        .strokeColor("#daa520")
        .lineWidth(3)
        .moveTo(80, 155)
        .lineTo(pageWidth - 80, 155)
        .stroke()
      doc
        .strokeColor("#f0e68c")
        .lineWidth(1)
        .moveTo(80, 160)
        .lineTo(pageWidth - 80, 160)
        .stroke()

      doc
        .fontSize(14)
        .fillColor("#2d2d2d")
        .text("This is to certify that", 60, 175, {
          width: pageWidth - 120,
          align: "center",
        })

      doc
        .fontSize(36)
        .fillColor("#1a1a1a")
        .text(volunteer.name || "", 60, 205, {
          width: pageWidth - 120,
          align: "center",
        })

      doc
        .strokeColor("#1a1a1a")
        .lineWidth(2)
        .moveTo(100, 250)
        .lineTo(pageWidth - 100, 250)
        .stroke()

      doc
        .fontSize(12)
        .fillColor("#404040")
        .text("has been recognized as a dedicated and committed", 60, 265, {
          width: pageWidth - 120,
          align: "center",
        })

      doc
        .fontSize(15)
        .fillColor("#4f46e5")
        .text("VOLUNTEER", 60, 290, {
          width: pageWidth - 120,
          align: "center",
        })

      doc
        .fontSize(12)
        .fillColor("#404040")
        .text("of", 60, 310, {
          width: pageWidth - 120,
          align: "center",
        })

      doc
        .fontSize(14)
        .fillColor("#4f46e5")
        .text("Prayas by Aarya Foundation", 60, 330, {
          width: pageWidth - 120,
          align: "center",
        })

      doc
        .fontSize(11)
        .fillColor("#555555")
        .text("for their valuable contribution to the service of society", 60, 355, {
          width: pageWidth - 120,
          align: "center",
        })

      doc
        .lineWidth(2)
        .strokeColor("#daa520")
        .rect(70, 385, pageWidth - 140, 70)
        .stroke()
      doc
        .fillColor("#fffdf9")
        .rect(71, 386, pageWidth - 142, 68)
        .fill()

      doc
        .fontSize(9)
        .fillColor("#1a1a1a")
        .text("Volunteer ID: " + (volunteer.volunteerId || ""), 85, 397)

      const membershipText =
        volunteer.validity === "1year" ? "1 Year" : volunteer.validity === "3year" ? "3 Years" : "Lifetime"

      doc.fontSize(9).text(`Membership: ${membershipText}`, 85, 415)
      doc.fontSize(9).text(
        `Date of Issue: ${volunteer.approvalDate
          ? new Date(volunteer.approvalDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
          : ""
        }`,
        85,
        433,
      )

      doc
        .fontSize(12)
        .fillColor("#1a1a1a")
        .text("Issued by", 60, 485, {
          width: pageWidth - 120,
          align: "center",
        })

      doc.fontSize(14).text("PRAYAS BY AARYA FOUNDATION", 60, 510, {
        width: pageWidth - 120,
        align: "center",
      })

      doc
        .fontSize(10)
        .fillColor("#666666")
        .text("Bringing positive change to society", 60, 532, {
          width: pageWidth - 120,
          align: "center",
        })

      doc
        .strokeColor("#daa520")
        .lineWidth(2)
        .moveTo(80, 565)
        .lineTo(pageWidth - 80, 565)
        .stroke()

      doc
        .fontSize(9)
        .fillColor("#daa520")
        .text("◆ DIGITALLY VERIFIED & AUTHENTIC ◆", 60, 580, {
          width: pageWidth - 120,
          align: "center",
        })

      doc.end()
    } catch (err) {
      console.error("[v0] Certificate PDF generation error:", err.message)
      reject(err)
    }
  })
}

/**
 * generateReceiptPDF
 * @param {Object} donation - { merchantOrderId, donorName, donorEmail, donorPhone, amount, createdAt }
 * @returns {Promise<Buffer>}
 */
export async function generateReceiptPDF(donation = {}) {
  return new Promise((resolve, reject) => {
    try {
      const {
        merchantOrderId,
        donorName = "Donor",
        donorEmail = "",
        donorPhone = "",
        amount = 0,
        createdAt = new Date(),
      } = donation;

      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const chunks = [];
      doc.on("data", (c) => chunks.push(c));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      // Header
      doc.fontSize(20).text("Prayas by Aarya Foundation", { align: "center" });
      doc.moveDown(0.3);
      doc.fontSize(12).text("Donation Receipt", { align: "center", underline: true });
      doc.moveDown(1);

      // Info
      doc.fontSize(10).fillColor("#333");
      doc.text(`Receipt No: ${merchantOrderId}`, { continued: true }).moveDown(0.3);
      doc.text(`Date: ${new Date(createdAt).toLocaleString("en-IN")}`);
      doc.moveDown(0.8);

      // Donor details
      doc.fontSize(11).text("Donor Details", { underline: true });
      doc.moveDown(0.3);
      doc.fontSize(10);
      doc.text(`Name: ${donorName}`);
      doc.text(`Email: ${donorEmail || "-"}`);
      doc.text(`Phone: ${donorPhone || "-"}`);
      doc.moveDown(0.8);

      // Payment summary
      doc.fontSize(11).text("Payment Summary", { underline: true });
      doc.moveDown(0.3);
      doc.fontSize(12).text(`Amount Paid: ₹${Number(amount).toLocaleString("en-IN")}`, { bold: true });
      doc.moveDown(0.8);

      // Body message
      doc.fontSize(10).text(
        "Thank you for your generous donation. Your support helps Prayas by Aarya Foundation continue its work to empower communities and bring positive change.",
        { align: "left", lineGap: 4 }
      );

      doc.moveDown(2);

      // Footer / Tax note
      doc.rect(doc.x, doc.y, 480, 60).stroke();
      doc.moveDown(0.3);
      doc.fontSize(9).text("This receipt is computer generated and valid for accounting purposes.", { lineGap: 3 });
      doc.moveDown(0.3);
      doc.fontSize(9).text("If eligible, this donation may be claimed under Section 80G of the Income Tax Act.", { lineGap: 3 });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

export { PDFDocument, fs, path }
