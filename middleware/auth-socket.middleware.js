import jwt from "jsonwebtoken";

const authSocketMid = (socket, next) => {
  if (
    socket.handshake.headers &&
    socket.handshake.headers.authorization &&
    socket.handshake.headers.authorization.split(" ")[1]
  ) {
    const access_token = socket.handshake.headers.authorization.split(" ")[1];

    // verify token
    jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return next(new Error("Token is not valid"));
      }

      socket.user = user;

      next();
    });
  } else {
    next(new Error("Authentication error"));
  }
};
export default authSocketMid;
