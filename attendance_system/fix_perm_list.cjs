const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'src', 'features', 'permissions', 'components', 'PermissionDefinitionList.jsx');
let content = fs.readFileSync(targetFile, 'utf8');

// Find the start of handleDelete
const startIndex = content.indexOf('const handleDelete =');
// Find the start of the next section // Filter and Paginate
const endIndex = content.indexOf('// Filter and Paginate');

if (startIndex !== -1 && endIndex !== -1) {
    const newHandleDelete = `const handleDelete = (id) => {
        if (id <= 12) {
            alert('Default permissions cannot be deleted');
            return;
        }

        setConfirmDialog({
            open: true,
            title: 'Confirm Delete',
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
    };

    `;

    content = content.substring(0, startIndex) + newHandleDelete + content.substring(endIndex);
    fs.writeFileSync(targetFile, content, 'utf8');
    console.log("Successfully replaced handleDelete in PermissionDefinitionList.jsx");
} else {
    console.log("Could not find the bounds to replace");
}
