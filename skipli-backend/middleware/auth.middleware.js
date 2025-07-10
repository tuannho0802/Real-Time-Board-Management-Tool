const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader =
    req.headers["authorization"];

  if (
    !authHeader ||
    !authHeader.startsWith("Bearer ")
  ) {
    return res
      .status(401)
      .json({
        error:
          "Authorization header missing or malformed",
      });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(
    token,
    process.env.JWT_SECRET,
    (err, user) => {
      if (err)
        return res
          .status(403)
          .json({
            error: "Invalid or expired token",
          });

      req.user = user; // contains email or userId
      next();
    }
  );
};

module.exports = { authenticateToken };
