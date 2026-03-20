import express from 'express';
import { loginAdmin } from '../controller/admin.controller.js';
import { verifyAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/login', loginAdmin);

// Protected route to verify token and get current admin info
router.get('/me', verifyAdmin, (req, res) => {
    res.status(200).json({ 
        message: "Protected admin route accessed successfully", 
        admin: req.admin 
    });
});

export default router;
