import Permission from '../model/permission.model.js';
import Role from '../model/role.model.js';

const permissionCatalog = [
    'dashboard',
    'user list', 'user create', 'user edit', 'user soft delete', 'user hard delete', 'user restore', 'user trash', 'user status', 'user export', 'user import', 'user assign role',
    'role list', 'role create', 'role edit', 'role soft delete', 'role hard delete', 'role restore', 'role assign permissions',
    'permission list', 'permission create', 'permission edit', 'permission soft delete', 'permission hard delete', 'permission restore', 'permission assign',
    'student list', 'student create', 'student edit', 'student soft delete', 'student hard delete', 'student restore', 'student trash', 'student export', 'student import',
    'teacher list', 'teacher create', 'teacher edit', 'teacher soft delete', 'teacher hard delete', 'teacher restore', 'teacher trash', 'teacher export', 'teacher import',
    'department list', 'department create', 'department edit', 'department soft delete', 'department hard delete', 'department restore',
    'course list', 'course create', 'course edit', 'course soft delete', 'course hard delete', 'course restore',
    'semester list', 'semester create', 'semester edit', 'semester soft delete', 'semester hard delete', 'semester restore',
    'subject index', 'subject create', 'subject edit', 'subject soft delete', 'subject hard delete', 'subject restore', 'subject trashed', 'subject assign teacher',
    'attendance index', 'attendance create', 'attendance edit', 'attendance soft delete', 'attendance hard delete', 'attendance restore', 'attendance approve', 'attendance export',
    'timetable index', 'timetable create', 'timetable edit', 'timetable soft delete', 'timetable hard delete', 'timetable restore', 'timetable publish',
    'report attendance', 'report student', 'report teacher', 'report export', 'report financial',
    'activity logs', 'database backup', 'system settings'
];

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
    const legacyPerms = [
        'inquiry index',
        'teacher details',
        'student details',
        'user delete',
        'role management',
        'financial reports'
    ];

    for (const name of [...permissionCatalog, ...legacyPerms]) {
        await Permission.findOrCreate({
            where: { name },
            defaults: { name }
        });
    }

    const allPermissions = await Permission.findAll();
    const permissionsByName = new Map(allPermissions.map((permission) => [permission.name, permission]));

    const assignRolePermissions = async (roleId, names) => {
        const role = await Role.findByPk(roleId, {
            include: [{ model: Permission, as: 'permissions', through: { attributes: [] } }]
        });
        if (!role || typeof role.setPermissions !== 'function') return;
        if (role.permissions?.length > 0) return;

        const selected = names
            .map((name) => permissionsByName.get(name))
            .filter(Boolean);

        await role.setPermissions(selected);
    };

    await assignRolePermissions('admin', allPermissions.map((permission) => permission.name));
    await assignRolePermissions('subadmin', permissionCatalog.filter((name) => !name.includes('hard delete') && name !== 'system settings'));
    await assignRolePermissions('teacher', [
        'dashboard',
        'student list',
        'subject index',
        'attendance index', 'attendance create', 'attendance edit', 'attendance approve', 'attendance export',
        'timetable index',
        'report attendance', 'report student', 'report export'
    ]);
    await assignRolePermissions('staff', [
        'dashboard',
        'student list',
        'teacher list',
        'attendance index', 'attendance create',
        'timetable index'
    ]);
};
