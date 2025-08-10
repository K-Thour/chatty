import express from 'express';
import authControllers from '../controllers/index.js'
import authValidator from '../validators/index.js';
const router = express.Router();

router.post('/signup', authValidator.signUp.signupValidation, authControllers.auth.signUp);

router.post('/login',authControllers.auth.login);

export default router;