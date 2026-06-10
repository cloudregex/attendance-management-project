export const PERMISSION_SECTIONS = [
    { title: 'Dashboard Permissions', names: ['dashboard'] },
    { title: 'User Permissions', names: ['user list', 'user create', 'user edit', 'user soft delete', 'user hard delete', 'user restore', 'user trash', 'user status', 'user export', 'user import', 'user assign role', 'user delete'] },
    { title: 'Role Permissions', names: ['role list', 'role create', 'role edit', 'role soft delete', 'role hard delete', 'role restore', 'role assign permissions', 'role management'] },
    { title: 'Permission Permissions', names: ['permission list', 'permission create', 'permission edit', 'permission soft delete', 'permission hard delete', 'permission restore', 'permission assign'] },
    { title: 'Student Permissions', names: ['student list', 'student create', 'student edit', 'student soft delete', 'student hard delete', 'student restore', 'student trash', 'student export', 'student import', 'student details'] },
    { title: 'Teacher Permissions', names: ['teacher list', 'teacher create', 'teacher edit', 'teacher soft delete', 'teacher hard delete', 'teacher restore', 'teacher trash', 'teacher export', 'teacher import', 'teacher details'] },
    { title: 'Department Permissions', names: ['department list', 'department create', 'department edit', 'department soft delete', 'department hard delete', 'department restore'] },
    { title: 'Course Permissions', names: ['course list', 'course create', 'course edit', 'course soft delete', 'course hard delete', 'course restore'] },
    { title: 'Semester Permissions', names: ['semester list', 'semester create', 'semester edit', 'semester soft delete', 'semester hard delete', 'semester restore'] },
    { title: 'Subject Permissions', names: ['subject index', 'subject create', 'subject edit', 'subject soft delete', 'subject hard delete', 'subject restore', 'subject trashed', 'subject assign teacher'] },
    { title: 'Attendance Permissions', names: ['attendance index', 'attendance create', 'attendance edit', 'attendance soft delete', 'attendance hard delete', 'attendance restore', 'attendance approve', 'attendance export'] },
    { title: 'Timetable Permissions', names: ['timetable index', 'timetable create', 'timetable edit', 'timetable soft delete', 'timetable hard delete', 'timetable restore', 'timetable publish'] },
    { title: 'Report Permissions', names: ['report attendance', 'report student', 'report teacher', 'report export', 'report financial', 'financial reports'] },
    { title: 'System Permissions', names: ['activity logs', 'database backup', 'system settings', 'inquiry index'] }
];

export const buildPermissionGroups = (permissionsList) => {
    const permissionByName = new Map(
        permissionsList.map((permission) => [permission.name.toLowerCase(), permission])
    );
    const usedIds = new Set();

    const groups = PERMISSION_SECTIONS
        .map((section) => {
            const permissions = section.names
                .map((name) => permissionByName.get(name))
                .filter(Boolean);

            permissions.forEach((permission) => usedIds.add(permission.id));

            return { title: section.title, permissions };
        })
        .filter((section) => section.permissions.length > 0);

    const customPermissions = permissionsList.filter((permission) => !usedIds.has(permission.id));
    if (customPermissions.length > 0) {
        groups.push({ title: 'Custom Permissions', permissions: customPermissions });
    }

    return groups;
};
