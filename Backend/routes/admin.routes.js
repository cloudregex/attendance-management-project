import express from "express";
import rateLimit from "express-rate-limit";
import {
    loginAdmin,
    getUsers,
    createUser,
    updateUser,
    deleteUser
} from "../controller/admin.controller.js";

import { checkAuth, checkPermission } from "../middleware/auth.middleware.js";

const router = express.Router();

// Rate limiting for login route to prevent brute-force attacks
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per window
    message: { error: "Too many login attempts from this IP, please try again after 15 minutes" },
    standardHeaders: true,
    legacyHeaders: false,
});

router.post("/login", loginLimiter, loginAdmin);

// Apply auth middleware to all management routes
router.use(checkAuth);

router.get("/get", checkPermission('canManageUsers'), getUsers);
router.post("/create", checkPermission('canManageUsers'), createUser);
router.put("/update/:id", checkPermission('canManageUsers'), updateUser);
router.delete("/delete/:id", checkPermission('canManageUsers'), deleteUser);

export default router;
