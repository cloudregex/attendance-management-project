import express from 'express';
import { loginAdmin, refreshAdminToken, logoutAdmin } from '../controller/admin.controller.js';
import { verifyAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/refresh-token', refreshAdminToken);
router.post('/logout', logoutAdmin);

// Protected route to verify token and get current admin info
router.get('/me', verifyAdmin, (req, res) => {
    res.status(200).json({
        message: "Protected admin route accessed successfully",
        admin: req.admin
    });
});

export default router;
