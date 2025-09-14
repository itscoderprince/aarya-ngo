import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { generateDonorEmailTemplate, generateAdminEmailTemplate, emailConfig } from "../../../lib/email-templates"

const transporter = nodemailer.createTransporter(emailConfig)

export async function POST(request) {
  try {
    const { donorDetails, transactionDetails } = await request.json()
    const { name, email, phone, pan, amount } = donorDetails
    const { transactionId, status, paymentMethod } = transactionDetails

    // Send confirmation email to donor
    const userEmailOptions = {
      from: "prayasbyaaryafoundation@gmail.com",
      to: email,
      subject: "Thank you for your donation - Prayas by Aarya Foundation",
      html: generateDonorEmailTemplate(donorDetails, transactionDetails),
    }

    // Send notification email to admin
    const adminEmailOptions = {
      from: "prayasbyaaryafoundation@gmail.com",
      to: "prayasbyaaryafoundation@gmail.com",
      subject: `New Donation Received - ₹${amount.toLocaleString()} from ${name}`,
      html: generateAdminEmailTemplate(donorDetails, transactionDetails),
    }

    // Send both emails
    await Promise.all([transporter.sendMail(userEmailOptions), transporter.sendMail(adminEmailOptions)])

    return NextResponse.json({
      success: true,
      message: "Emails sent successfully",
    })
  } catch (error) {
    console.error("Email sending error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to send emails",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
