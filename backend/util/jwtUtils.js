const jwt = require("jsonwebtoken");

const SECRET = "tu_secreto_super_seguro"; 

// Token (expira en 24 horas)
const generarToken = (payload) => {
  return jwt.sign(payload, SECRET, { expiresIn: "24h" });
};

module.exports = {
  generarToken
};