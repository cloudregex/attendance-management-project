import Role from '../model/role.model.js';

export const getAllRolesService = () => {
    return Role.findAll();
};

export const createRoleService = (data) => {
    return Role.create(data);
};

export const updateRoleService = async (id, data) => {
    const role = await Role.findByPk(id);
    if (!role) return null;
    return role.update(data);
};

export const deleteRoleService = async (id) => {
    const role = await Role.findByPk(id);
    if (!role) return null;
    return role.destroy();
};

export const seedDefaultRoles = async () => {
    const defaultRoles = [
        {
            id: 'admin',
            name: 'Administrator',
            canGrant: true, canApprove: true, canManageUsers: true, canManageRoles: true,
            canTakeAttendance: true, canViewReports: true, canModifyRecords: true, canExportData: true,
            canAccessLogs: true, canManageDepts: true, canViewSchedules: true, canSystemConfig: true
        },
        {
            id: 'teacher',
            name: 'Teacher',
            canGrant: false, canApprove: true, canManageUsers: false, canManageRoles: false,
            canTakeAttendance: true, canViewReports: true, canModifyRecords: false, canExportData: true,
            canAccessLogs: false, canManageDepts: false, canViewSchedules: true, canSystemConfig: false
        },
        {
            id: 'staff',
            name: 'Staff',
            canGrant: false, canApprove: false, canManageUsers: false, canManageRoles: false,
            canTakeAttendance: true, canViewReports: false, canModifyRecords: false, canExportData: false,
            canAccessLogs: false, canManageDepts: false, canViewSchedules: true, canSystemConfig: false
        },
        {
            id: 'subadmin',
            name: 'Sub Administrator',
            canGrant: true, canApprove: true, canManageUsers: true, canManageRoles: false,
            canTakeAttendance: true, canViewReports: true, canModifyRecords: true, canExportData: true,
            canAccessLogs: true, canManageDepts: true, canViewSchedules: true, canSystemConfig: false
        },
    ];

    for (const roleData of defaultRoles) {
        await Role.findOrCreate({
            where: { id: roleData.id },
            defaults: roleData
        });
    }
};
