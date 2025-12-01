# Troubleshooting Guide - Payment Success Flow

## Issue: "Verifying your payment..." Stuck Forever

### ✅ This Should Now Be Fixed

**Root Cause:** Missing imports in `verify-payment/route.js`
- Was importing `generateDonationReceiptPDF` (doesn't exist)
- Was importing `uploadBufferToCloudinary` from non-existent file
- Was importing `sendDonorEmail, sendAdminEmail` from non-existent file

**Solution Applied:**
- ✅ Created `/src/lib/cloudinary-server.js`
- ✅ Created `/src/lib/sendDonationEmail.js`
- ✅ Created `/src/lib/generateReceiptNumber.js`
- ✅ Fixed imports in `verify-payment/route.js`
- ✅ Changed `generateDonationReceiptPDF` → `generateReceiptPDF`

---

## Common Issues & Solutions

### Issue 1: "Module not found" Errors

**Error:** `Cannot find module '@/lib/cloudinary-server'`

**Solution:**
- Check that these files exist:
  - ✅ `/src/lib/cloudinary-server.js`
  - ✅ `/src/lib/sendDonationEmail.js`
  - ✅ `/src/lib/generateReceiptNumber.js`
- Restart your dev server: `npm run dev`

---

### Issue 2: Payment Processing but No Email Received

**Symptoms:** 
- Donation shows as successful
- No email received by donor
- No email received by admin

**Check:**
1. **Environment Variables Set?**
   ```
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password (NOT your Gmail password!)
   ```

2. **Check Console Logs:**
   ```
   ✅ Donor Email Sent: [email@example.com]
   ✅ Admin Email Sent
   ```

3. **If emails show as sent but not received:**
   - Check spam/junk folder
   - Check Gmail app password is correct
   - Try resending from MongoDB admin panel

---

### Issue 3: PDF Not Generated or Uploaded

**Error:** `generateReceiptPDF is not defined`

**Solution:**
- Check import in `verify-payment/route.js`:
  ```javascript
  import { generateReceiptPDF } from "@/lib/pdf-generator";
  ```
  (NOT `generateDonationReceiptPDF`)

**Console Logs to Watch:**
```
📄 Generating donation receipt PDF...
✅ PDF generated successfully, size: X bytes
📤 Uploading PDF to Cloudinary...
✅ PDF uploaded to Cloudinary: [url]
```

---

### Issue 4: PDF Uploaded But Link Not Saved in DB

**Check Donation Record in MongoDB:**
```javascript
// Should have:
{
  receiptPdfUrl: "https://res.cloudinary.com/...",
  receiptNumber: "RCP-2024-1129-143022-A7B3F"
}
```

**If Missing:**
1. Check Cloudinary credentials:
   - `CLOUDINARY_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

2. Check console for upload errors:
   ```
   ❌ Cloudinary Upload Error: [error details]
   ```

---

### Issue 5: Donation Record Not in MongoDB

**Symptoms:**
- Payment shows as successful
- But donation not in MongoDB
- Error: "Donation not found"

**Root Cause:** Donation created in `create-payment` route but verification can't find it

**Check:**
1. In `create-payment/route.js`, verify this runs:
   ```javascript
   await Donation.create({
     merchantOrderId,
     donorName: donor.name,
     donorEmail: donor.email,
     donorPhone: donor.phone,
     pan: donor.pan,
     amount: donor.amount,
     status: "PENDING",
   });
   ```

2. MongoDB Connection:
   - Correct `MONGODB_URI` in `.env.local`?
   - Database accessible from your server?

---

## Debugging Workflow

### Step 1: Check Console Logs
```bash
npm run dev
# Look for these patterns in your terminal
```

**Good Flow:**
```
🔍 Verifying payment for transaction: [id]
✅ Donation found in DB: [id]
🔄 Checking payment status with PhonePe...
📊 PhonePe payment state: COMPLETED
✅ Donation status updated to: PAYMENT_SUCCESS
📝 Receipt number generated: RCP-...
📄 Generating donation receipt PDF...
✅ PDF generated successfully, size: X bytes
📤 Uploading PDF to Cloudinary...
✅ PDF uploaded to Cloudinary: https://...
✅ Donor Email Sent: [email]
✅ Admin Email Sent
✅ Payment verification and processing complete!
```

**Bad Flow:**
```
❌ Donation not found in DB
❌ Error sending donor email
❌ Cloudinary Upload Error
```

### Step 2: Monitor Network Requests
1. Open DevTools (F12) → Network tab
2. Make a test payment
3. Look for `/api/verify-payment` request
4. Check response status and data

### Step 3: Check Database
```javascript
// Connect to MongoDB and run:
db.donations.findOne({ merchantOrderId: "your-txn-id" })

// Should return:
{
  _id: ObjectId(...),
  merchantOrderId: "...",
  donorName: "...",
  donorEmail: "...",
  donorPhone: "...",
  pan: "...",
  amount: 500,
  status: "PAYMENT_SUCCESS",
  receiptNumber: "RCP-2024-...",
  receiptPdfUrl: "https://res.cloudinary.com/...",
  paymentInfo: {...},
  createdAt: ISODate(...),
  updatedAt: ISODate(...)
}
```

### Step 4: Check Cloudinary
1. Go to Cloudinary dashboard
2. Navigate to Media Library
3. Look in `aarya-ngo/receipts` folder
4. Should see `receipt_RCP-...` files

---

## Quick Fixes

### Fix 1: Restart Dev Server
```bash
# Stop current server (Ctrl+C)
npm run dev
```

### Fix 2: Clear Node Modules Cache
```bash
rm -r node_modules/.cache
npm run dev
```

### Fix 3: Reinstall Dependencies
```bash
npm install
npm run dev
```

### Fix 4: Check Environment Variables
```bash
# In .env.local, verify these exist:
CLOUDINARY_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
EMAIL_USER=...
EMAIL_PASSWORD=...
MONGODB_URI=...
NEXT_PUBLIC_BASE_URL=...
```

---

## Testing Checklist

- [ ] Payment creates record in MongoDB
- [ ] Verify-payment API returns success
- [ ] Receipt number generated (format: RCP-...)
- [ ] PDF created (check file size in logs)
- [ ] PDF uploaded to Cloudinary
- [ ] receiptPdfUrl saved in MongoDB
- [ ] Donor email received
- [ ] Admin email received
- [ ] PDF download works
- [ ] No "stuck loading" screen

---

## Getting Help

If issues persist:

1. **Check Browser Console (F12):**
   - Any JavaScript errors?

2. **Check Server Console:**
   - Look for ❌ errors at every step

3. **Check Email Settings:**
   - Gmail app password correct?
   - Less secure apps enabled?

4. **Test Each Component Separately:**
   - Test Cloudinary upload with a simple script
   - Test email sending with a test endpoint
   - Test PDF generation locally

---

**Remember:** The payment is ALWAYS saved first (in `create-payment` route), then verified and processed (in `verify-payment` route).
