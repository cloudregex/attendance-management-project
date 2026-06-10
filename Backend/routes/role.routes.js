import express from "express";
import { getRoles, createRole, updateRole, deleteRole } from "../controller/role.controller.js";
import { checkAuth, checkPermission, checkAnyPermission } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(checkAuth);

router.get("/get", checkAnyPermission(['canManageRoles', 'canManageUsers']), getRoles);
router.post("/create", checkPermission('canManageRoles'), createRole);
router.put("/update/:id", checkPermission('canManageRoles'), updateRole);
router.delete("/delete/:id", checkPermission('canManageRoles'), deleteRole);

export default router;
