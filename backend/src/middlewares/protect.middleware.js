import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized access" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized access" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protect middleware:", error);
    return res.status(401).json({ message: "Unauthorized access" });
  }
};

export default protect;
