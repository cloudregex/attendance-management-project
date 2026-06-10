import { Op } from 'sequelize';
import Classroom from '../model/classroom.model.js';
import LectureSlot from '../model/lectureSlot.model.js';
import FacultySchedule from '../model/facultySchedule.model.js';
import Timetable from '../model/timetable.model.js';
import RoomAllocation from '../model/roomAllocation.model.js';
import SubjectAllocation from '../model/subjectAllocation.model.js';
import Subject from '../model/subject.model.js';
import Course from '../model/course.model.js';
import Semester from '../model/semester.model.js';
import Department from '../model/department.model.js';
import Teacher from '../model/teacher.model.js';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const DEFAULT_SLOTS = [
    ['09:00:00', '09:55:00', 'lecture'],
    ['10:00:00', '10:55:00', 'lecture'],
    ['11:00:00', '11:20:00', 'break'],
    ['11:20:00', '12:15:00', 'lecture'],
    ['12:20:00', '13:15:00', 'lecture'],
    ['13:15:00', '14:00:00', 'lunch'],
    ['14:00:00', '14:55:00', 'lecture'],
    ['15:00:00', '15:55:00', 'lecture'],
];

const timetableIncludes = [
    { model: Subject, as: 'subject', attributes: ['id', 'name', 'code', 'subject_type'] },
    { model: Course, as: 'course', attributes: ['id', 'name', 'code'] },
    { model: Semester, as: 'semester', attributes: ['id', 'name', 'semester_number'] },
    { model: Department, as: 'department', attributes: ['id', 'name', 'code'] },
    { model: Teacher, as: 'teacher', attributes: ['id', 'first_name', 'employee_id'] },
    { model: LectureSlot, as: 'slot' },
    { model: Classroom, as: 'classroom' },
];

const allocationIncludes = [
    { model: Subject, as: 'subject', attributes: ['id', 'name', 'code', 'subject_type'] },
    { model: Course, as: 'course', attributes: ['id', 'name', 'code'] },
    { model: Semester, as: 'semester', attributes: ['id', 'name', 'semester_number'] },
    { model: Department, as: 'department', attributes: ['id', 'name', 'code'] },
    { model: Teacher, as: 'teacher', attributes: ['id', 'first_name', 'employee_id'] },
];

export const seedTimetableDefaults = async () => {
    for (const day of DAYS) {
        for (let index = 0; index < DEFAULT_SLOTS.length; index += 1) {
            const [start_time, end_time, slot_type] = DEFAULT_SLOTS[index];
            await LectureSlot.findOrCreate({
                where: { day_of_week: day, sequence: index + 1 },
                defaults: { day_of_week: day, start_time, end_time, slot_type, sequence: index + 1, status: true },
            });
        }
    }

    const departments = await Department.findAll({ order: [['id', 'ASC']] });
    for (const department of departments) {
        await Classroom.findOrCreate({
            where: { code: `${department.code || department.id}-101` },
            defaults: {
                name: `${department.name} Lecture Room`,
                code: `${department.code || department.id}-101`,
                room_type: 'lecture',
                capacity: 60,
                department_id: department.id,
                status: true,
            },
        });
        await Classroom.findOrCreate({
            where: { code: `${department.code || department.id}-LAB` },
            defaults: {
                name: `${department.name} Lab`,
                code: `${department.code || department.id}-LAB`,
                room_type: 'lab',
                capacity: 40,
                department_id: department.id,
                status: true,
            },
        });
    }
};

export const getTimetableOverviewService = async () => {
    await seedTimetableDefaults();
    const [entries, classrooms, slots, facultyAvailability, allocations] = await Promise.all([
        Timetable.findAll({ include: timetableIncludes, order: [[{ model: LectureSlot, as: 'slot' }, 'sequence', 'ASC']] }),
        Classroom.findAll({ order: [['code', 'ASC']] }),
        LectureSlot.findAll({ order: [['day_of_week', 'ASC'], ['sequence', 'ASC']] }),
        FacultySchedule.findAll({ order: [['day_of_week', 'ASC'], ['start_time', 'ASC']] }),
        SubjectAllocation.findAll({ include: allocationIncludes, order: [['createdAt', 'DESC']] }),
    ]);
    const conflicts = detectConflicts(entries);
    return { entries, classrooms, slots, facultyAvailability, allocations, conflicts };
};

const isUnavailable = (availability, teacherId, slot) =>
    availability.some((item) =>
        String(item.teacher_id) === String(teacherId) &&
        item.day_of_week === slot.day_of_week &&
        item.availability_status === 'unavailable' &&
        item.start_time <= slot.start_time &&
        item.end_time >= slot.end_time
    );

const pickSlotAndRoom = ({ allocation, slots, classrooms, availability, usedTeacherSlots, usedRoomSlots, usedGroupSlots, indexOffset }) => {
    const isLab = allocation.subject?.subject_type === 'lab';
    const preferredRooms = classrooms.filter((room) =>
        room.status &&
        (!room.department_id || String(room.department_id) === String(allocation.department_id)) &&
        (isLab ? room.room_type === 'lab' : room.room_type !== 'lab')
    );
    const fallbackRooms = classrooms.filter((room) => room.status && (isLab ? room.room_type === 'lab' : true));
    const roomPool = preferredRooms.length ? preferredRooms : fallbackRooms;
    const teachableSlots = slots.filter((slot) => slot.status && slot.slot_type === 'lecture');

    for (let shift = 0; shift < teachableSlots.length; shift += 1) {
        const slot = teachableSlots[(indexOffset + shift) % teachableSlots.length];
        const teacherKey = `${allocation.teacher_id || 'unassigned'}-${slot.id}`;
        const groupKey = `${allocation.course_id}-${allocation.semester_id}-${slot.id}`;
        if (allocation.teacher_id && usedTeacherSlots.has(teacherKey)) continue;
        if (usedGroupSlots.has(groupKey)) continue;
        if (allocation.teacher_id && isUnavailable(availability, allocation.teacher_id, slot)) continue;

        for (const room of roomPool) {
            const roomKey = `${room.id}-${slot.id}`;
            if (usedRoomSlots.has(roomKey)) continue;
            return { slot, room };
        }
    }

    return { slot: teachableSlots[indexOffset % teachableSlots.length], room: roomPool[0] };
};

export const generateTimetableService = async ({ academic_year, replaceDraft = true } = {}) => {
    await seedTimetableDefaults();
    const allocations = await SubjectAllocation.findAll({
        where: { status: true, ...(academic_year ? { academic_year } : {}) },
        include: allocationIncludes,
        order: [['department_id', 'ASC'], ['course_id', 'ASC'], ['semester_id', 'ASC']],
    });

    if (replaceDraft) {
        const drafts = await Timetable.findAll({ where: { timetable_status: 'draft', ...(academic_year ? { academic_year } : {}) } });
        const draftIds = drafts.map((entry) => entry.id);
        if (draftIds.length) {
            await RoomAllocation.destroy({ where: { timetable_id: { [Op.in]: draftIds } } });
            await Timetable.destroy({ where: { id: { [Op.in]: draftIds } } });
        }
    }

    const [slots, classrooms, availability] = await Promise.all([
        LectureSlot.findAll({ order: [['day_of_week', 'ASC'], ['sequence', 'ASC']] }),
        Classroom.findAll({ order: [['department_id', 'ASC'], ['room_type', 'ASC']] }),
        FacultySchedule.findAll(),
    ]);

    const existing = await Timetable.findAll({ where: { timetable_status: 'published', ...(academic_year ? { academic_year } : {}) } });
    const usedTeacherSlots = new Set(existing.filter((entry) => entry.teacher_id).map((entry) => `${entry.teacher_id}-${entry.lecture_slot_id}`));
    const usedRoomSlots = new Set(existing.filter((entry) => entry.classroom_id).map((entry) => `${entry.classroom_id}-${entry.lecture_slot_id}`));
    const usedGroupSlots = new Set(existing.map((entry) => `${entry.course_id}-${entry.semester_id}-${entry.lecture_slot_id}`));

    const created = [];
    let indexOffset = 0;

    for (const allocation of allocations) {
        const periods = Math.max(Number(allocation.weekly_periods || 1), allocation.subject?.subject_type === 'lab' ? 2 : 1);
        for (let period = 0; period < periods; period += 1) {
            const { slot, room } = pickSlotAndRoom({
                allocation,
                slots,
                classrooms,
                availability,
                usedTeacherSlots,
                usedRoomSlots,
                usedGroupSlots,
                indexOffset,
            });
            if (!slot) break;

            const entry = await Timetable.create({
                course_id: allocation.course_id,
                semester_id: allocation.semester_id,
                subject_id: allocation.subject_id,
                teacher_id: allocation.teacher_id,
                department_id: allocation.department_id,
                lecture_slot_id: slot.id,
                classroom_id: room?.id || null,
                academic_year: allocation.academic_year,
                timetable_status: 'draft',
                source_allocation_id: allocation.id,
                notes: allocation.subject?.subject_type === 'lab' ? 'Lab session scheduling enabled' : 'Auto generated',
                status: true,
            });

            if (room) {
                await RoomAllocation.create({
                    timetable_id: entry.id,
                    classroom_id: room.id,
                    lecture_slot_id: slot.id,
                    allocation_status: 'reserved',
                });
                usedRoomSlots.add(`${room.id}-${slot.id}`);
            }
            if (allocation.teacher_id) usedTeacherSlots.add(`${allocation.teacher_id}-${slot.id}`);
            usedGroupSlots.add(`${allocation.course_id}-${allocation.semester_id}-${slot.id}`);
            created.push(entry);
            indexOffset += 1;
        }
    }

    const entries = await Timetable.findAll({ include: timetableIncludes });
    return { createdCount: created.length, conflicts: detectConflicts(entries), entries };
};

export const detectConflicts = (entries) => {
    const conflicts = [];
    const seen = {
        teacher: new Map(),
        room: new Map(),
        group: new Map(),
    };

    for (const entry of entries) {
        const teacherKey = entry.teacher_id ? `${entry.teacher_id}-${entry.lecture_slot_id}` : null;
        const roomKey = entry.classroom_id ? `${entry.classroom_id}-${entry.lecture_slot_id}` : null;
        const groupKey = `${entry.course_id}-${entry.semester_id}-${entry.lecture_slot_id}`;

        [
            ['teacher', teacherKey, 'Faculty clash'],
            ['room', roomKey, 'Classroom clash'],
            ['group', groupKey, 'Course semester clash'],
        ].forEach(([type, key, message]) => {
            if (!key) return;
            if (seen[type].has(key)) {
                conflicts.push({ type, message, entryIds: [seen[type].get(key), entry.id] });
            } else {
                seen[type].set(key, entry.id);
            }
        });
    }

    return conflicts;
};

export const createClassroomService = (data) => Classroom.create({ ...data, status: data.status !== undefined ? data.status : true });
export const updateTimetableEntryService = async (id, data) => {
    const entry = await Timetable.findByPk(id);
    if (!entry) return null;
    await entry.update(data);
    if (data.classroom_id || data.lecture_slot_id) {
        await RoomAllocation.destroy({ where: { timetable_id: id } });
        if (entry.classroom_id && entry.lecture_slot_id) {
            await RoomAllocation.create({
                timetable_id: entry.id,
                classroom_id: entry.classroom_id,
                lecture_slot_id: entry.lecture_slot_id,
                allocation_status: 'reserved',
            });
        }
    }
    return Timetable.findByPk(id, { include: timetableIncludes });
};

export const deleteTimetableEntryService = async (id) => {
    const entry = await Timetable.findByPk(id);
    if (!entry) return null;
    await RoomAllocation.destroy({ where: { timetable_id: id } });
    await entry.destroy();
    return true;
};

export const publishTimetableService = async ({ academic_year } = {}) => {
    const where = { timetable_status: 'draft', ...(academic_year ? { academic_year } : {}) };
    const [updated] = await Timetable.update({ timetable_status: 'published' }, { where });
    return { publishedCount: updated };
};

export const autoResolveConflictsService = async ({ academic_year } = {}) => {
    const entries = await Timetable.findAll({ where: { timetable_status: 'draft', ...(academic_year ? { academic_year } : {}) }, include: timetableIncludes });
    const conflicts = detectConflicts(entries);
    if (conflicts.length === 0) return { resolvedCount: 0 };

    const [slots, classrooms, availability, existingPublished] = await Promise.all([
        LectureSlot.findAll({ order: [['day_of_week', 'ASC'], ['sequence', 'ASC']] }),
        Classroom.findAll({ order: [['department_id', 'ASC'], ['room_type', 'ASC']] }),
        FacultySchedule.findAll(),
        Timetable.findAll({ where: { timetable_status: 'published', ...(academic_year ? { academic_year } : {}) } })
    ]);

    const usedTeacherSlots = new Set(existingPublished.filter(e => e.teacher_id).map(e => `${e.teacher_id}-${e.lecture_slot_id}`));
    const usedRoomSlots = new Set(existingPublished.filter(e => e.classroom_id).map(e => `${e.classroom_id}-${e.lecture_slot_id}`));
    const usedGroupSlots = new Set(existingPublished.map(e => `${e.course_id}-${e.semester_id}-${e.lecture_slot_id}`));

    // Rebuild current draft usage minus conflicted entries
    const conflictedEntryIds = new Set(conflicts.flatMap(c => c.entryIds));
    const validDrafts = entries.filter(e => !conflictedEntryIds.has(e.id));
    validDrafts.forEach(entry => {
        if (entry.teacher_id) usedTeacherSlots.add(`${entry.teacher_id}-${entry.lecture_slot_id}`);
        if (entry.classroom_id) usedRoomSlots.add(`${entry.classroom_id}-${entry.lecture_slot_id}`);
        usedGroupSlots.add(`${entry.course_id}-${entry.semester_id}-${entry.lecture_slot_id}`);
    });

    let resolvedCount = 0;
    const conflictedEntries = entries.filter(e => conflictedEntryIds.has(e.id));

    for (const entry of conflictedEntries) {
        let indexOffset = 0;
        const { slot, room } = pickSlotAndRoom({
            allocation: {
                teacher_id: entry.teacher_id,
                course_id: entry.course_id,
                semester_id: entry.semester_id,
                department_id: entry.department_id,
                subject: entry.subject
            },
            slots,
            classrooms,
            availability,
            usedTeacherSlots,
            usedRoomSlots,
            usedGroupSlots,
            indexOffset
        });

        if (slot) {
            await updateTimetableEntryService(entry.id, {
                lecture_slot_id: slot.id,
                classroom_id: room?.id || null,
                notes: entry.notes ? `${entry.notes} (Auto-resolved)` : 'Auto-resolved clash'
            });
            if (entry.teacher_id) usedTeacherSlots.add(`${entry.teacher_id}-${slot.id}`);
            if (room) usedRoomSlots.add(`${room.id}-${slot.id}`);
            usedGroupSlots.add(`${entry.course_id}-${entry.semester_id}-${slot.id}`);
            resolvedCount++;
        }
    }

    return { resolvedCount };
};

export const createLectureSlotService = async (data) => {
    return LectureSlot.create(data);
};

export const updateLectureSlotService = async (id, data) => {
    const slot = await LectureSlot.findByPk(id);
    if (!slot) return null;
    return slot.update(data);
};

export const getLectureSlotsService = async () => {
    return LectureSlot.findAll({ order: [['day_of_week', 'ASC'], ['sequence', 'ASC']] });
};

export const deleteLectureSlotService = async (id) => {
    const slot = await LectureSlot.findByPk(id);
    if (!slot) return null;
    await slot.destroy();
    return true;
};

