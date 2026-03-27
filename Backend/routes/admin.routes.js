import express from "express";
import {
    loginAdmin,
    getUsers,
    createUser,
    updateUser,
    deleteUser
} from "../controller/admin.controller.js";

import { checkAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", loginAdmin);

// Apply auth middleware to all management routes
router.use(checkAuth);

router.get("/get", getUsers);
router.post("/create", createUser);
router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);

export default router;
