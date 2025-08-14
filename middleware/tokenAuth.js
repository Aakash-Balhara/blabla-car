
const jwt=require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

function token(req, res, next) {
  const token = req.cookies.token;

   if (token) {
        try {
            const decoded = jwt.verify(token, secret);
            req.user = decoded;
            res.locals.user = decoded;
        } catch (err) {
            req.user = null;
            res.locals.user = null;
        }
    } else {
        req.user = null;
        res.locals.user = null;
    }
    next();
}

module.exports=token;