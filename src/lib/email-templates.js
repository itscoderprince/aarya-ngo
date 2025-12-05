// Email template utilities for donation system

// Email template utilities for donation system

const COLORS = {
  navy: "#022741",
  yellow: "#FFB70B",
  lightBlue: "#F0F4F8",
  white: "#ffffff",
  text: "#333333",
  gray: "#666666"
};

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
  <body style="margin:0;padding:0;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;background-color:${COLORS.lightBlue};">
    <div style="max-width:600px;margin:40px auto;background:${COLORS.white};border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.05);">
      
      <!-- Header -->
      <div style="background:${COLORS.navy};padding:40px 30px;text-align:center;">
        <h1 style="margin:0;color:${COLORS.white};font-size:24px;font-weight:700;letter-spacing:0.5px;">Prayas by Aarya Foundation</h1>
        <p style="margin-top:10px;font-size:16px;color:${COLORS.yellow};font-weight:500;">Thank You for Your Generosity</p>
      </div>

      <!-- Content -->
      <div style="padding:40px 30px;">
        <p style="font-size:16px;color:${COLORS.text};margin-bottom:24px;">Dear <strong>${name}</strong>,</p>
        <p style="font-size:15px;color:${COLORS.gray};line-height:1.6;margin-bottom:30px;">
          We are truly grateful for your contribution. Your support empowers us to continue our mission of uplifting underprivileged communities through education, healthcare, and sustainable development.
        </p>

        <!-- Donation Card -->
        <div style="background:${COLORS.lightBlue};border-radius:8px;padding:25px;margin-bottom:30px;border:1px solid #e2e8f0;">
          <h3 style="margin:0 0 20px;font-size:14px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.navy};border-bottom:2px solid ${COLORS.yellow};display:inline-block;padding-bottom:5px;">Donation Receipt</h3>
          
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:8px 0;color:${COLORS.gray};font-size:14px;">Transaction ID</td>
              <td style="padding:8px 0;color:${COLORS.text};font-weight:600;text-align:right;font-family:monospace;">${transactionId}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:${COLORS.gray};font-size:14px;">Date</td>
              <td style="padding:8px 0;color:${COLORS.text};font-weight:600;text-align:right;">${formattedDate}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:${COLORS.gray};font-size:14px;">Amount</td>
              <td style="padding:8px 0;color:${COLORS.navy};font-weight:700;text-align:right;font-size:18px;">${formattedAmount}</td>
            </tr>
          </table>
        </div>

        <!-- Tax Benefit -->
        <div style="background:#ecfdf5;border-radius:8px;padding:15px;display:flex;align-items:start;margin-bottom:30px;">
          <div style="color:#059669;font-size:20px;margin-right:12px;">✓</div>
          <p style="margin:0;font-size:13px;color:#065f46;line-height:1.5;">
            <strong>Tax Exemption:</strong> Your donation is eligible for tax deduction under Section 80G of the Income Tax Act. Please retain this email and the attached receipt for your records.
          </p>
        </div>

        <!-- CTA -->
        <div style="text-align:center;margin-top:40px;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}" 
             style="background:${COLORS.yellow};color:${COLORS.navy};padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:700;font-size:14px;display:inline-block;transition:all 0.3s ease;">
            Visit Our Website
          </a>
        </div>

        <!-- PDF_LINK_PLACEHOLDER -->
      </div>

      <!-- Footer -->
      <div style="background:#f8fafc;padding:20px;text-align:center;border-top:1px solid #e2e8f0;">
        <p style="margin:0 0 8px;font-size:12px;color:${COLORS.gray};">Prayas by Aarya Foundation</p>
        <p style="margin:0;font-size:11px;color:#94a3b8;">Together we can make a difference.</p>
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
  <body style="margin:0;padding:0;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;background-color:${COLORS.lightBlue};">
    <div style="max-width:600px;margin:40px auto;background:${COLORS.white};border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.05);">
      
      <div style="background:${COLORS.navy};padding:25px;text-align:center;">
        <h2 style="margin:0;color:${COLORS.white};font-size:20px;">New Donation Received</h2>
      </div>

      <div style="padding:30px;">
        <div style="text-align:center;margin-bottom:30px;">
          <h1 style="margin:0;color:${COLORS.navy};font-size:36px;font-weight:700;">₹${Number(amount).toLocaleString()}</h1>
          <span style="background:#dcfce7;color:#166534;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600;display:inline-block;margin-top:10px;">${status || "Success"}</span>
        </div>

        <div style="background:${COLORS.lightBlue};border-radius:8px;padding:20px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:${COLORS.gray};font-size:14px;">Donor Name</td><td style="padding:8px 0;color:${COLORS.text};font-weight:600;text-align:right;">${name}</td></tr>
            <tr><td style="padding:8px 0;color:${COLORS.gray};font-size:14px;">Email</td><td style="padding:8px 0;color:${COLORS.text};font-weight:600;text-align:right;">${email}</td></tr>
            <tr><td style="padding:8px 0;color:${COLORS.gray};font-size:14px;">Phone</td><td style="padding:8px 0;color:${COLORS.text};font-weight:600;text-align:right;">${phone || "-"}</td></tr>
            <tr><td style="padding:8px 0;color:${COLORS.gray};font-size:14px;">PAN</td><td style="padding:8px 0;color:${COLORS.text};font-weight:600;text-align:right;">${pan || "-"}</td></tr>
            <tr><td style="padding:8px 0;color:${COLORS.gray};font-size:14px;">Transaction ID</td><td style="padding:8px 0;color:${COLORS.text};font-weight:600;text-align:right;font-family:monospace;">${transactionId}</td></tr>
          </table>
        </div>

        <!-- PDF_LINK_PLACEHOLDER -->
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
  <body style="margin:0;padding:0;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;background-color:${COLORS.lightBlue};">
    <div style="max-width:600px;margin:40px auto;background:${COLORS.white};border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.05);">
      
      <!-- Header -->
      <div style="background:${COLORS.navy};padding:40px 30px;text-align:center;background-image:linear-gradient(135deg, ${COLORS.navy} 0%, #0a3d61 100%);">
        <h1 style="margin:0;color:${COLORS.yellow};font-size:26px;font-weight:700;">Welcome to the Team!</h1>
        <p style="margin-top:10px;color:${COLORS.white};font-size:16px;opacity:0.9;">We are thrilled to have you with us.</p>
      </div>

      <!-- Content -->
      <div style="padding:40px 30px;">
        <p style="font-size:16px;color:${COLORS.text};margin-bottom:24px;">Hello <strong>${name}</strong>,</p>
        <p style="font-size:15px;color:${COLORS.gray};line-height:1.6;margin-bottom:30px;">
          Congratulations! Your application has been approved. You are now an official volunteer at <strong>Prayas by Aarya Foundation</strong>. Together, we will create lasting positive change.
        </p>

        <div style="background:${COLORS.lightBlue};border-left:4px solid ${COLORS.yellow};padding:20px;border-radius:0 8px 8px 0;margin-bottom:30px;">
          <div style="margin-bottom:8px;">
            <span style="font-size:12px;text-transform:uppercase;color:${COLORS.gray};letter-spacing:1px;">Volunteer ID</span>
            <div style="font-size:18px;font-weight:700;color:${COLORS.navy};font-family:monospace;">${volunteerId}</div>
          </div>
          <div>
            <span style="font-size:12px;text-transform:uppercase;color:${COLORS.gray};letter-spacing:1px;">Membership Type</span>
            <div style="font-size:16px;font-weight:600;color:${COLORS.text};">${volunteerType}</div>
          </div>
        </div>

        <p style="font-size:15px;color:${COLORS.gray};margin-bottom:30px;">
          We have attached your <strong>Official ID Card</strong> and <strong>Certificate of Membership</strong> to this email. Please keep them safe.
        </p>

        <div style="text-align:center;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/volunteer" 
             style="background:${COLORS.navy};color:${COLORS.white};padding:14px 32px;text-decoration:none;font-weight:700;border-radius:50px;font-size:14px;display:inline-block;box-shadow:0 4px 12px rgba(2, 39, 65, 0.2);">
             Access Volunteer Dashboard
          </a>
        </div>
      </div>

      <!-- Footer -->
      <div style="background:#f8fafc;padding:25px;text-align:center;border-top:1px solid #e2e8f0;">
        <p style="margin:0 0 10px;font-size:14px;font-weight:600;color:${COLORS.navy};">Prayas by Aarya Foundation</p>
        <p style="margin:0;font-size:12px;color:${COLORS.gray};">&copy; ${new Date().getFullYear()} All rights reserved.</p>
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
