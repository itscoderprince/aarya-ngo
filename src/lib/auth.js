import jwt from "jsonwebtoken"

export function generateToken(username) {
  return jwt.sign({ username, type: "admin" }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch (error) {
    return null
  }
}

export function verifyAdminCredentials(username, password) {
  return username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD
}
