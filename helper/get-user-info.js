import jwt from "jsonwebtoken";

const getUserInfo = (req, socket, next) => {
  const authHeader = req.headers["authorization"];
  const access_token = authHeader && authHeader.split(" ")[1];

  // No token found;
  if (!access_token) {
    next(new Error("Authentication error"));
  }

  // verify token
  jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) next(new Error("Authentication error"));

    socket.user = user;
  });
};
export default getUserInfo;
