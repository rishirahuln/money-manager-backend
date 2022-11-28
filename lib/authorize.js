const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  try {
    if (req.headers.authorization) {
      jwt.verify(
        req.headers.authorization,
        process.env.JWT_SECRET,
        (err, decoded) => {
          if (decoded == undefined) {
            res.status(401).json({ message: "Unauthorized" });
          } else {
            req.userId = decoded._id;
            next();
          }
        }
      );
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = { authenticate };
