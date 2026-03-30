import bcrypt from 'bcryptjs';
import Teacher from '../model/teacher.model.js';

// POST /api/teachers/add
export const addTeacher = async (req, res) => {
    try {
        const {
            teacher_name, email, mobile,
            password, gender, date_of_birth,
            employee_id, department_id,
            designation, qualification,
            subjects, classes, joining_date,
            address, city, state, pincode,
            status,
        } = req.body;

        // Required field checks
        if (!teacher_name || !email || !employee_id || !department_id) {
            return res.status(400).json({ message: 'teacher_name, email, employee_id and department_id are required.' });
        }

        if (!password) {
            return res.status(400).json({ message: 'password is required.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const teacher = await Teacher.create({
            first_name: teacher_name,   // frontend sends teacher_name as full name
            email,
            mobile: mobile || null,
            password: hashedPassword,
            gender,
            date_of_birth: date_of_birth || null,
            employee_id,
            department_id,
            designation: designation || null,
            qualification: qualification || null,
            subjects: subjects || [],
            classes: classes || [],
            joining_date: joining_date || null,
            address,
            city,
            state,
            pincode,
            status: status !== undefined ? status : true,
        });

        const { password: _, ...teacherData } = teacher.toJSON();
        res.status(201).json({ message: 'Teacher added successfully.', teacher: teacherData });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'Email or employee ID already exists.' });
        }
        console.error('❌ Error adding teacher:', error);
        res.status(500).json({ error: error.message });
    }
};

// GET /api/teachers
export const getAllTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.findAll({
            attributes: { exclude: ['password'] },
        });
        res.status(200).json(teachers);
    } catch (error) {
        console.error('❌ Error fetching teachers:', error);
        res.status(500).json({ error: error.message });
    }
};

// GET /api/teachers/:id
export const getTeacherById = async (req, res) => {
    try {
        const teacher = await Teacher.findByPk(req.params.id, {
            attributes: { exclude: ['password'] },
        });
        if (!teacher) return res.status(404).json({ message: 'Teacher not found.' });
        res.status(200).json(teacher);
    } catch (error) {
        console.error('❌ Error fetching teacher:', error);
        res.status(500).json({ error: error.message });
    }
};

// PUT /api/teachers/:id
export const updateTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findByPk(req.params.id);
        if (!teacher) return res.status(404).json({ message: 'Teacher not found.' });

        const {
            teacher_name, email, mobile,
            password, gender, date_of_birth,
            employee_id, department_id,
            designation, qualification,
            subjects, classes, joining_date,
            address, city, state, pincode,
            status,
        } = req.body;

        const updateData = {
            ...(teacher_name    && { first_name: teacher_name }),
            ...(email           && { email }),
            ...(mobile          !== undefined && { mobile }),
            ...(gender          !== undefined && { gender }),
            ...(date_of_birth   !== undefined && { date_of_birth }),
            ...(employee_id     && { employee_id }),
            ...(department_id   && { department_id }),
            ...(designation     !== undefined && { designation }),
            ...(qualification   !== undefined && { qualification }),
            ...(subjects        !== undefined && { subjects }),
            ...(classes         !== undefined && { classes }),
            ...(joining_date    !== undefined && { joining_date }),
            ...(address         !== undefined && { address }),
            ...(city            !== undefined && { city }),
            ...(state           !== undefined && { state }),
            ...(pincode         !== undefined && { pincode }),
            ...(status          !== undefined && { status }),
        };

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        await teacher.update(updateData);
        const { password: _, ...teacherData } = teacher.toJSON();
        res.status(200).json({ message: 'Teacher updated successfully.', teacher: teacherData });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'Email or employee ID already exists.' });
        }
        console.error('❌ Error updating teacher:', error);
        res.status(500).json({ error: error.message });
    }
};

// DELETE /api/teachers/:id
export const deleteTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findByPk(req.params.id);
        if (!teacher) return res.status(404).json({ message: 'Teacher not found.' });
        await teacher.destroy();
        res.status(200).json({ message: 'Teacher deleted successfully.' });
    } catch (error) {
        console.error('❌ Error deleting teacher:', error);
        res.status(500).json({ error: error.message });
    }
};
