import JWT from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

export const generateJWT = (userId, res) => {
  const token = JWT.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  console.log("Secure cookie:", process.env.NODE_ENV === "production");
  res.cookie("token", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    // httpOnly: false,
    // secure: process.env.NODE_ENV === "production",
    domain:"https://chatty-thour.netlify.app/",
    sameSite: "lax",
    path: "/",
  });
  return token;
};

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};
