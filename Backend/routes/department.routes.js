import express from 'express';
import {
    addDepartment,
    getAllDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment,
} from '../controller/department.controller.js';

const router = express.Router();

router.post('/add', addDepartment);        // POST   /api/departments/add
router.get('/', getAllDepartments);         // GET    /api/departments
router.get('/:id', getDepartmentById);     // GET    /api/departments/:id
router.put('/:id', updateDepartment);      // PUT    /api/departments/:id
router.delete('/:id', deleteDepartment);   // DELETE /api/departments/:id

export default router;
