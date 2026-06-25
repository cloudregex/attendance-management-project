const fs = require('fs');
const path = require('path');

const roleServiceFile = path.join(__dirname, 'Backend', 'services', 'role.service.js');
let roleContent = fs.readFileSync(roleServiceFile, 'utf8');

// Add import for Admin model
roleContent = roleContent.replace(
    /import Permission from '\.\.\/model\/permission\.model\.js';/,
    `import Permission from '../model/permission.model.js';\nimport Admin from '../model/admin.model.js';`
);

// Update deleteRoleService
roleContent = roleContent.replace(
    /export const deleteRoleService = async \(id\) => \{[\s\S]*?const role = await Role\.findByPk\(id\);[\s\S]*?if \(!role\) return null;[\s\S]*?return role\.destroy\(\);[\s\S]*?\};/,
    `export const deleteRoleService = async (id) => {
    const role = await Role.findByPk(id);
    if (!role) return null;
    
    // Check if role is in use
    const usersCount = await Admin.count({ where: { roleId: id } });
    if (usersCount > 0) {
        throw new Error('ROLE_IN_USE');
    }
    
    await role.destroy();
    return true;
};`
);

fs.writeFileSync(roleServiceFile, roleContent, 'utf8');

const roleControllerFile = path.join(__dirname, 'Backend', 'controller', 'role.controller.js');
let roleCtrlContent = fs.readFileSync(roleControllerFile, 'utf8');

roleCtrlContent = roleCtrlContent.replace(
    /export const deleteRole = async \(req, res\) => \{[\s\S]*?try \{[\s\S]*?const \{ id \} = req\.params;[\s\S]*?const success = await roleService\.deleteRoleService\(id\);[\s\S]*?if \(!success\) return res\.status\(404\)\.json\(\{ error: "Role not found" \}\);[\s\S]*?\/\/ Log Activity[\s\S]*?await logActivity\(req\.user\?\.id, 'DELETE_ROLE', 'Role', id\);[\s\S]*?res\.json\(\{ message: "Role deleted successfully" \}\);[\s\S]*?\} catch \(error\) \{[\s\S]*?res\.status\(500\)\.json\(\{ error: error\.message \}\);[\s\S]*?\}[\s\S]*?\}/,
    `export const deleteRole = async (req, res) => {
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
}`
);

fs.writeFileSync(roleControllerFile, roleCtrlContent, 'utf8');

console.log('Backend role updates complete.');
