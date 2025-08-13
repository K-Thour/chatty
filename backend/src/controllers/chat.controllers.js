import { uploadImage } from "../libs/cloudinary/cloudinary.js";
import Chat from "../models/chat.model.js";
import User from "../models/user.model.js";

const getUsers = async (req, res) => {
  const userId = req.user._id;
  try {
    const users = await User.find({ _id: { $ne: userId } }).select("-password");
    res.status(200).json({
      message: "Users fetched successfully",
      users: users.map((user) => ({
        id: user._id,
        name: user.name,
        email: user.email,
        description: user.description,
        profilePicture: user.profilePicture,
      })),
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getMessages = async (req, res) => {
  const { id: secondPersonId } = req.params;
  try {
    const userId = req.user._id;
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: secondPersonId },
        { sender: secondPersonId, receiver: userId },
      ],
    }).sort({ createdAt: 1 });
    res.status(200).json({
      message: "Messages fetched successfully",
      messages: messages.map((msg) => ({
        id: msg._id,
        senderId: msg.senderId,
        receiverId: msg.receiverId,
        message: msg.message,
        createdAt: msg.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const sendMessage = async (req, res) => {
  const { id: receiverId } = req.params;
  const senderId = req.user._id;
  try {
    if (!req.body.message && !req.body.image) {
      return res.status(400).json({ message: "Message content is required" });
    }
    let imageUrl = null;
    if (req.body.image) {
      imageUrl = await uploadImage(image, senderId);
      if (!imageUrl) {
        return res.status(500).json({ message: "Image upload failed" });
      }
    }
    const newMessage = new Chat({
      senderId: senderId,
      receiverId: receiverId,
      message: req.body.message || "",
      image: imageUrl,
    });
    await newMessage.save();
    res.status(201).json({
      message: "Message sent successfully",
      messageData: {
        id: newMessage._id,
        sender: newMessage.senderId,
        receiver: newMessage.receiverId,
        message: newMessage.message,
        image: newMessage.image,
        createdAt: newMessage.createdAt,
      },
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  getUsers,
  getMessages,
  sendMessage,
};
