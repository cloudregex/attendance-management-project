import express from "express";
import { createUser, getUsers, updateUser, deleteUser } from "../controller/admin.controller.js";
import { checkAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

// All routes are now protected by checkAuth
router.use(checkAuth);

router.post("/create", createUser);
router.get("/get", getUsers);
router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);

export default router;