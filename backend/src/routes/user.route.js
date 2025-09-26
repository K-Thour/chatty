import express from "express";
const router = express.Router();
import middlewares from "../middlewares/index.js";
import controllers from "../controllers/index.js";

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User profile management
 */

/**
 * @swagger
 * /update:
 *   put:
 *     summary: Update user profile
 *     description: Allows the authenticated user to update their profile image, description, and name.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               description:
 *                 type: string
 *                 example: Passionate fullstack developer and tech enthusiast.
 *               profileImage:
 *                 type: string
 *                 format: binary
 *                 description: Profile image file
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile updated successfully
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized (no or invalid token)
 */
router.put("/update", middlewares.protect, controllers.user.updateProfile);

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get user profile
 *     description: Returns the authenticated user's profile details.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized (no or invalid token)
 */
router.get("/profile", middlewares.protect, controllers.user.getProfile);

/**
 * @swagger
 * /getUsers/{query}:
 *   get:
 *     summary: Search users
 *     description: Returns a list of users whose name or email matches the query string. Excludes the authenticated user.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: Search term to filter users by name or email.
 *         example: john
 *     responses:
 *       200:
 *         description: List of matching users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid query
 *       401:
 *         description: Unauthorized (no or invalid token)
 *       500:
 *         description: Internal server error
 */
router.get("/getUsers/:query", middlewares.protect, controllers.user.findUsers);

export default router;
