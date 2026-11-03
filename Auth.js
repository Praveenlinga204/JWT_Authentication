const jwt = require("jwt-simple");

function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({
        message: "Access denied. Token required."
      });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.SERCRET_key;

    if (!secret) {
      return res.status(500).json({
        message: "JWT secret is not configured"
      });
    }

    const decoded = jwt.decode(token, secret);

    console.log("Decoded payload:", decoded);

    if (!decoded.id || !decoded.exp) {
      return res.status(401).json({
        message: "Token missing id or expiry"
      });
    }

    if (decoded.exp <= Math.floor(Date.now() / 1000)) {
      return res.status(401).json({
        message: "Token expired"
      });
    }

    req.user = decoded;
    next();

  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
}

module.exports = auth;