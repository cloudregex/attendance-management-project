import express from 'express';
import rateLimit from "express-rate-limit";
import {
    loginAdmin,
    refreshAdminToken,
    logoutAdmin,
    getUsers,
    createUser,
    updateUser,
    deleteUser
} from "../controller/admin.controller.js";
import { checkAuth, checkPermission, verifyAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: { message: "Too many login attempts, please try again after 15 minutes" }
});

router.post('/login', loginLimiter, loginAdmin);
router.post('/refresh-token', refreshAdminToken);
router.post('/logout', logoutAdmin);

// Protected routes
router.use(checkAuth);

// Protected route to verify token and get current admin info
router.get('/me', (req, res) => {
    res.status(200).json({
        message: "Protected admin route accessed successfully",
        admin: req.user

    });
});

router.get("/users", checkPermission("canManageUsers"), getUsers);
router.post("/users", checkPermission("canManageUsers"), createUser);
router.put("/users/:id", checkPermission("canManageUsers"), updateUser);
router.delete("/users/:id", checkPermission("canManageUsers"), deleteUser);

// Compatibility routes used by the permissions frontend when this router is
// mounted at /api/users.
router.get("/get", checkPermission("canManageUsers"), getUsers);
router.post("/create", checkPermission("canManageUsers"), createUser);
router.put("/update/:id", checkPermission("canManageUsers"), updateUser);
router.delete("/delete/:id", checkPermission("canManageUsers"), deleteUser);

export default router;
