const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

function checkLogin(req, res, next) {
  const token = req.cookies.token;


  if (!token) {
    req.user = null;
    return res.status(401).send("Unauthorized. Please login.");
  }
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
       req.user = null;
      return res.status(403).send("Invalid token. Please login again.");
    }
      req.user = decoded;
      next();
    
  });
}

module.exports = checkLogin;
