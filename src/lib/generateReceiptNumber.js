/**
 * Generate a unique receipt number for donations
 * Format: RCP-YYYY-MMDD-HHmmss-XXXXX
 * Example: RCP-2024-1129-143022-A7B3F
 */
export function generateReceiptNumber() {
  const now = new Date();

  // Extract date and time components
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  // Generate random alphanumeric suffix (5 characters)
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomSuffix = "";
  for (let i = 0; i < 5; i++) {
    randomSuffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  // Format: RCP-YYYY-MMDD-HHmmss-XXXXX
  return `RCP-${year}-${month}${day}-${hours}${minutes}${seconds}-${randomSuffix}`;
}

/**
 * Alternative simpler format (if needed)
 * Format: RCP-YYYYMMDDHHMMSS-XXXXX
 */
export function generateSimpleReceiptNumber() {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);

  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomSuffix = "";
  for (let i = 0; i < 5; i++) {
    randomSuffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `RCP-${timestamp}-${randomSuffix}`;
}
