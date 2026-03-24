import bcrypt from 'bcryptjs';
import Student from '../model/student.model.js';

// POST /api/students/add
export const addStudent = async (req, res) => {
    try {
        const {
            first_name, middle_name, last_name,
            email, student_mobile, student_whatsapp,
            password, gender, date_of_birth,
            address, city, state, pincode,
            roll_number, department_id, course,
            className, semester, admission_year,
            parent_name, parent_mobile, status,
        } = req.body;

        // Required field checks
        if (!first_name || !email || !roll_number || !department_id) {
            return res.status(400).json({ message: 'first_name, email, roll_number and department_id are required.' });
        }

        // Hash password (default to roll_number if no password provided)
        const rawPassword = password || roll_number;
        const hashedPassword = await bcrypt.hash(rawPassword, 10);

        const student = await Student.create({
            first_name,
            middle_name,
            last_name,
            email,
            mobile: student_mobile || null,
            whatsapp_number: student_whatsapp || null,
            password: hashedPassword,
            gender,
            date_of_birth: date_of_birth || null,
            address,
            city,
            state,
            pincode,
            roll_number,
            department_id,
            course,
            class_name: className || null,
            semester,
            admission_year,
            parent_name,
            parent_mobile,
            status: status !== undefined ? status : true,
        });

        const { password: _, ...studentData } = student.toJSON();
        res.status(201).json({ message: 'Student added successfully.', student: studentData });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'Email or roll number already exists.' });
        }
        console.error('❌ Error adding student:', error);
        res.status(500).json({ error: error.message });
    }
};

// GET /api/students
export const getAllStudents = async (req, res) => {
    try {
        const students = await Student.findAll({
            attributes: { exclude: ['password'] },
        });
        res.status(200).json(students);
    } catch (error) {
        console.error('❌ Error fetching students:', error);
        res.status(500).json({ error: error.message });
    }
};

// GET /api/students/:id
export const getStudentById = async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id, {
            attributes: { exclude: ['password'] },
        });
        if (!student) return res.status(404).json({ message: 'Student not found.' });
        res.status(200).json(student);
    } catch (error) {
        console.error('❌ Error fetching student:', error);
        res.status(500).json({ error: error.message });
    }
};

// PUT /api/students/:id
export const updateStudent = async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id);
        if (!student) return res.status(404).json({ message: 'Student not found.' });

        const {
            first_name, middle_name, last_name,
            email, student_mobile, student_whatsapp,
            password, gender, date_of_birth,
            address, city, state, pincode,
            roll_number, department_id, course,
            className, semester, admission_year,
            parent_name, parent_mobile, status,
        } = req.body;

        const updateData = {
            ...(first_name      && { first_name }),
            ...(middle_name     !== undefined && { middle_name }),
            ...(last_name       !== undefined && { last_name }),
            ...(email           && { email }),
            ...(student_mobile  !== undefined && { mobile: student_mobile }),
            ...(student_whatsapp !== undefined && { whatsapp_number: student_whatsapp }),
            ...(gender          !== undefined && { gender }),
            ...(date_of_birth   !== undefined && { date_of_birth }),
            ...(address         !== undefined && { address }),
            ...(city            !== undefined && { city }),
            ...(state           !== undefined && { state }),
            ...(pincode         !== undefined && { pincode }),
            ...(roll_number     && { roll_number }),
            ...(department_id   && { department_id }),
            ...(course          !== undefined && { course }),
            ...(className       !== undefined && { class_name: className }),
            ...(semester        !== undefined && { semester }),
            ...(admission_year  !== undefined && { admission_year }),
            ...(parent_name     !== undefined && { parent_name }),
            ...(parent_mobile   !== undefined && { parent_mobile }),
            ...(status          !== undefined && { status }),
        };

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        await student.update(updateData);
        const { password: _, ...studentData } = student.toJSON();
        res.status(200).json({ message: 'Student updated successfully.', student: studentData });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'Email or roll number already exists.' });
        }
        console.error('❌ Error updating student:', error);
        res.status(500).json({ error: error.message });
    }
};

// DELETE /api/students/:id
export const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id);
        if (!student) return res.status(404).json({ message: 'Student not found.' });
        await student.destroy();
        res.status(200).json({ message: 'Student deleted successfully.' });
    } catch (error) {
        console.error('❌ Error deleting student:', error);
        res.status(500).json({ error: error.message });
    }
};
