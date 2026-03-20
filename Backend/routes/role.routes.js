import express from "express";
import { getRoles, createRole, updateRole, deleteRole } from "../controller/role.controller.js";
import { checkAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(checkAuth);

router.get("/get", getRoles);
router.post("/create", createRole);
router.put("/update/:id", updateRole);
router.delete("/delete/:id", deleteRole);

export default router;
