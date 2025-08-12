import { replaceImage } from "../libs/cloudinary/cloudinary.js";

const updateProfile = async (req, res) => {
  const { name, description, profilePicture } = req.body;
  try {
    const userId = req.user._id;
    const updatedData = {};

    if (name) updatedData.name = name;
    if (description) updatedData.description = description;
    if (profilePicture) {
      const pictureUrl = await replaceImage(profilePicture, userId);
      updatedData.profilePicture = pictureUrl;
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
        profilePicture: updatedUser.profilePicture,
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
      },
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  updateProfile,
  getProfile,
};
