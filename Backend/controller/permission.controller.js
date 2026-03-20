import * as permissionService from '../services/permission.service.js';

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
        res.json({ message: "Permission deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
