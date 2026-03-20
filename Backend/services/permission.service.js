import Permission from '../model/permission.model.js';

export const getAllPermissionsService = () => {
    return Permission.findAll();
};

export const createPermissionService = (data) => {
    return Permission.create(data);
};

export const updatePermissionService = async (id, data) => {
    const perm = await Permission.findByPk(id);
    if (!perm) return null;
    return perm.update(data);
};

export const deletePermissionService = async (id) => {
    const perm = await Permission.findByPk(id);
    if (!perm) return null;
    return perm.destroy();
};

export const seedDefaultPermissions = async () => {
    const defaultPerms = [
        { name: 'inquiry index' },
        { name: 'database backup' },
        { name: 'activity logs' },
        { name: 'teacher details' },
        { name: 'student details' },
        { name: 'user list' },
        { name: 'user delete' },
        { name: 'user create' },
        { name: 'user edit' },
        { name: 'role management' },
        { name: 'financial reports' },
        { name: 'system settings' },
    ];

    for (const permData of defaultPerms) {
        await Permission.findOrCreate({
            where: { name: permData.name },
            defaults: permData
        });
    }
};
