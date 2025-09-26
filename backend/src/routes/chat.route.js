import express from "express";
import protect from "../middlewares/protect.middleware.js";
import controllers from "../controllers/index.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Messaging and chat management
 */

/**
 * @swagger
 * /chat/friends:
 *   get:
 *     summary: Get chat friends
 *     description: Returns a list of users the authenticated user has active chats with.
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of chat friends
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized (no or invalid token)
 *       500:
 *         description: Internal server error
 */
router.get("/friends", protect, controllers.chat.getFriends);

/**
 * @swagger
 * /chat/messages/{id}:
 *   get:
 *     summary: Get messages with a user
 *     description: Returns all messages between the authenticated user and the specified user.
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user you want to fetch messages with
 *         example: 651234abcd56789ef0123456
 *     responses:
 *       200:
 *         description: List of messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Chat'
 *       401:
 *         description: Unauthorized (no or invalid token)
 *       404:
 *         description: User or messages not found
 *       500:
 *         description: Internal server error
 */
router.get("/messages/:id", protect, controllers.chat.getMessages);

/**
 * @swagger
 * /chat/sendmessage/{id}:
 *   post:
 *     summary: Send a message
 *     description: Sends a text or image message from the authenticated user to the specified user.
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user you want to send a message to
 *         example: 651234abcd56789ef0123456
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Hey! How are you?
 *               image:
 *                 type: string
 *                 example: https://example.com/image.png
 *     responses:
 *       201:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chat'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized (no or invalid token)
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post("/sendmessage/:id", protect, controllers.chat.sendMessage);

export default router;