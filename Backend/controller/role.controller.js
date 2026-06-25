import * as roleService from '../services/role.service.js';
import { logActivity } from '../services/activity.service.js';

export const getRoles = async (req, res) => {
    try {
        const roles = await roleService.getAllRolesService();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ error: "Error fetching roles" });
    }
}

export const createRole = async (req, res) => {
    try {
        const role = await roleService.createRoleService(req.body);

        // Log Activity
        await logActivity(req.user?.id, 'CREATE_ROLE', 'Role', role.id, { name: role.name });

        res.status(201).json(role);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const role = await roleService.updateRoleService(id, req.body);
        if (!role) return res.status(404).json({ error: "Role not found" });

        // Log Activity
        await logActivity(req.user?.id, 'UPDATE_ROLE', 'Role', id, { name: role.name });

        res.json(role);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const deleteRole = async (req, res) => {
    try {
        const { id } = req.params;
        const success = await roleService.deleteRoleService(id);
        if (!success) return res.status(404).json({ error: "Role not found" });

        // Log Activity
        await logActivity(req.user?.id, 'DELETE_ROLE', 'Role', id);

        res.json({ message: "Role deleted successfully" });
    } catch (error) {
        if (error.message === 'ROLE_IN_USE') {
            return res.status(400).json({ error: "Cannot delete role because it is assigned to one or more users." });
        }
        res.status(500).json({ error: error.message });
    }
}
