import express from "express";
import { getPermissions, createPermission, updatePermission, deletePermission } from "../controller/permission.controller.js";
import { checkAuth, checkPermission } from "../middleware/auth.middleware.js";


const router = express.Router();

router.use(checkAuth);


router.get("/get", checkPermission('canManageRoles'), getPermissions);
router.post("/create", checkPermission('canManageRoles'), createPermission);
router.put("/update/:id", checkPermission('canManageRoles'), updatePermission);
router.delete("/delete/:id", checkPermission('canManageRoles'), deletePermission);


export default router;
