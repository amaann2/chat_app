import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.cookie) {
      const cookies = req.headers.cookie.split(";");
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split("=");
        if (name === "chat_jwt_token") {
          token = value;
          break;
        }
      }
    }
    if (!token) {
      return res.status(401).json({ error: "unauthorized - Invalid Token" });
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded) {
      return res.status(401).json({ error: "unauthorized not token provided" });
    }
    const freshUser = await User.findById(decoded.userId);
    if (!freshUser) {
      return res.status(401).json({ error: "user not found" });
    }
    req.user = freshUser;
    next();
  } catch (error) {
    console.log("Error in protected route", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
