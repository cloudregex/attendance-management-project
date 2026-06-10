import * as timetableService from '../services/timetable.service.js';
import { logActivity } from '../services/activity.service.js';

const sendError = (res, error, fallback = 'Timetable operation failed') => {
    if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ message: 'A timetable record with the same unique value already exists.' });
    }
    if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ message: error.errors?.[0]?.message || fallback });
    }
    return res.status(500).json({ message: fallback, error: error.message });
};

export const getTimetableOverview = async (_req, res) => {
    try {
        res.status(200).json(await timetableService.getTimetableOverviewService());
    } catch (error) {
        sendError(res, error, 'Error loading timetable data');
    }
};

export const generateTimetable = async (req, res) => {
    try {
        const result = await timetableService.generateTimetableService(req.body);
        await logActivity(req.user?.id, 'GENERATE_TIMETABLE', 'Timetable', null, req.body);
        res.status(201).json(result);
    } catch (error) {
        sendError(res, error, 'Error generating timetable');
    }
};

export const publishTimetable = async (req, res) => {
    try {
        const result = await timetableService.publishTimetableService(req.body);
        await logActivity(req.user?.id, 'PUBLISH_TIMETABLE', 'Timetable', null, req.body);
        res.status(200).json(result);
    } catch (error) {
        sendError(res, error, 'Error publishing timetable');
    }
};

export const createClassroom = async (req, res) => {
    try {
        const classroom = await timetableService.createClassroomService(req.body);
        await logActivity(req.user?.id, 'CREATE_CLASSROOM', 'Classroom', classroom.id, req.body);
        res.status(201).json(classroom);
    } catch (error) {
        sendError(res, error, 'Error creating classroom');
    }
};

export const updateTimetableEntry = async (req, res) => {
    try {
        const entry = await timetableService.updateTimetableEntryService(req.params.id, req.body);
        if (!entry) return res.status(404).json({ message: 'Timetable entry not found.' });
        await logActivity(req.user?.id, 'UPDATE_TIMETABLE', 'Timetable', req.params.id, req.body);
        res.status(200).json(entry);
    } catch (error) {
        sendError(res, error, 'Error updating timetable entry');
    }
};

export const deleteTimetableEntry = async (req, res) => {
    try {
        const removed = await timetableService.deleteTimetableEntryService(req.params.id);
        if (!removed) return res.status(404).json({ message: 'Timetable entry not found.' });
        await logActivity(req.user?.id, 'DELETE_TIMETABLE', 'Timetable', req.params.id);
        res.status(200).json({ message: 'Timetable entry deleted successfully.' });
    } catch (error) {
        sendError(res, error, 'Error deleting timetable entry');
    }
};

export const autoResolveConflicts = async (req, res) => {
    try {
        const result = await timetableService.autoResolveConflictsService(req.body);
        await logActivity(req.user?.id, 'RESOLVE_TIMETABLE_CONFLICTS', 'Timetable', null, req.body);
        res.status(200).json(result);
    } catch (error) {
        sendError(res, error, 'Error resolving timetable conflicts');
    }
};

export const createLectureSlot = async (req, res) => {
    try {
        const slot = await timetableService.createLectureSlotService(req.body);
        await logActivity(req.user?.id, 'CREATE_LECTURE_SLOT', 'LectureSlot', slot.id, req.body);
        res.status(201).json(slot);
    } catch (error) {
        sendError(res, error, 'Error creating lecture slot');
    }
};

export const updateLectureSlot = async (req, res) => {
    try {
        const slot = await timetableService.updateLectureSlotService(req.params.id, req.body);
        if (!slot) return res.status(404).json({ message: 'Lecture slot not found.' });
        await logActivity(req.user?.id, 'UPDATE_LECTURE_SLOT', 'LectureSlot', req.params.id, req.body);
        res.status(200).json(slot);
    } catch (error) {
        sendError(res, error, 'Error updating lecture slot');
    }
};

export const getLectureSlots = async (_req, res) => {
    try {
        const slots = await timetableService.getLectureSlotsService();
        res.status(200).json(slots);
    } catch (error) {
        sendError(res, error, 'Error fetching lecture slots');
    }
};

export const deleteLectureSlot = async (req, res) => {
    try {
        const removed = await timetableService.deleteLectureSlotService(req.params.id);
        if (!removed) return res.status(404).json({ message: 'Lecture slot not found.' });
        await logActivity(req.user?.id, 'DELETE_LECTURE_SLOT', 'LectureSlot', req.params.id);
        res.status(200).json({ message: 'Lecture slot deleted successfully.' });
    } catch (error) {
        sendError(res, error, 'Error deleting lecture slot');
    }
};
