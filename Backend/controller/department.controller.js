import Department from '../model/department.model.js';

// POST /api/departments/add
export const addDepartment = async (req, res) => {
    try {
        const { name, code, status } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Department name is required.' });
        }

        const department = await Department.create({
            name,
            code: code || null,
            status: status !== undefined ? status : true,
        });

        res.status(201).json({ message: 'Department added successfully.', department });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'Department name or code already exists.' });
        }
        console.error('❌ Error adding department:', error);
        res.status(500).json({ error: error.message });
    }
};

// GET /api/departments
export const getAllDepartments = async (req, res) => {
    try {
        const departments = await Department.findAll();
        res.status(200).json(departments);
    } catch (error) {
        console.error('❌ Error fetching departments:', error);
        res.status(500).json({ error: error.message });
    }
};

// GET /api/departments/:id
export const getDepartmentById = async (req, res) => {
    try {
        const department = await Department.findByPk(req.params.id);
        if (!department) return res.status(404).json({ message: 'Department not found.' });
        res.status(200).json(department);
    } catch (error) {
        console.error('❌ Error fetching department:', error);
        res.status(500).json({ error: error.message });
    }
};

// PUT /api/departments/:id
export const updateDepartment = async (req, res) => {
    try {
        const department = await Department.findByPk(req.params.id);
        if (!department) return res.status(404).json({ message: 'Department not found.' });

        const { name, code, status } = req.body;

        await department.update({
            ...(name   && { name }),
            ...(code   !== undefined && { code }),
            ...(status !== undefined && { status }),
        });

        res.status(200).json({ message: 'Department updated successfully.', department });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'Department name or code already exists.' });
        }
        console.error('❌ Error updating department:', error);
        res.status(500).json({ error: error.message });
    }
};

// DELETE /api/departments/:id
export const deleteDepartment = async (req, res) => {
    try {
        const department = await Department.findByPk(req.params.id);
        if (!department) return res.status(404).json({ message: 'Department not found.' });
        await department.destroy();
        res.status(200).json({ message: 'Department deleted successfully.' });
    } catch (error) {
        console.error('❌ Error deleting department:', error);
        res.status(500).json({ error: error.message });
    }
};
