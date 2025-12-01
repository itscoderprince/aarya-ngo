/**
 * Email sender wrapper for donation receipts
 * Uses nodemailer with the mailer configuration
 */
import nodemailer from "nodemailer";
import { generateDonorEmailTemplate, generateAdminEmailTemplate, emailConfig } from "./email-templates";

/**
 * SEND EMAIL TO DONOR WITH PDF RECEIPT
 */
export async function sendDonorEmail(donation, pdfUrl, pdfBuffer) {
  try {
    // If no email, skip sending and log it
    if (!donation.donorEmail) {
      console.log("⏩ Skipping donor email: No email address provided for this donation.");
      return true;
    }

    const transporter = nodemailer.createTransport(emailConfig);

    const donorDetails = {
      name: donation.donorName,
      phone: donation.donorPhone,
      pan: donation.pan,
      amount: donation.amount,
    };

    const transactionDetails = {
      transactionId: donation.merchantOrderId,
    };

    const mailOptions = {
      from: `Prayas by Aarya Foundation <${process.env.EMAIL_USER}>`,
      to: donation.donorEmail,
      subject: "Your Donation Receipt - Prayas by Aarya Foundation",
      html: generateDonorEmailTemplate(donorDetails, transactionDetails),
    };

    // If PDF URL is provided, add it as a link in the email
    if (pdfUrl) {
      const updatedHtml = mailOptions.html.replace(
        "<!-- PDF_LINK_PLACEHOLDER -->",
        `<p style="text-align: center; margin-top: 20px;">
          <a href="${pdfUrl}" style="background: #FCD34D; color: black; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">Download Receipt PDF</a>
        </p>`
      );
      mailOptions.html = updatedHtml;
    }

    // If PDF buffer provided, attach it to the email as well (fallback for clients)
    if (pdfBuffer && Buffer.isBuffer(pdfBuffer)) {
      mailOptions.attachments = mailOptions.attachments || [];
      mailOptions.attachments.push({
        filename: `Donation_Receipt_${donation.receiptNumber || donation.merchantOrderId}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      });
    }

    const result = await transporter.sendMail(mailOptions);

    console.log("✅ Donor Email Sent:", donation.donorEmail);
    return true;
  } catch (error) {
    console.error("❌ Error sending donor email:", error);
    throw error;
  }
}

/**
 * SEND EMAIL TO ADMIN (WITH DONATION DETAILS)
 */
export async function sendAdminEmail(donation, pdfUrl) {
  try {
    const transporter = nodemailer.createTransport(emailConfig);

    const donorDetails = {
      name: donation.donorName,
      email: donation.donorEmail,
      phone: donation.donorPhone,
      pan: donation.pan,
      amount: donation.amount,
    };

    const transactionDetails = {
      transactionId: donation.merchantOrderId,
      status: donation.status,
    };

    const mailOptions = {
      from: `Donation Bot <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "🎉 New Donation Received - Prayas by Aarya Foundation",
      html: generateAdminEmailTemplate(donorDetails, transactionDetails),
    };

    // If PDF URL is provided, add it as a link
    if (pdfUrl) {
      const updatedHtml = mailOptions.html.replace(
        "<!-- PDF_LINK_PLACEHOLDER -->",
        `<p><strong>Receipt PDF:</strong> <a href="${pdfUrl}">View/Download</a></p>`
      );
      mailOptions.html = updatedHtml;
    }

    const result = await transporter.sendMail(mailOptions);

    console.log("✅ Admin Email Sent");
    return true;
  } catch (error) {
    console.error("❌ Error sending admin email:", error);
    throw error;
  }
}

/**
 * SEND WELCOME EMAIL TO VOLUNTEER (WITH ID CARD & CERTIFICATE)
 */
export async function sendVolunteerEmail(volunteer, idCardBuffer, certificateBuffer) {
  try {
    if (!volunteer.email) return false;

    const transporter = nodemailer.createTransport(emailConfig);
    const { generateVolunteerEmailTemplate } = await import("./email-templates");

    const mailOptions = {
      from: `Prayas by Aarya Foundation <${process.env.EMAIL_USER}>`,
      to: volunteer.email,
      subject: "🎉 Welcome to the Team! - Volunteer Application Approved",
      html: generateVolunteerEmailTemplate(volunteer),
      attachments: []
    };

    // Attach ID Card
    if (idCardBuffer) {
      mailOptions.attachments.push({
        filename: `Volunteer_ID_${volunteer.volunteerId}.pdf`,
        content: idCardBuffer,
        contentType: "application/pdf",
      });
    }

    // Attach Certificate
    if (certificateBuffer) {
      mailOptions.attachments.push({
        filename: `Certificate_${volunteer.volunteerId}.pdf`,
        content: certificateBuffer,
        contentType: "application/pdf",
      });
    }

    await transporter.sendMail(mailOptions);
    console.log("✅ Volunteer Welcome Email Sent:", volunteer.email);
    return true;

  } catch (error) {
    console.error("❌ Error sending volunteer email:", error);
    // Don't throw, just log, so we don't break the response
    return false;
  }
}

/**
 * SEND NOTIFICATION TO ADMIN ABOUT NEW VOLUNTEER
 */
export async function sendVolunteerAdminEmail(volunteer) {
  try {
    const transporter = nodemailer.createTransport(emailConfig);

    const mailOptions = {
      from: `Volunteer System <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "🎉 New Volunteer Registration",
      html: `
        <h2>New Volunteer Registered</h2>
        <p><strong>Name:</strong> ${volunteer.name}</p>
        <p><strong>Email:</strong> ${volunteer.email}</p>
        <p><strong>Phone:</strong> ${volunteer.mobile}</p>
        <p><strong>Type:</strong> ${volunteer.volunteerType}</p>
        <p><strong>Status:</strong> ${volunteer.status}</p>
        <p><strong>Transaction ID:</strong> ${volunteer.merchantOrderId}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Admin Notification Sent");
    return true;
  } catch (error) {
    console.error("❌ Error sending admin notification:", error);
    return false;
  }
}
