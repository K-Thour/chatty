import { uploadImage } from "../libs/cloudinary/cloudinary.js";
import { getUserSocketId, io } from "../libs/socket.js";
import Chat from "../models/chat.model.js";
import User from "../models/user.model.js";

const getUsers = async (req, res) => {
  const userId = req.user._id;
  try {
    const users = await User.find({ _id: { $ne: userId } }).select("-password");

    // get unread counts for each user
    let usersWithUnread = await Promise.all(
      users.map(async (user) => {
        const unreadCount = await Chat.countDocuments({
          sender: user._id,
          receiver: userId,
          isRead: false,
        });

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          description: user.description,
          profilePicture: user.profilePicture,
          unreadCount,
        };
      })
    );

    // ✅ sort by unreadCount (highest first)
    usersWithUnread = usersWithUnread.sort(
      (a, b) => b.unreadCount - a.unreadCount
    );

    console.log(usersWithUnread);

    res.status(200).json({
      message: "Users fetched successfully",
      users: usersWithUnread,
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
    const messages = await Chat.find({
      $or: [
        { senderId: userId, receiverId: secondPersonId },
        { senderId: secondPersonId, receiverId: userId },
      ],
    }).sort({ createdAt: 1 });
    await Chat.updateMany(
      { senderId: secondPersonId, receiverId: userId, isRead: false },
      { $set: { isRead: true } }
    );
    res.status(200).json({
      message: "Messages fetched successfully",
      messages: messages.map((msg) => ({
        id: msg._id,
        senderId: msg.senderId,
        receiverId: msg.receiverId,
        message: msg.message,
        image: msg.image,
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
      imageUrl = await uploadImage(req.body.image);
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
    // Emit the new message to the sender and receiver via socket.io
    const recieverSocketId = getUserSocketId(receiverId);
    if (recieverSocketId) {
      io.to(recieverSocketId).emit("newMessage", newMessage);
    }
    res.status(201).json({
      message: "Message sent successfully",
      messageData: {
        id: newMessage._id,
        senderId: newMessage.senderId,
        receiverId: newMessage.receiverId,
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
