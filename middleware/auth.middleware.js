import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const access_token = authHeader && authHeader.split(" ")[1];

  console.log("Access Token; ", access_token);

  // No token found;
  if (!access_token)
    return res.status(401).json({
      error: true,
      message: "Unauthorized !",
      timestamp: new Date().toISOString(),
    });

  // verify token
  jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({
        error: true,
        message: "TOKEN is not valid !",
        timestamp: new Date().toISOString(),
      });

    req.user = user;

    next();
  });
};
export default authenticateToken;
