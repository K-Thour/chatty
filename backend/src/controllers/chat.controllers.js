import { uploadImage } from "../libs/cloudinary/cloudinary.js";
import { getUserSocketId, io } from "../libs/socket.js";
import Chat from "../models/chat.model.js";
import Friend from "../models/friends.model.js";

const getFriends = async (req, res) => {
  const userId = req.user._id;
  try {
    // Find all accepted friendships involving this user
    const friendships = await Friend.find({
      $or: [{ userId }, { friendId: userId }],
      status: "accepted",
    })
      .populate("userId", "name email description profilePicture")  
      .populate("friendId", "name email description profilePicture"); // populate friendId

    // Map to get the other user in the friendship
    const usersWithUnread = await Promise.all(
      friendships.map(async (friendship) => {
        // Determine who is the other user
        const otherUser =
          friendship.userId._id.toString() === userId.toString()
            ? friendship.friendId
            : friendship.userId;

        // Count unread messages from that user
        const unreadCount = await Chat.countDocuments({
          senderId: otherUser._id,
          receiverId: userId,
          isRead: false,
        });

        return {
          id: otherUser._id,
          name: otherUser.name,
          email: otherUser.email,
          description: otherUser.description,
          profilePicture: otherUser.profilePicture,
          unreadCount,
        };
      })
    );

    return res.json(usersWithUnread);
  } catch (error) {
    console.error(error);
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
    const recieverSocketId = getUserSocketId(receiverId);
    if (receiverId) {
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
  getFriends,
  getMessages,
  sendMessage,
};
