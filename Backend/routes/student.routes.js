import express from 'express';
import {
    addStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
} from '../controller/student.controller.js';

const router = express.Router();

router.post('/add', addStudent);           // POST   /api/students/add
router.get('/', getAllStudents);            // GET    /api/students
router.get('/:id', getStudentById);        // GET    /api/students/:id
router.put('/:id', updateStudent);         // PUT    /api/students/:id
router.delete('/:id', deleteStudent);      // DELETE /api/students/:id

export default router;
