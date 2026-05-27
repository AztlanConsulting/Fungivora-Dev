const jwt = require("jsonwebtoken");

const getSecret = () => process.env.APP_ACCESS_KEY || 'default_test_secret';

const generarRefreshToken = (payload) => {
  return jwt.sign(payload, getSecret(), { expiresIn: "24h" });
};

module.exports = {
  generarRefreshToken,
  getSecret 
};