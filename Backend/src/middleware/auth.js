const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "cookcraft-dev-secret-change-in-production";

function verifyToken(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required. Please log in." });
  }

  const token = header.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role, email: decoded.email, name: decoded.name };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired session. Please log in again." });
  }
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required." });
  }
  next();
}

module.exports = { verifyToken, requireAdmin, JWT_SECRET };
