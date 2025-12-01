// Email template utilities for donation system

export const generateDonorEmailTemplate = (donorDetails, transactionDetails) => {
  const { name, phone, pan, amount } = donorDetails || {}
  const { transactionId } = transactionDetails || {}

  const formattedAmount = amount ? `₹${Number(amount).toLocaleString()}` : "-"
  const formattedDate = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Donation Confirmation</title>
  </head>
  <body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background:#f5f5f5;">
    <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:6px;overflow:hidden;">
      
      <!-- Header -->
      <div style="background:#FCD34D;padding:25px;text-align:center;">
        <h2 style="margin:0;color:#000;font-size:22px;font-weight:bold;">Prayas by Aarya Foundation</h2>
        <p style="margin-top:10px;font-size:18px;font-weight:bold;color:#000;">Thank You for Your Donation! ❤️</p>
      </div>

      <!-- Greeting -->
      <div style="padding:25px;">
        <p style="font-size:16px;color:#333;">Hi ${name},</p>
        <p style="font-size:15px;color:#444;line-height:1.6;">
          We are truly grateful for your generous contribution. Your support helps us
          continue our mission to empower lives, support education, healthcare, and
          uplift underprivileged communities.
        </p>

        <!-- Donation Summary -->
        <div style="background:#fffbe8;border:1px solid #f4d061;border-radius:6px;padding:18px;margin:20px 0;">
          <h3 style="margin:0 0 12px;font-size:18px;color:#000;">Donation Summary</h3>
          <table style="width:100%;font-size:14px;color:#333;">
            <tr><td style="padding:6px 0;font-weight:bold;">Transaction ID:</td><td style="font-family:monospace;">${transactionId}</td></tr>
            <tr><td style="padding:6px 0;font-weight:bold;">Amount:</td><td style="font-weight:bold;">${formattedAmount}</td></tr>
            <tr><td style="padding:6px 0;font-weight:bold;">Date:</td><td>${formattedDate}</td></tr>
            ${phone ? `<tr><td style="padding:6px 0;font-weight:bold;">Phone:</td><td>${phone}</td></tr>` : ""}
            ${pan ? `<tr><td style="padding:6px 0;font-weight:bold;">PAN:</td><td>${pan}</td></tr>` : ""}
          </table>
        </div>

        <!-- Tax Notice -->
        <div style="background:#e8f5e8;border-left:4px solid #22c55e;padding:12px;border-radius:4px;">
          <p style="font-size:14px;color:#14532d;margin:0;">
            ✅ Eligible for tax exemption under Section 80G of Income Tax Act.
            Please keep this email for your records.
          </p>
        </div>

        <!-- Impact Box -->
        <div style="background:#000;color:white;padding:18px;border-radius:6px;margin:25px 0;text-align:center;">
          <h3 style="color:#FCD34D;margin:0 0 10px;">Your contribution creates real impact</h3>
          <p style="margin:0;font-size:14px;color:#e5e5e5;">Thank you for being a part of change.</p>
        </div>

        <!-- CTA -->
        <div style="text-align:center;margin:25px 0;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}" 
            style="background:#FCD34D;color:#000;padding:12px 26px;border-radius:6px;text-decoration:none;font-weight:bold;">
            Visit Website
          </a>
        </div>

        <!-- PDF_LINK_PLACEHOLDER -->
      </div>

      <!-- Payment Footer -->
      <div style="padding:15px;text-align:center;font-size:12px;color:#555;border-top:1px solid #eee;">
        <p style="margin:4px 0;">Thank you for supporting Prayas by Aarya Foundation</p>
        <p style="margin:4px 0;">This is an automated email. Do not reply.</p>
      </div>
    </div>
  </body>
  </html>
  `
}

// ---------------- Admin Template ------------------

export const generateAdminEmailTemplate = (donorDetails, transactionDetails) => {
  const { name, email, phone, pan, amount } = donorDetails || {}
  const { transactionId, status } = transactionDetails || {}

  return `
  <!DOCTYPE html>
  <html>
  <body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background:#f5f5f5;">
    <div style="max-width:600px;margin:0 auto;background:#fff;padding:25px;border-radius:6px;">
      <h2 style="margin:0;color:#000;">🎉 New Donation Received!</h2>
      <p style="margin-top:6px;color:#666;">Prayas by Aarya Foundation</p>

      <h3 style="margin-top:18px;color:#16a34a;">₹${Number(amount).toLocaleString()}</h3>

      <table style="width:100%;margin-top:15px;font-size:14px;color:#333;">
        <tr><td style="font-weight:bold;padding:4px 0;">Name:</td><td>${name}</td></tr>
        <tr><td style="font-weight:bold;padding:4px 0;">Email:</td><td>${email}</td></tr>
        ${phone ? `<tr><td style="font-weight:bold;padding:4px 0;">Phone:</td><td>${phone}</td></tr>` : ""}
        ${pan ? `<tr><td style="font-weight:bold;padding:4px 0;">PAN:</td><td>${pan}</td></tr>` : ""}
        <tr><td style="font-weight:bold;padding:4px 0;">Txn ID:</td><td>${transactionId}</td></tr>
        <tr><td style="font-weight:bold;padding:4px 0;">Status:</td><td>✅ ${status || "Success"}</td></tr>
        <tr><td style="font-weight:bold;padding:4px 0;">Time:</td><td>${new Date().toLocaleString("en-IN")}</td></tr>
      </table>

      <!-- PDF_LINK_PLACEHOLDER -->

      <div style="margin-top:20px;font-size:13px;color:#8b5e00;background:#fff8db;border-left:4px solid #fbbf24;padding:10px;">
        <b>To-Do:</b>
        <ul style="margin:5px 0 0 15px;padding:0;">
          <li>Log donation in donor system</li>
          <li>Send digital receipt (80G)</li>
          <li>Add donor to relations list</li>
        </ul>
      </div>
    </div>
  </body>
  </html>
  `
}

// ---------------- Volunteer Template ------------------

export const generateVolunteerEmailTemplate = (volunteer) => {
  const { name, volunteerId, volunteerType } = volunteer || {};

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to the Team</title>
  </head>
  <body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background:#f5f5f5;">
    <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:6px;overflow:hidden;">
      
      <!-- Header -->
      <div style="background:#022741;padding:25px;text-align:center;">
        <h2 style="margin:0;color:#FFB70B;font-size:22px;font-weight:bold;">Welcome to Prayas!</h2>
        <p style="margin-top:5px;color:#fff;font-size:14px;">Together we can make a difference</p>
      </div>

      <!-- Content -->
      <div style="padding:30px;">
        <p style="font-size:16px;color:#333;">Hello <strong>${name}</strong>,</p>
        <p style="font-size:15px;color:#555;line-height:1.6;">
          Congratulations! Your volunteer application has been approved. We are thrilled to have you join our mission at <strong>Prayas by Aarya Foundation</strong>.
        </p>

        <div style="background:#f0f9ff;border-left:4px solid #022741;padding:15px;margin:20px 0;">
          <p style="margin:5px 0;font-size:14px;"><strong>Volunteer ID:</strong> ${volunteerId}</p>
          <p style="margin:5px 0;font-size:14px;"><strong>Membership Type:</strong> ${volunteerType}</p>
        </div>

        <p style="font-size:15px;color:#555;">
          Please find your <strong>Digital ID Card</strong> and <strong>Certificate of Membership</strong> attached to this email.
        </p>

        <div style="text-align:center;margin-top:30px;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/volunteer" 
             style="background:#FFB70B;color:#022741;padding:12px 25px;text-decoration:none;font-weight:bold;border-radius:5px;">
             Access Volunteer Dashboard
          </a>
        </div>
      </div>

      <!-- Footer -->
      <div style="background:#eee;padding:15px;text-align:center;font-size:12px;color:#666;">
        <p>&copy; ${new Date().getFullYear()} Prayas by Aarya Foundation. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
  `;
}

// ---------------- Nodemailer Config -------------------

export const emailConfig = {
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
}
