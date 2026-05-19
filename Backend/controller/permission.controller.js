import * as permissionService from '../services/permission.service.js';
import { logActivity } from '../services/activity.service.js';

export const getPermissions = async (req, res) => {
    try {
        const perms = await permissionService.getAllPermissionsService();
        res.json(perms);
    } catch (error) {
        res.status(500).json({ error: "Error fetching permissions" });
    }
}

export const createPermission = async (req, res) => {
    try {
        const perm = await permissionService.createPermissionService(req.body);

        // Log Activity
        await logActivity(req.user?.id, 'CREATE_PERMISSION', 'Permission', perm.id, { name: perm.name });

        res.status(201).json(perm);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const updatePermission = async (req, res) => {
    try {
        const { id } = req.params;
        const perm = await permissionService.updatePermissionService(id, req.body);
        if (!perm) return res.status(404).json({ error: "Permission not found" });

        // Log Activity
        await logActivity(req.user?.id, 'UPDATE_PERMISSION', 'Permission', id, { name: perm.name });

        res.json(perm);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const deletePermission = async (req, res) => {
    try {
        const { id } = req.params;
        const success = await permissionService.deletePermissionService(id);
        if (!success) return res.status(404).json({ error: "Permission not found" });

        // Log Activity
        await logActivity(req.user?.id, 'DELETE_PERMISSION', 'Permission', id);

        res.json({ message: "Permission deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
