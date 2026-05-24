const jwt = require("jsonwebtoken");

const SECRET = process.env.APP_ACCESS_KEY; 

const generarRefreshToken = (payload) => {
  return jwt.sign(payload, SECRET, { expiresIn: "24h" });
};

module.exports = {
  generarRefreshToken,
  SECRET 
};