import Friend from "../models/friends.model.js";

export const sendRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const friendId = req.params.id;

    if (userId === friendId) {
      return res.status(400).json({ message: "You cannot add yourself" });
    }

    // Check if already exists
    const existing = await Friend.findOne({ userId, friendId });
    if (existing) {
      return res.status(400).json({ message: "Request already exists" });
    }

    const request = new Friend({ userId, friendId, status: "pending" });
    await request.save();

    res.status(201).json({ message: "Friend request sent", request });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const handleStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Validate allowed status values
    if (!["pending", "accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const request = await Friend.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json({
      message: `Friend request ${status}`,
      request,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const friends = await Friend.find({
      userId: req.user._id,
      status: "accepted",
    }).populate("friendId", "name email");

    res.json(friends);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPendingRequests = async (req, res) => {
  try {
    const requests = await Friend.find({
      userId: req.user._id,
      status: "pending",
    }).populate("friendId", "name email profilePicture");

    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const friendId = req.params.id;

    const request = await Friend.findOneAndDelete({
      userId,
      friendId,
      status: "pending",
    });

    if (!request) {
      return res.status(404).json({ message: "Request not found or already handled" });
    }

    res.json({ message: "Friend request canceled successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getReceivedRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const requests = await Friend.find({
      friendId: userId,
      status: "pending",
    }).populate("userId", "name email profilePicture");

    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const requests = await Friend.find({
      userId,
      status: { $in: ["pending", "accepted"] }
    }).populate("friendId", "name email profilePicture");

    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeFriend = async (req, res) => {
  try {
    const userId = req.user.id;
    const friendId = req.params.id;

    await Friend.findOneAndDelete({
      status: "accepted",
      $or: [
        { userId, friendId },
        { userId: friendId, friendId: userId }
      ]
    });

    res.json({ message: "Friend removed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default {
  sendRequest,
  handleStatus,
  getAll,
  getPendingRequests,
  deleteRequest,
  getReceivedRequests,
  getAllRequests,
  removeFriend,
};
