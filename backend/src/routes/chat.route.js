import express from 'express';
import protect from '../middlewares/protect.middleware.js';
import controllers from '../controllers/index.js';

const router = express.Router();

router.get('/users',protect,controllers.chat.getUsers);

router.get('/messages/:id', protect, controllers.chat.getMessages);

router.post('/messages/:id', protect,controllers.chat.sendMessage);

export default router;