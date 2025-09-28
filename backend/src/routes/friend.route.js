import express from "express";
import controllers from "../controllers/index.js";
import middlewares from "../middlewares/index.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Friend
 *   description: Friend request and relationship management
 */

/**
 * @swagger
 * /friends/request/{id}:
 *   put:
 *     summary: Send a friend request
 *     description: Authenticated user can send a friend request to another user.
 *     tags: [Friend]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to send request
 *     responses:
 *       201:
 *         description: Friend request sent successfully
 *       400:
 *         description: Request already exists or invalid
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.put("/request/:id", middlewares.protect, controllers.friend.sendRequest);

/**
 * @swagger
 * /friends/{id}:
 *   put:
 *     summary: Update friend request status
 *     description: Accept or reject a friend request by providing its ID and new status.
 *     tags: [Friend]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Friend request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, accepted, rejected]
 *                 example: accepted
 *     responses:
 *       200:
 *         description: Friend request status updated successfully
 *       400:
 *         description: Invalid status
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Request not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", middlewares.protect, controllers.friend.handleStatus);

/**
 * @swagger
 * /friends:
 *   get:
 *     summary: Get all friends of authenticated user
 *     description: Returns all accepted friends for the logged-in user.
 *     tags: [Friend]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of friends
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/", middlewares.protect, controllers.friend.getAll);

/**
 * @swagger
 * /friends/pending:
 *   get:
 *     summary: Get pending friend requests sent by authenticated user
 *     description: Returns all pending friend requests created by the logged-in user.
 *     tags: [Friend]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(
  "/pending",
  middlewares.protect,
  controllers.friend.getPendingRequests
);

/**
 * @swagger
 * /friends/cancel/{id}:
 *   delete:
 *     summary: Cancel a sent friend request
 *     description: Authenticated user can cancel a previously sent friend request.
 *     tags: [Friend]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Friend request ID
 *     responses:
 *       200:
 *         description: Friend request cancelled successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Request not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/cancel/:id",
  middlewares.protect,
  controllers.friend.deleteRequest
);

/**
 * @swagger
 * /friends/pending/recieved:
 *   get:
 *     summary: Get received pending friend requests
 *     description: Returns all friend requests received by the authenticated user that are still pending.
 *     tags: [Friend]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of received pending requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(
  "/pending/recieved",
  middlewares.protect,
  controllers.friend.getReceivedRequests
);

router.delete(
  "/:id",
  middlewares.protect,
  controllers.friend.removeFriend
);

router.get(
  "/requests",
  middlewares.protect,
  controllers.friend.getAllRequests
);

export default router;