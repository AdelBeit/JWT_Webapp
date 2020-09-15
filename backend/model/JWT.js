const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// make a secret
const TOKEN_SECRET = crypto.randomBytes(64).toString("hex");
const SESSION_EXPIRATION = "300s";
const TOKEN_EXPIRATION = SESSION_EXPIRATION;

/**
 * generate a jwt with the given secret and user
 */
export default function generateToken(username) {
  return jwt.sign({ username: username }, TOKEN_SECRET, {
    expiresIn: TOKEN_EXPIRATION,
  });
}
