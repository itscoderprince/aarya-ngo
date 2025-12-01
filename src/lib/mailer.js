import nodemailer from "nodemailer"
import { generateIDCardPDF, generateCertificatePDF } from "./pdf-generator"
import {
  generateDonorEmailTemplate,
  generateAdminEmailTemplate,
  emailConfig,
} from "./email-templates";

// Create transporter with Gmail configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

async function getPDFAttachments(volunteer) {
  try {
    const [idCardPDF, certificatePDF] = await Promise.all([
      generateIDCardPDF(volunteer),
      generateCertificatePDF(volunteer),
    ])

    return [
      {
        filename: `${volunteer.volunteerId}_ID_Card.pdf`,
        content: idCardPDF,
        contentType: "application/pdf",
      },
      {
        filename: `${volunteer.volunteerId}_Certificate.pdf`,
        content: certificatePDF,
        contentType: "application/pdf",
      },
    ]
  } catch (error) {
    console.log("[v0] Error generating PDF attachments:", error.message)
    return []
  }
}

// Generate HTML for ID Card
function generateIDCardHTML(volunteer) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 15px; padding: 20px; color: white; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
      <div style="text-align: center; border-bottom: 2px solid rgba(255,255,255,0.3); padding-bottom: 15px; margin-bottom: 20px;">
        <h2 style="margin: 0; font-size: 24px; font-weight: bold;">VOLUNTEER ID CARD</h2>
        <p style="margin: 5px 0; font-size: 12px; opacity: 0.9;">Prayas by Aarya Foundation</p>
      </div>
      
      <div style="text-align: center; margin-bottom: 20px;">
        ${volunteer.profilePicUrl ? `<img src="${volunteer.profilePicUrl}" alt="Profile" style="width: 100px; height: 100px; border-radius: 50%; border: 3px solid white; object-fit: cover;">` : '<div style="width: 100px; height: 100px; margin: 0 auto; background: rgba(255,255,255,0.3); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px;">No Photo</div>'}
      </div>

      <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px; margin-bottom: 15px;">
        <div style="margin-bottom: 10px;">
          <p style="margin: 0; font-size: 11px; opacity: 0.8; font-weight: bold;">VOLUNTEER ID</p>
          <p style="margin: 5px 0; font-size: 18px; font-weight: bold; letter-spacing: 1px;">${volunteer.volunteerId}</p>
        </div>
        
        <div style="margin-bottom: 10px;">
          <p style="margin: 0; font-size: 11px; opacity: 0.8; font-weight: bold;">NAME</p>
          <p style="margin: 5px 0; font-size: 16px; font-weight: bold;">${volunteer.name}</p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 10px;">
          <div>
            <p style="margin: 0; font-size: 11px; opacity: 0.8; font-weight: bold;">BLOOD GROUP</p>
            <p style="margin: 5px 0; font-size: 14px; font-weight: bold;">${volunteer.bloodGroup}</p>
          </div>
          <div>
            <p style="margin: 0; font-size: 11px; opacity: 0.8; font-weight: bold;">PHONE</p>
            <p style="margin: 5px 0; font-size: 14px; font-weight: bold;">${volunteer.mobile}</p>
          </div>
        </div>

        <div style="margin-bottom: 10px;">
          <p style="margin: 0; font-size: 11px; opacity: 0.8; font-weight: bold;">MEMBERSHIP</p>
          <p style="margin: 5px 0; font-size: 14px; font-weight: bold;">${volunteer.validity === "1year" ? "1 Year" : volunteer.validity === "3year" ? "3 Years" : "Lifetime"}</p>
        </div>

        <div>
          <p style="margin: 0; font-size: 11px; opacity: 0.8; font-weight: bold;">APPROVED DATE</p>
          <p style="margin: 5px 0; font-size: 14px; font-weight: bold;">${new Date(volunteer.approvalDate).toLocaleDateString("en-IN")}</p>
        </div>
      </div>

      <div style="text-align: center; font-size: 10px; opacity: 0.7;">
        <p style="margin: 0;">Valid ID • Authorized by Prayas by Aarya Foundation</p>
      </div>
    </div>
  `
}

// Generate HTML for Certificate
function generateCertificateHTML(volunteer) {
  return `
    <div style="font-family: 'Georgia', serif; max-width: 650px; margin: 0 auto; background: linear-gradient(to bottom, #fff8f0 0%, #fffef5 100%); border: 4px solid #d4af37; border-radius: 15px; padding: 50px 40px; text-align: center; box-shadow: 0 15px 50px rgba(212, 175, 55, 0.4);">
      <div style="font-size: 13px; color: #8b7355; letter-spacing: 4px; margin-bottom: 15px; font-weight: bold;">✦ CERTIFICATE OF RECOGNITION ✦</div>
      
      <h1 style="font-size: 42px; color: #1a1a1a; margin: 15px 0; font-weight: bold; letter-spacing: 3px;">CERTIFICATE</h1>
      
      <div style="height: 3px; background: linear-gradient(to right, transparent, #d4af37, transparent); margin: 25px 0;"></div>

      <p style="font-size: 15px; color: #666; margin: 25px 0; font-style: italic;">This is to certify that</p>
      
      <h2 style="font-size: 36px; color: #1a1a1a; margin: 20px 0; text-decoration: underline; text-decoration-thickness: 2px;">${volunteer.name}</h2>
      
      <p style="font-size: 15px; color: #555; margin: 25px 0; line-height: 1.9;">
        has been recognized as a dedicated and committed<br>
        <strong style="color: #1a1a1a; font-size: 18px;">VOLUNTEER</strong><br>
        of<br>
        <strong style="color: #667eea; font-size: 17px;">Prayas by Aarya Foundation</strong><br>
        for their valuable contribution to the service of society
      </p>

      <div style="background: rgba(212, 175, 55, 0.12); padding: 25px; border-radius: 10px; margin: 30px 0; border: 2px dashed #d4af37;">
        <p style="font-size: 13px; color: #555; margin: 8px 0; line-height: 1.8;">
          <strong style="color: #1a1a1a;">Volunteer ID:</strong> ${volunteer.volunteerId}<br>
          <strong style="color: #1a1a1a;">Membership Type:</strong> ${volunteer.validity === "1year" ? "1 Year" : volunteer.validity === "3year" ? "3 Years" : "Lifetime"}<br>
          <strong style="color: #1a1a1a;">Date of Issue:</strong> ${new Date(volunteer.approvalDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      <div style="margin-top: 40px;">
        <p style="font-size: 13px; color: #999; margin: 10px 0; font-style: italic;">Issued by</p>
        <p style="font-size: 18px; color: #1a1a1a; font-weight: bold; margin: 0; letter-spacing: 1px;">PRAYAS BY AARYA FOUNDATION</p>
        <p style="font-size: 11px; color: #999; margin: 5px 0;">Bringing positive change to society</p>
      </div>

      <div style="height: 2px; background: #d4af37; margin: 25px 0;"></div>
      <p style="font-size: 12px; color: #d4af37; margin: 0; font-weight: bold;">◆ DIGITALLY VERIFIED & AUTHENTIC ◆</p>
    </div>
  `
}

// Send confirmation email when volunteer applies
export async function sendConfirmationEmail(email, name) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Volunteer Application Received - Prayas by Aarya Foundation",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px; border-radius: 10px;">
          <div style="background: white; padding: 30px; border-radius: 8px; border-left: 4px solid #667eea;">
            <h2 style="color: #667eea; margin-top: 0;">Thank You for Applying!</h2>
            <p style="color: #333; line-height: 1.6;">Dear <strong>${name}</strong>,</p>
            <p style="color: #555; line-height: 1.6;">We have received your volunteer application and sincerely appreciate your interest in joining <strong>Prayas by Aarya Foundation</strong>.</p>
            
            <div style="background: #f0f4ff; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 3px solid #667eea;">
              <p style="color: #1a1a1a; margin: 0; font-weight: bold;">What's Next?</p>
              <p style="color: #555; margin: 8px 0; font-size: 14px;">Our admin team will review your application and verify your details and payment within 2-3 business days. Once approved, you'll receive your Volunteer ID and Certificate via email.</p>
            </div>

            <p style="color: #666; line-height: 1.6; margin: 20px 0;">Thank you for your dedication to serve the community and make a difference!</p>
            
            <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 15px;">
              <strong>Prayas by Aarya Foundation</strong><br>
              Bringing positive change to society<br>
              <em>Your submission ID: ${Date.now()}</em>
            </p>
          </div>
        </div>
      `,
    })
    console.log("[v0] Confirmation email sent to", email)
  } catch (error) {
    console.log("[v0] Error sending confirmation email:", error.message)
  }
}

// Send approval email
export async function sendApprovalEmail(email, volunteer) {
  try {
    const attachments = await getPDFAttachments(volunteer)

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "🎉 Congratulations! Your Volunteer Application is Approved - Prayas by Aarya Foundation",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; color: white; text-align: center;">
            <h2 style="margin: 0; font-size: 32px; font-weight: bold;">Congratulations!</h2>
            <p style="margin: 10px 0; opacity: 0.9;">You're Now an Official Volunteer</p>
          </div>

          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="color: #333; line-height: 1.6;">Dear <strong>${volunteer.name}</strong>,</p>
            <p style="color: #555; line-height: 1.6;">Great news! Your volunteer application has been <strong style="color: #10b981;">APPROVED</strong> by our admin team. Welcome to the <strong>Prayas by Aarya Foundation</strong> family!</p>
            
            <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <p style="margin: 0; color: #065f46; font-weight: bold; font-size: 16px;">Your Volunteer ID: <span style="color: #10b981; font-size: 18px;">${volunteer.volunteerId}</span></p>
              <p style="margin: 5px 0; color: #059669; font-size: 13px;">Please save this ID for future reference. Your ID Card and Certificate are attached as PDF files.</p>
            </div>

            <h3 style="color: #1a1a1a; margin-top: 30px; margin-bottom: 15px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Your Volunteer ID Card</h3>
            ${generateIDCardHTML(volunteer)}

            <h3 style="color: #1a1a1a; margin-top: 35px; margin-bottom: 15px; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">Your Certificate of Recognition</h3>
            ${generateCertificateHTML(volunteer)}

            <p style="margin-top: 30px; color: #666; line-height: 1.6; background: #fff3cd; padding: 15px; border-radius: 5px;">
              <strong>Important:</strong> Keep your Volunteer ID safe. You'll need it for identification and access to volunteer-related programs and events.
            </p>

            <p style="margin-top: 20px; color: #666; line-height: 1.6;">Thank you for your commitment to making a positive difference in the community!</p>
            
            <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 15px; text-align: center;">
              <strong>Prayas by Aarya Foundation</strong><br>
              Bringing positive change to society
            </p>
          </div>
        </div>
      `,
      attachments,
    })
    console.log("[v0] Approval email with PDFs sent to", email)
  } catch (error) {
    console.log("[v0] Error sending approval email:", error.message)
  }
}

// Send update email
export async function sendUpdateEmail(email, volunteer) {
  try {
    const attachments = await getPDFAttachments(volunteer)

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Volunteer Information Updated - Prayas by Aarya Foundation",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); padding: 30px; border-radius: 10px 10px 0 0; color: white; text-align: center;">
            <h2 style="margin: 0; font-size: 28px; font-weight: bold;">Information Updated</h2>
            <p style="margin: 10px 0; opacity: 0.9;">Your Updated Volunteer Documents</p>
          </div>

          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="color: #333; line-height: 1.6;">Dear <strong>${volunteer.name}</strong>,</p>
            <p style="color: #555; line-height: 1.6;">Your volunteer profile information has been updated by our admin team. Below are your updated ID Card and Certificate:</p>
            
            <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <p style="margin: 0; color: #1e40af; font-weight: bold; font-size: 16px;">Updated Volunteer ID: <span style="color: #3b82f6; font-size: 18px;">${volunteer.volunteerId}</span></p>
              <p style="margin: 5px 0; color: #1e3a8a; font-size: 13px;">Last Updated: ${new Date().toLocaleDateString("en-IN")}</p>
            </div>

            <h3 style="color: #1a1a1a; margin-top: 30px; margin-bottom: 15px; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">Your Updated Volunteer ID Card</h3>
            ${generateIDCardHTML(volunteer)}

            <h3 style="color: #1a1a1a; margin-top: 35px; margin-bottom: 15px; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">Your Updated Certificate</h3>
            ${generateCertificateHTML(volunteer)}

            <p style="margin-top: 20px; color: #666; line-height: 1.6;">If you have any questions or concerns about your updated information, please feel free to contact us.</p>
            
            <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 15px; text-align: center;">
              <strong>Prayas by Aarya Foundation</strong><br>
              Bringing positive change to society
            </p>
          </div>
        </div>
      `,
      attachments,
    })
    console.log("[v0] Update email with PDFs sent to", email)
  } catch (error) {
    console.log("[v0] Error sending update email:", error.message)
  }
}

// Send rejection email
export async function sendRejectionEmail(email, name) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Volunteer Application Status Update - Prayas by Aarya Foundation",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px; border-radius: 10px;">
          <div style="background: white; padding: 30px; border-radius: 8px; border-left: 4px solid #ef4444;">
            <h2 style="color: #dc2626; margin-top: 0;">Application Status Update</h2>
            <p style="color: #333; line-height: 1.6;">Dear <strong>${name}</strong>,</p>
            <p style="color: #555; line-height: 1.6;">Thank you for your interest in volunteering with <strong>Prayas by Aarya Foundation</strong>. We have reviewed your application and unfortunately, at this time, we are unable to approve it.</p>
            
            <p style="color: #666; line-height: 1.6; margin: 20px 0;">This does not mean you cannot volunteer with us in the future. We encourage you to reapply or contact us directly if you would like more information or feedback on your application.</p>

            <p style="color: #666; line-height: 1.6;">Thank you for your understanding and continued interest in our organization.</p>
            
            <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 15px;">
              <strong>Prayas by Aarya Foundation</strong><br>
              Bringing positive change to society
            </p>
          </div>
        </div>
      `,
    })
    console.log("[v0] Rejection email sent to", email)
  } catch (error) {
    console.log("[v0] Error sending rejection email:", error.message)
  }
}

/**
 * SEND EMAIL TO DONOR WITH PDF RECEIPT
 */
export async function sendDonorEmail(donation, pdfBuffer) {
  try {
    // If no email, skip sending and log it
    if (!donation.donorEmail) {
      console.log(
        "⏩ Skipping donor email: No email address provided for this donation."
      );
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

    await transporter.sendMail({
      from: `Prayas by Aarya Foundation <${process.env.EMAIL_USER}>`,
      to: donation.donorEmail,
      subject: "Your Donation Receipt - Prayas by Aarya Foundation",
      html: generateDonorEmailTemplate(donorDetails, transactionDetails),
      attachments: [
        {
          filename: `Donation_Receipt_${donation.receiptNumber}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    console.log("📨 Donor Email Sent:", donation.donorEmail);
    return true;
  } catch (error) {
    console.error("❌ Error sending donor email:", error);
    return false;
  }
}

/**
 * SEND EMAIL TO ADMIN (NO PDF)
 */
export async function sendAdminEmail(donation) {
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

    await transporter.sendMail({
      from: `Donation Bot <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "New Donation Received - Prayas by Aarya Foundation",
      html: generateAdminEmailTemplate(donorDetails, transactionDetails),
    });

    console.log("📨 Admin Email Sent");
    return true;
  } catch (error) {
    console.error("❌ Error sending admin email:", error);
    return false;
  }
}