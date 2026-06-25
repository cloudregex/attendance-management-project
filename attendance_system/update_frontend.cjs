const fs = require('fs');
const path = require('path');

// 1. Update AdminManager.jsx
const adminFile = path.join(__dirname, 'src', 'features', 'permissions', 'components', 'AdminManager.jsx');
let adminContent = fs.readFileSync(adminFile, 'utf8');

// Add SR No to header
adminContent = adminContent.replace(
    /<TableCell sx=\{\{ fontWeight: 700, color: 'text\.secondary', textTransform: 'uppercase', fontSize: '0\.8rem' \}\}>User<\/TableCell>/,
    `<TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.8rem' }}>SR No.</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.8rem' }}>User</TableCell>`
);

// Add index parameter
adminContent = adminContent.replace(
    /\) : users\.map\(\(user\) => \(/,
    `) : users.map((user, index) => (`
);

// Add SR No cell
adminContent = adminContent.replace(
    /<TableRow key=\{user\.id\} hover sx=\{\{ '&:last-child td, &:last-child th': \{ border: 0 \} \}\}>\s*<TableCell>/m,
    `<TableRow key={user.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>`
);
// Fix colSpan
adminContent = adminContent.replace(/colSpan=\{4\}/g, "colSpan={5}");
fs.writeFileSync(adminFile, adminContent, 'utf8');

// 2. Update RoleManager.jsx
const roleFile = path.join(__dirname, 'src', 'features', 'permissions', 'components', 'RoleManager.jsx');
let roleContent = fs.readFileSync(roleFile, 'utf8');

roleContent = roleContent.replace(
    /<TableCell sx=\{\{ fontWeight: 700, color: 'text\.secondary', textTransform: 'uppercase', fontSize: '0\.8rem' \}\}>Role<\/TableCell>/,
    `<TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.8rem' }}>SR No.</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.8rem' }}>Role</TableCell>`
);
roleContent = roleContent.replace(
    /\) : roles\.map\(\(role\) => \{/,
    `) : roles.map((role, index) => {`
);
roleContent = roleContent.replace(
    /<TableRow\s*key=\{role\.id\}\s*hover\s*sx=\{\{ '&:last-child td, &:last-child th': \{ border: 0 \} \}\}\s*>\s*<TableCell>/m,
    `<TableRow
                                    key={role.id}
                                    hover
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>`
);
// Fix colSpan
roleContent = roleContent.replace(/colSpan=\{3\}/g, "colSpan={4}");
fs.writeFileSync(roleFile, roleContent, 'utf8');

// 3. Update PermissionList.jsx
const permListFile = path.join(__dirname, 'src', 'features', 'permissions', 'components', 'PermissionList.jsx');
let permListContent = fs.readFileSync(permListFile, 'utf8');

permListContent = permListContent.replace(
    /<TableCell>User<\/TableCell>/,
    `<TableCell>SR No.</TableCell>\n            <TableCell>User</TableCell>`
);
permListContent = permListContent.replace(
    /\{users\.map\(user => \{/,
    `{users.map((user, index) => {`
);
permListContent = permListContent.replace(
    /<TableRow key=\{user\.id\} hover>\s*<TableCell>/m,
    `<TableRow key={user.id} hover>
                <TableCell>{index + 1}</TableCell>
                <TableCell>`
);
fs.writeFileSync(permListFile, permListContent, 'utf8');

// 4. Update PermissionDefinitionList.jsx (Replace native confirm with ConfirmDialog)
const permDefFile = path.join(__dirname, 'src', 'features', 'permissions', 'components', 'PermissionDefinitionList.jsx');
let permDefContent = fs.readFileSync(permDefFile, 'utf8');

// Add import
permDefContent = permDefContent.replace(
    /import axiosInstance from '\.\.\/\.\.\/\.\.\/utils\/axiosInstance';/,
    `import axiosInstance from '../../../utils/axiosInstance';\nimport ConfirmDialog from '../../../shared/components/ConfirmDialog';`
);

// Add confirm dialog state
permDefContent = permDefContent.replace(
    /const \[exportAnchorEl, setExportAnchorEl\] = useState\(null\);/,
    `const [exportAnchorEl, setExportAnchorEl] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', content: '', idToDelete: null });`
);

// Update handleDelete
permDefContent = permDefContent.replace(
    /const handleDelete = async \(id\) => \{[\s\S]*?if \(id <= 12\) \{[\s\S]*?alert\('Default permissions cannot be deleted'\);[\s\S]*?return;[\s\S]*?\}[\s\S]*?if \(window\.confirm\('Are you sure you want to delete this permission\?'\)\) \{[\s\S]*?try \{[\s\S]*?await axiosInstance\.delete\(`\.\/permissions\/definitions\/delete\/\$\{id\}`\);[\s\S]*?fetchPermissions\(\);[\s\S]*?\} catch \(error\) \{[\s\S]*?console\.error\('Error deleting permission:', error\);[\s\S]*?alert\('Failed to delete permission'\);[\s\S]*?\}[\s\S]*?\}[\s\S]*?\};/,
    `const handleDelete = (id) => {
        if (id <= 12) {
            alert('Default permissions cannot be deleted');
            return;
        }
        setConfirmDialog({
            open: true,
            title: 'Delete permission?',
            content: 'Are you sure you want to delete this permission?',
            idToDelete: id
        });
    };

    const executeDelete = async () => {
        const { idToDelete } = confirmDialog;
        setConfirmDialog(prev => ({ ...prev, open: false }));
        if (!idToDelete) return;

        try {
            await axiosInstance.delete(\`/permissions/definitions/delete/\${idToDelete}\`);
            fetchPermissions();
        } catch (error) {
            console.error('Error deleting permission:', error);
            alert('Failed to delete permission');
        }
    };`
);

// Add Dialog component
permDefContent = permDefContent.replace(
    /<\/Box>\s*\);\s*\};\s*export default PermissionDefinitionList;/m,
    `
            <ConfirmDialog
                open={confirmDialog.open}
                onClose={() => setConfirmDialog(p => ({ ...p, open: false }))}
                onConfirm={executeDelete}
                title={confirmDialog.title}
                content={confirmDialog.content}
            />
        </Box>
    );
};

export default PermissionDefinitionList;`
);

fs.writeFileSync(permDefFile, permDefContent, 'utf8');

console.log('Frontend updates complete.');
