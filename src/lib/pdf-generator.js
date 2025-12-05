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

      // Background Colors
      doc.rect(0, 0, 400, 250).fill("#ffffff")

      // Header Background (Navy)
      doc.rect(0, 0, 400, 80).fill("#022741")

      // Accent Stripe (Yellow)
      doc.rect(0, 76, 400, 4).fill("#FFB70B")

      // Logo
      const logoPath = path.join(process.cwd(), "public", "logo.jpg") // Changed to .jpg as per user's previous fix
      if (fs.existsSync(logoPath)) {
        try {
          doc.save()
          doc.circle(45, 40, 28).clip()
          doc.image(logoPath, 17, 12, { width: 56, height: 56 })
          doc.restore()
          // Border for logo
          doc.circle(45, 40, 28).lineWidth(2).strokeColor("#ffffff").stroke()
        } catch (err) {
          console.warn("Logo loading failed:", err.message)
        }
      }

      // Header Text
      doc
        .fillColor("#ffffff")
        .fontSize(16)
        .font("Helvetica-Bold")
        .text("VOLUNTEER", 90, 25, { width: 290, align: "right" })
        .fontSize(9)
        .font("Helvetica")
        .fillColor("#FFB70B")
        .text("PRAYAS BY AARYA FOUNDATION", 90, 45, { width: 290, align: "right" })

      // Photo Section
      const photoX = 25
      const photoY = 100
      const photoSize = 90
      const imgBuffer = volunteer.profilePicUrl ? await loadImageBuffer(volunteer.profilePicUrl) : null

      // Photo Background/Border
      doc.circle(photoX + 45, photoY + 45, 48).lineWidth(1).strokeColor("#022741").stroke()

      if (imgBuffer) {
        try {
          doc.save()
          doc.circle(photoX + 45, photoY + 45, 45).clip()
          doc.image(imgBuffer, photoX, photoY, { width: photoSize, height: photoSize })
          doc.restore()
        } catch {
          drawNoPhoto(doc, photoX, photoY, photoSize)
        }
      } else {
        drawNoPhoto(doc, photoX, photoY, photoSize)
      }

      // Details Section
      const infoX = 135
      const infoY = 100
      const lineHeight = 28

      // Name
      doc
        .fontSize(14)
        .font("Helvetica-Bold")
        .fillColor("#022741")
        .text(volunteer.name || "N/A", infoX, infoY)

      // ID
      doc
        .fontSize(9)
        .font("Helvetica")
        .fillColor("#666666")
        .text("ID:", infoX, infoY + 22)
        .font("Helvetica-Bold")
        .fillColor("#000000")
        .text(volunteer.volunteerId || "N/A", infoX + 20, infoY + 22)

      // Role & Blood Group
      doc
        .fontSize(9)
        .font("Helvetica")
        .fillColor("#666666")
        .text("Role:", infoX, infoY + 38)
        .font("Helvetica-Bold")
        .fillColor("#000000")
        .text(volunteer.volunteerType || "Volunteer", infoX + 30, infoY + 38)

      if (volunteer.bloodGroup) {
        doc
          .font("Helvetica")
          .fillColor("#666666")
          .text("Blood Group:", infoX, infoY + 54)
          .font("Helvetica-Bold")
          .fillColor("#d90429") // Red for blood group
          .text(volunteer.bloodGroup, infoX + 60, infoY + 54)
      }

      // QR Code
      if (volunteer.qrCodeUrl) {
        const qrBuffer = await loadImageBuffer(volunteer.qrCodeUrl)
        if (qrBuffer) {
          doc.image(qrBuffer, 310, 150, { width: 70, height: 70 })
        }
      }

      // Footer
      doc.rect(0, 230, 400, 20).fill("#F0F4F8")
      doc
        .fontSize(7)
        .font("Helvetica")
        .fillColor("#022741")
        .text("www.aaryafoundation.org", 20, 236, { align: "left" })
        .text("Valid Everywhere", 0, 236, { align: "right", width: 380 })

      doc.end()
    } catch (err) {
      console.error("[v0] ID Card PDF generation error:", err.message)
      reject(err)
    }
  })
}

function drawNoPhoto(doc, x, y, size) {
  doc.save()
  doc.circle(x + 45, y + 45, 45).clip()
  doc.rect(x, y, size, size).fill("#F0F4F8")
  doc.fillColor("#94a3b8").fontSize(8).text("NO PHOTO", x, y + 40, { width: size, align: "center" })
  doc.restore()
}

// ===================================================
// 🎓 PREMIUM CERTIFICATE (ENHANCED UI/UX)
// ===================================================
export async function generateCertificatePDF(volunteer) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 0, bufferPages: true, layout: "landscape" })
      const fontPath = getFontPath()
      doc.font(fontPath)

      const chunks = []
      doc.on("data", (chunk) => chunks.push(chunk))
      doc.on("end", () => resolve(Buffer.concat(chunks)))
      doc.on("error", reject)

      const w = doc.page.width
      const h = doc.page.height

      // Background
      doc.rect(0, 0, w, h).fill("#ffffff")

      // Border Design
      const margin = 20
      doc.lineWidth(2).strokeColor("#022741").rect(margin, margin, w - margin * 2, h - margin * 2).stroke()
      doc.lineWidth(10).strokeColor("#FFB70B").rect(margin + 5, margin + 5, w - (margin + 5) * 2, h - (margin + 5) * 2).stroke()

      // Corner Ornaments (Simple)
      doc.save()
      doc.translate(margin, margin)
      doc.moveTo(0, 0).lineTo(50, 0).lineTo(0, 50).fill("#022741")
      doc.restore()

      doc.save()
      doc.translate(w - margin, h - margin)
      doc.rotate(180)
      doc.moveTo(0, 0).lineTo(50, 0).lineTo(0, 50).fill("#022741")
      doc.restore()

      // Header
      doc.moveDown(2)
      doc
        .font("Helvetica-Bold")
        .fontSize(40)
        .fillColor("#022741")
        .text("CERTIFICATE", 0, 100, { align: "center", characterSpacing: 5 })
        .fontSize(14)
        .fillColor("#FFB70B")
        .text("OF APPRECIATION", 0, 150, { align: "center", characterSpacing: 3 })

      // Content
      doc.moveDown(2)
      doc
        .font("Helvetica")
        .fontSize(14)
        .fillColor("#666666")
        .text("This certificate is proudly presented to", 0, 200, { align: "center" })

      // Name
      doc.moveDown(1)
      doc
        .font("Helvetica-Bold")
        .fontSize(32)
        .fillColor("#022741")
        .text(volunteer.name || "Volunteer", 0, 230, { align: "center" })

      // Underline Name
      const nameWidth = doc.widthOfString(volunteer.name || "Volunteer")
      doc.lineWidth(1).strokeColor("#FFB70B").moveTo((w - nameWidth) / 2 - 20, 270).lineTo((w + nameWidth) / 2 + 20, 270).stroke()

      // Description
      doc.moveDown(1)
      doc
        .font("Helvetica")
        .fontSize(14)
        .fillColor("#444444")
        .text(
          "In recognition of your dedication and commitment as a volunteer for Prayas by Aarya Foundation. Your contribution creates a lasting impact on society.",
          100,
          300,
          { align: "center", width: w - 200, lineGap: 6 }
        )

      // Details
      doc.moveDown(2)
      const dateStr = volunteer.approvalDate
        ? new Date(volunteer.approvalDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
        : new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })

      doc
        .fontSize(12)
        .fillColor("#666666")
        .text(`Awarded on ${dateStr}`, 0, 380, { align: "center" })

      // Signatures
      const sigY = 450

      // Left Signature
      doc.lineWidth(1).strokeColor("#000000").moveTo(150, sigY).lineTo(300, sigY).stroke()
      doc.fontSize(12).fillColor("#022741").text("Director", 150, sigY + 10, { width: 150, align: "center" })

      // Right Signature
      doc.lineWidth(1).strokeColor("#000000").moveTo(w - 300, sigY).lineTo(w - 150, sigY).stroke()
      doc.fontSize(12).fillColor("#022741").text("Coordinator", w - 300, sigY + 10, { width: 150, align: "center" })

      // Logo at bottom
      const logoPath = path.join(process.cwd(), "public", "logo.jpg")
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, w / 2 - 30, h - 100, { width: 60, height: 60 })
      }

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

      // Header Background
      doc.rect(0, 0, 600, 120).fill("#022741")

      // Logo
      const logoPath = path.join(process.cwd(), "public", "logo.jpg")
      if (fs.existsSync(logoPath)) {
        doc.save()
        doc.circle(60, 60, 30).clip()
        doc.image(logoPath, 30, 30, { width: 60, height: 60 })
        doc.restore()
      }

      // Header Text
      doc
        .fillColor("#ffffff")
        .fontSize(24)
        .font("Helvetica-Bold")
        .text("DONATION RECEIPT", 0, 45, { align: "center" })
        .fontSize(10)
        .font("Helvetica")
        .fillColor("#FFB70B")
        .text("PRAYAS BY AARYA FOUNDATION", 0, 75, { align: "center" })

      // Receipt Info Box
      doc.moveDown(5)
      const startY = 150

      // Left Side: Donor Info
      doc.fillColor("#022741").fontSize(12).font("Helvetica-Bold").text("Received From:", 50, startY)
      doc.font("Helvetica").fontSize(11).fillColor("#333333").moveDown(0.5)
      doc.text(donorName)
      if (donorEmail) doc.text(donorEmail)
      if (donorPhone) doc.text(donorPhone)

      // Right Side: Receipt Details
      doc.fillColor("#022741").fontSize(12).font("Helvetica-Bold").text("Receipt Details:", 350, startY)
      doc.font("Helvetica").fontSize(11).fillColor("#333333").moveDown(0.5)
      doc.text(`Receipt No: ${merchantOrderId}`, 350)
      doc.text(`Date: ${new Date(createdAt).toLocaleDateString("en-IN")}`, 350)
      doc.text(`Status: Paid`, 350)

      // Amount Box
      doc.rect(50, 260, 495, 60).fill("#F0F4F8")
      doc.fillColor("#022741").fontSize(14).font("Helvetica-Bold").text("Amount Received", 70, 275)
      doc.fillColor("#022741").fontSize(20).text(`₹${Number(amount).toLocaleString("en-IN")}`, 400, 272, { align: "right", width: 120 })

      // Thank You Note
      doc.moveDown(4)
      doc
        .fontSize(11)
        .font("Helvetica-Oblique")
        .fillColor("#555555")
        .text(
          "Thank you for your generous contribution. Your support empowers us to bring positive change to the lives of many.",
          50,
          350,
          { align: "center", width: 495 }
        )

      // Footer / Tax Note
      const footerY = 700
      doc.lineWidth(1).strokeColor("#e2e8f0").moveTo(50, footerY).lineTo(545, footerY).stroke()

      doc
        .fontSize(9)
        .font("Helvetica")
        .fillColor("#666666")
        .text("This receipt is computer generated and valid for accounting purposes.", 50, footerY + 15, { align: "center" })
        .text("Donations are eligible for tax exemption under Section 80G of the Income Tax Act.", 50, footerY + 30, { align: "center" })

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

export { PDFDocument, fs, path }
