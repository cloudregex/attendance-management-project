import express from "express";
import {
    loginAdmin,
    getUsers,
    createUser,
    updateUser,
    deleteUser
} from "../controller/admin.controller.js";

import { checkAuth, checkPermission } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", loginAdmin);

// Apply auth middleware to all management routes
router.use(checkAuth);

router.get("/get", checkPermission('canManageUsers'), getUsers);
router.post("/create", checkPermission('canManageUsers'), createUser);
router.put("/update/:id", checkPermission('canManageUsers'), updateUser);
router.delete("/delete/:id", checkPermission('canManageUsers'), deleteUser);

export default router;
