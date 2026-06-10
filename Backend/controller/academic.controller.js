import * as academicService from '../services/academic.service.js';
import { logActivity } from '../services/activity.service.js';

const sendError = (res, error, fallback = 'Academic module operation failed') => {
    if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ message: 'A record with the same unique code already exists.' });
    }
    if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ message: error.errors?.[0]?.message || fallback });
    }
    return res.status(500).json({ message: fallback, error: error.message });
};

const createCrudHandlers = ({
    entity,
    list,
    create,
    update,
    remove,
}) => ({
    list: async (_req, res) => {
        try {
            res.status(200).json(await list());
        } catch (error) {
            sendError(res, error, `Error fetching ${entity}`);
        }
    },
    create: async (req, res) => {
        try {
            const record = await create(req.body);
            await logActivity(req.user?.id, `CREATE_${entity.toUpperCase()}`, entity, record.id, req.body);
            res.status(201).json(record);
        } catch (error) {
            sendError(res, error, `Error creating ${entity}`);
        }
    },
    update: async (req, res) => {
        try {
            const record = await update(req.params.id, req.body);
            if (!record) return res.status(404).json({ message: `${entity} not found.` });
            await logActivity(req.user?.id, `UPDATE_${entity.toUpperCase()}`, entity, req.params.id, req.body);
            res.status(200).json(record);
        } catch (error) {
            sendError(res, error, `Error updating ${entity}`);
        }
    },
    remove: async (req, res) => {
        try {
            const removed = await remove(req.params.id);
            if (!removed) return res.status(404).json({ message: `${entity} not found.` });
            await logActivity(req.user?.id, `DELETE_${entity.toUpperCase()}`, entity, req.params.id);
            res.status(200).json({ message: `${entity} deleted successfully.` });
        } catch (error) {
            sendError(res, error, `Error deleting ${entity}`);
        }
    },
});

export const getAcademicOverview = async (_req, res) => {
    try {
        res.status(200).json(await academicService.getAcademicOverviewService());
    } catch (error) {
        sendError(res, error, 'Error fetching academic overview');
    }
};

export const subjectHandlers = createCrudHandlers({
    entity: 'subject',
    list: academicService.getSubjectsService,
    create: academicService.createSubjectService,
    update: academicService.updateSubjectService,
    remove: academicService.deleteSubjectService,
});

export const courseHandlers = createCrudHandlers({
    entity: 'course',
    list: academicService.getCoursesService,
    create: academicService.createCourseService,
    update: academicService.updateCourseService,
    remove: academicService.deleteCourseService,
});

export const semesterHandlers = createCrudHandlers({
    entity: 'semester',
    list: academicService.getSemestersService,
    create: academicService.createSemesterService,
    update: academicService.updateSemesterService,
    remove: academicService.deleteSemesterService,
});

export const curriculumHandlers = createCrudHandlers({
    entity: 'curriculum',
    list: academicService.getCurriculumService,
    create: academicService.createCurriculumService,
    update: academicService.updateCurriculumService,
    remove: academicService.deleteCurriculumService,
});

export const allocationHandlers = createCrudHandlers({
    entity: 'subject_allocation',
    list: academicService.getAllocationsService,
    create: academicService.createAllocationService,
    update: academicService.updateAllocationService,
    remove: academicService.deleteAllocationService,
});

export const getCredits = async (_req, res) => {
    try {
        res.status(200).json(await academicService.getCreditsService());
    } catch (error) {
        sendError(res, error, 'Error fetching credits');
    }
};

export const upsertCredit = async (req, res) => {
    try {
        const credit = await academicService.upsertCreditService(req.body);
        await logActivity(req.user?.id, 'UPSERT_CREDIT', 'credit', credit.id, req.body);
        res.status(200).json(credit);
    } catch (error) {
        sendError(res, error, 'Error saving credit configuration');
    }
};
