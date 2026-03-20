import express from "express";
import { getPermissions, createPermission, updatePermission, deletePermission } from "../controller/permission.controller.js";
import { checkAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(checkAuth);

router.get("/get", getPermissions);
router.post("/create", createPermission);
router.put("/update/:id", updatePermission);
router.delete("/delete/:id", deletePermission);

export default router;
