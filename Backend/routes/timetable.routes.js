import express from 'express';
import {
    createClassroom,
    deleteTimetableEntry,
    generateTimetable,
    getTimetableOverview,
    publishTimetable,
    updateTimetableEntry,
    autoResolveConflicts,
    createLectureSlot,
    updateLectureSlot,
} from '../controller/timetable.controller.js';
import { checkAuth, checkPermission } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(checkAuth);
router.use(checkPermission('canManageDepts'));

router.get('/overview', getTimetableOverview);
router.post('/generate', generateTimetable);
router.post('/publish', publishTimetable);
router.post('/resolve', autoResolveConflicts);
router.post('/classrooms', createClassroom);
router.post('/slots', createLectureSlot);
router.put('/slots/:id', updateLectureSlot);
router.put('/entries/:id', updateTimetableEntry);
router.delete('/entries/:id', deleteTimetableEntry);

export default router;
