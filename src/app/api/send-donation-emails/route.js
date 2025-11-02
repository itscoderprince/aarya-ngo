import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import {
  generateDonorEmailTemplate,
  generateAdminEmailTemplate,
  emailConfig
} from "../../../lib/email-templates";

export async function POST(request) {
  try {
    const { donorDetails, transactionDetails } = await request.json();

    if (!donorDetails?.email) {
      return NextResponse.json(
        { success: false, message: "Donor email missing" },
        { status: 400 }
      );
    }

    const { name, email, amount } = donorDetails;
    const { transactionId, status, paymentMethod } = transactionDetails;

    // ✅ Setup SMTP Transporter
    const transporter = nodemailer.createTransport({
      ...emailConfig,
      auth: {
        user: process.env.EMAIL_USER || emailConfig.auth.user,
        pass: process.env.EMAIL_PASSWORD || emailConfig.auth.pass,
      },
    });

    // ✅ Donor Email
    const donorMail = {
      from: `"Prayas by Aarya Foundation" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🙏 Thank you for your donation!",
      html: generateDonorEmailTemplate(donorDetails, transactionDetails),
    };

    // ✅ Admin Notification Email
    const adminMail = {
      from: `"Donation Alert" <${process.env.EMAIL_USER}>`,
      to: "prayasbyaaryafoundation@gmail.com",
      subject: `New Donation ₹${amount.toLocaleString()} – ${name}`,
      html: generateAdminEmailTemplate(donorDetails, transactionDetails),
    };

    // ✅ Send Emails Parallelly
    await Promise.all([
      transporter.sendMail(donorMail),
      transporter.sendMail(adminMail),
    ]);

    return NextResponse.json({
      success: true,
      message: "Emails sent successfully ✅",
    });
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to send emails",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
