import { validationResult } from "express-validator";
import User from "../models/user.model.js";
import { comparePassword, generateJWT, hashPassword } from "../libs/utils.js";

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
    res.status(201).json({ message: "User registered successfully",
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
      },
     });
  } catch (error) {
    console.error("Error during sign up:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    generateJWT(user._id, res);
    res.status(200).json({ message: "User logged in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
     });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  signUp,
  login,
};
