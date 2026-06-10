import express from 'express';
import {
    allocationHandlers,
    courseHandlers,
    curriculumHandlers,
    getAcademicOverview,
    getCredits,
    semesterHandlers,
    subjectHandlers,
    upsertCredit,
} from '../controller/academic.controller.js';
import { checkAuth, checkPermission } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(checkAuth);
router.use(checkPermission('canManageDepts'));

router.get('/overview', getAcademicOverview);

router.get('/subjects', subjectHandlers.list);
router.post('/subjects', subjectHandlers.create);
router.put('/subjects/:id', subjectHandlers.update);
router.delete('/subjects/:id', subjectHandlers.remove);

router.get('/courses', courseHandlers.list);
router.post('/courses', courseHandlers.create);
router.put('/courses/:id', courseHandlers.update);
router.delete('/courses/:id', courseHandlers.remove);

router.get('/semesters', semesterHandlers.list);
router.post('/semesters', semesterHandlers.create);
router.put('/semesters/:id', semesterHandlers.update);
router.delete('/semesters/:id', semesterHandlers.remove);

router.get('/curriculum', curriculumHandlers.list);
router.post('/curriculum', curriculumHandlers.create);
router.put('/curriculum/:id', curriculumHandlers.update);
router.delete('/curriculum/:id', curriculumHandlers.remove);

router.get('/credits', getCredits);
router.post('/credits', upsertCredit);
router.put('/credits/:id', upsertCredit);

router.get('/allocations', allocationHandlers.list);
router.post('/allocations', allocationHandlers.create);
router.put('/allocations/:id', allocationHandlers.update);
router.delete('/allocations/:id', allocationHandlers.remove);

export default router;
