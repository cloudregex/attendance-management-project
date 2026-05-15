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

router.post('/login', loginAdmin);

// Protected routes
router.use(checkAuth);

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

export default router;
