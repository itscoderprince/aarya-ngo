// Email template utilities for donation system

export const generateDonorEmailTemplate = (donorDetails, transactionDetails) => {
  const { name, email, phone, pan, amount } = donorDetails
  const { transactionId, status, paymentMethod } = transactionDetails

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Donation Confirmation</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white;">
        <!-- Header -->
        <div style="background-color: #FCD34D; padding: 30px 20px; text-align: center;">
          <div style="display: inline-flex; align-items: center; margin-bottom: 10px;">
            <div style="width: 40px; height: 40px; background-color: black; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
              <span style="color: #FCD34D; font-weight: bold; font-size: 18px;">P</span>
            </div>
            <h1 style="color: black; margin: 0; font-size: 24px;">Prayas by Aarya Foundation</h1>
          </div>
          <h2 style="color: black; margin: 10px 0 0 0; font-size: 28px;">Thank You for Your Donation!</h2>
        </div>
        
        <!-- Content -->
        <div style="padding: 30px 20px;">
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">Dear ${name},</p>
          
          <p style="font-size: 16px; color: #333; line-height: 1.6; margin-bottom: 25px;">
            Thank you for your generous donation to Prayas by Aarya Foundation. Your contribution will help us create a brighter tomorrow for those in need. Every donation makes a meaningful difference in someone's life.
          </p>
          
          <!-- Donation Details Box -->
          <div style="background-color: #f8f9fa; border: 2px solid #FCD34D; border-radius: 8px; padding: 20px; margin: 25px 0;">
            <h3 style="color: black; margin: 0 0 15px 0; font-size: 20px;">Donation Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Transaction ID:</td>
                <td style="padding: 8px 0; color: #333; font-family: monospace;">${transactionId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Amount:</td>
                <td style="padding: 8px 0; color: #333; font-size: 18px; font-weight: bold;">₹${amount.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Date:</td>
                <td style="padding: 8px 0; color: #333;">${new Date().toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Status:</td>
                <td style="padding: 8px 0; color: #22c55e; font-weight: bold;">✓ Successful</td>
              </tr>
              ${
                phone
                  ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Phone:</td>
                <td style="padding: 8px 0; color: #333;">${phone}</td>
              </tr>
              `
                  : ""
              }
              ${
                pan
                  ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">PAN:</td>
                <td style="padding: 8px 0; color: #333;">${pan}</td>
              </tr>
              `
                  : ""
              }
            </table>
          </div>
          
          <!-- Tax Benefits -->
          <div style="background-color: #e8f5e8; border-left: 4px solid #22c55e; padding: 15px; margin: 25px 0;">
            <h4 style="color: #166534; margin: 0 0 10px 0;">Tax Benefits Available</h4>
            <p style="color: #166534; margin: 0; font-size: 14px;">
              This donation is eligible for tax deduction under Section 80G of the Income Tax Act. 
              Please retain this email as proof of donation for your tax filing.
            </p>
          </div>
          
          <!-- Impact Message -->
          <div style="background-color: black; color: white; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
            <h3 style="color: #FCD34D; margin: 0 0 10px 0;">Your Impact</h3>
            <p style="margin: 0; line-height: 1.6; color: #e5e5e5;">
              Your contribution helps us provide education, healthcare, and empowerment programs 
              to those who need it most. Together, we're building a brighter future.
            </p>
          </div>
          
          <p style="font-size: 16px; color: #333; line-height: 1.6; margin-bottom: 10px;">
            If you have any questions about your donation or our work, please don't hesitate to contact us at 
            <a href="mailto:prayasbyaaryafoundation@gmail.com" style="color: #FCD34D;">prayasbyaaryafoundation@gmail.com</a>
          </p>
          
          <p style="font-size: 16px; color: #333; margin-bottom: 30px;">
            With heartfelt gratitude,<br>
            <strong>The Prayas by Aarya Foundation Team</strong>
          </p>
          
          <!-- CTA Button -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || "https://prayasbyaaryafoundation.com"}" 
               style="background-color: #FCD34D; color: black; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Visit Our Website
            </a>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e5e5e5;">
          <p style="margin: 0; font-size: 12px; color: #666;">
            Prayas by Aarya Foundation | Creating a Brighter Tomorrow
          </p>
          <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">
            This is an automated email. Please do not reply to this email address.
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

export const generateAdminEmailTemplate = (donorDetails, transactionDetails) => {
  const { name, email, phone, pan, amount } = donorDetails
  const { transactionId, status, paymentMethod } = transactionDetails

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Donation Notification</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white;">
        <!-- Header -->
        <div style="background-color: black; color: white; padding: 30px 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">🎉 New Donation Received!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; color: #FCD34D;">Prayas by Aarya Foundation</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 30px 20px;">
          <div style="background-color: #f0fdf4; border: 2px solid #22c55e; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
            <h2 style="color: #166534; margin: 0 0 15px 0; font-size: 24px;">₹${amount.toLocaleString()}</h2>
            <p style="color: #166534; margin: 0; font-size: 16px;">Donation Amount</p>
          </div>
          
          <!-- Donor Details -->
          <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 25px 0;">
            <h3 style="color: black; margin: 0 0 15px 0; font-size: 20px;">Donor Information</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555; width: 140px;">Name:</td>
                <td style="padding: 8px 0; color: #333;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
                <td style="padding: 8px 0; color: #333;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Phone:</td>
                <td style="padding: 8px 0; color: #333;">${phone}</td>
              </tr>
              ${
                pan
                  ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">PAN:</td>
                <td style="padding: 8px 0; color: #333;">${pan}</td>
              </tr>
              `
                  : ""
              }
            </table>
          </div>
          
          <!-- Transaction Details -->
          <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 25px 0;">
            <h3 style="color: black; margin: 0 0 15px 0; font-size: 20px;">Transaction Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555; width: 140px;">Transaction ID:</td>
                <td style="padding: 8px 0; color: #333; font-family: monospace; font-size: 14px;">${transactionId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Payment Method:</td>
                <td style="padding: 8px 0; color: #333;">${paymentMethod || "PhonePe"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Date & Time:</td>
                <td style="padding: 8px 0; color: #333;">${new Date().toLocaleString("en-IN")}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Status:</td>
                <td style="padding: 8px 0; color: #22c55e; font-weight: bold;">✓ ${status || "Successful"}</td>
              </tr>
            </table>
          </div>
          
          <!-- Action Items -->
          <div style="background-color: #fef3c7; border: 2px solid #FCD34D; border-radius: 8px; padding: 20px; margin: 25px 0;">
            <h3 style="color: #92400e; margin: 0 0 15px 0;">Action Items</h3>
            <ul style="color: #92400e; margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 8px;">Send thank you message to donor if needed</li>
              <li style="margin-bottom: 8px;">Update donor database with new contribution</li>
              <li style="margin-bottom: 8px;">Process tax exemption certificate if PAN provided</li>
              <li>Follow up for future engagement opportunities</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #666; font-size: 14px; margin: 0;">
              This is an automated notification from the donation system.
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

export const emailConfig = {
  service: "gmail",
  auth: {
    user: "prayasbyaaryafoundation@gmail.com",
    pass: "xxxxxxxxxxxx", // Replace with actual app password
  },
}
