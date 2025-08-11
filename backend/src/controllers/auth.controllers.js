import { validationResult } from "express-validator";
import User from "../models/user.model.js";
import { generateJWT, hashPassword } from "../libs/utils.js";


const signUp = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    if (!newUser) {
      return res.status(400).json({ message: "Invalid user data" });
    }
    const savedUser = await newUser.save();
    generateJWT(savedUser._id, res);
    res.json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during sign up:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const login = (req, res) => {
  res.send("User logged in successfully");
};

export default {
  signUp,
  login,
};
