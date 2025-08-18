import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }
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
