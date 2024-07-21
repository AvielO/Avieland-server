import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

export const authSocketMiddleware = (socket, next) => {
  const token = socket.handshake.query.token;

  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return next(new Error("Authentication error: Invalid token"));
    }

    socket.user = decoded; // Attach the decoded token to the socket object
    next();
  });
};
