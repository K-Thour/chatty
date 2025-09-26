import { replaceImage } from "../libs/cloudinary/cloudinary.js";
import Friend from "../models/friends.model.js";
import User from "../models/user.model.js";

const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updatedData = {};
    if (
      !(req.body?.name || req.body?.description || req.body?.profilePicture)
    ) {
      return res.status(400).json({ message: "No fields to update" });
    }
    if (req.body?.name) updatedData.name = req.body.name;
    if (req.body?.description) updatedData.description = req.body.description;
    if (req.body?.profilePicture) {
      const profilePicture = await replaceImage(req.body.profilePicture, userId);
      updatedData.profilePicture = profilePicture;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    }).select("-password");
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        description: updatedUser.description,
        profilePicture: updatedUser.profilePicture || "",
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getProfile = (req, res) => {
  try {
    res.status(200).json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        description: req.user.description,
        profilePicture: req.user.profilePicture,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const findUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const search = req.params.query;

    // Step 1: Build search filter
    let filter = {};

    if (search) {
      filter = {
        $or: [
          { name: { $regex: search, $options: "i" } }, // case-insensitive
          { email: { $regex: search, $options: "i" } },
        ],
      };
    }

    const relations = await Friend.find({
      $or: [{ userId }, { friendId: userId }],
      status: { $in: ["pending", "accepted"] },
    });

    const excludedIds = new Set([userId.toString()]); // always exclude self

    relations.forEach((rel) => {
      excludedIds.add(rel.userId.toString());
      excludedIds.add(rel.friendId.toString());
    });

    // Step 4: Apply exclusion
    filter._id = { $nin: Array.from(excludedIds) };

    // Step 5: Fetch users
    const users = await User.find(filter).select("-password"); // exclude password

    return res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  updateProfile,
  getProfile,
  findUsers,
};
