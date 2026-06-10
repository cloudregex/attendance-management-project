import express from 'express';
import { getAttendanceReport } from '../controller/attendance.controller.js';
import { checkAuth, checkPermission } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/report', checkAuth, checkPermission('canViewReports'), getAttendanceReport);

export default router;
