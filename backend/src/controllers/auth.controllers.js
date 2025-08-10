import { validationResult } from 'express-validator';

const signUp=(req,res)=>{
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    res.json({ message: 'User registered successfully' });
  }

const login=(req,res)=>{
    res.send('User logged in successfully');
}

export default {
    signUp,
    login
};