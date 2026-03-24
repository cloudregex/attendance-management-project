import express from 'express';
import {
    addTeacher,
    getAllTeachers,
    getTeacherById,
    updateTeacher,
    deleteTeacher,
} from '../controller/teacher.controller.js';

const router = express.Router();

router.post('/add', addTeacher);           // POST   /api/teachers/add
router.get('/', getAllTeachers);            // GET    /api/teachers
router.get('/:id', getTeacherById);        // GET    /api/teachers/:id
router.put('/:id', updateTeacher);         // PUT    /api/teachers/:id
router.delete('/:id', deleteTeacher);      // DELETE /api/teachers/:id

export default router;
