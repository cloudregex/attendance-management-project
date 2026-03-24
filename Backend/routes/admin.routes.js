import express from "express";
import {
    loginAdmin,
    getUsers,
    createUser,
    updateUser,
    deleteUser
} from "../controller/admin.controller.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/get", getUsers);
router.post("/create", createUser);
router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);

export default router;
