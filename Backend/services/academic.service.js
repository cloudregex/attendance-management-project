import Course from '../model/course.model.js';
import Subject from '../model/subject.model.js';
import Semester from '../model/semester.model.js';
import Credit from '../model/credit.model.js';
import Curriculum from '../model/curriculum.model.js';
import SubjectAllocation from '../model/subjectAllocation.model.js';
import Department from '../model/department.model.js';
import Teacher from '../model/teacher.model.js';

const academicIncludes = {
    course: [{ model: Department, as: 'department', attributes: ['id', 'name', 'code'] }],
    subject: [
        { model: Department, as: 'department', attributes: ['id', 'name', 'code'] },
        { model: Credit, as: 'credit' },
    ],
    semester: [{ model: Course, as: 'course', attributes: ['id', 'name', 'code'] }],
    curriculum: [
        { model: Course, as: 'course', attributes: ['id', 'name', 'code'] },
        { model: Semester, as: 'semester', attributes: ['id', 'name', 'semester_number'] },
        { model: Subject, as: 'subject', attributes: ['id', 'name', 'code', 'subject_type'] },
    ],
    allocation: [
        { model: Subject, as: 'subject', attributes: ['id', 'name', 'code', 'subject_type'] },
        { model: Course, as: 'course', attributes: ['id', 'name', 'code'] },
        { model: Semester, as: 'semester', attributes: ['id', 'name', 'semester_number'] },
        { model: Department, as: 'department', attributes: ['id', 'name', 'code'] },
        { model: Teacher, as: 'teacher', attributes: ['id', 'first_name', 'email', 'employee_id'] },
    ],
};

const parsePrerequisites = (value) => {
    if (Array.isArray(value)) return value;
    if (!value) return [];
    return String(value)
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
};

const calculateTotalCredits = ({ lecture = 0, tutorial = 0, practical = 0, total }) => {
    if (total !== undefined && total !== null && total !== '') return Number(total);
    return Number(lecture || 0) + Number(tutorial || 0) + Number(practical || 0);
};

export const getAcademicOverviewService = async () => {
    const [subjects, courses, semesters, curriculum, allocations] = await Promise.all([
        Subject.findAll({ include: academicIncludes.subject, order: [['createdAt', 'DESC']] }),
        Course.findAll({ include: academicIncludes.course, order: [['createdAt', 'DESC']] }),
        Semester.findAll({ include: academicIncludes.semester, order: [['course_id', 'ASC'], ['semester_number', 'ASC']] }),
        Curriculum.findAll({ include: academicIncludes.curriculum, order: [['createdAt', 'DESC']] }),
        SubjectAllocation.findAll({ include: academicIncludes.allocation, order: [['createdAt', 'DESC']] }),
    ]);

    return { subjects, courses, semesters, curriculum, allocations };
};

export const getSubjectsService = () => Subject.findAll({ include: academicIncludes.subject, order: [['createdAt', 'DESC']] });

export const createSubjectService = async (data) => {
    const subject = await Subject.create({
        ...data,
        prerequisites: parsePrerequisites(data.prerequisites),
        status: data.status !== undefined ? data.status : true,
    });

    if (data.credit) {
        await Credit.create({
            subject_id: subject.id,
            lecture: Number(data.credit.lecture || 0),
            tutorial: Number(data.credit.tutorial || 0),
            practical: Number(data.credit.practical || 0),
            total: calculateTotalCredits(data.credit),
        });
    }

    return Subject.findByPk(subject.id, { include: academicIncludes.subject });
};

export const updateSubjectService = async (id, data) => {
    const subject = await Subject.findByPk(id);
    if (!subject) return null;

    await subject.update({
        ...data,
        ...(data.prerequisites !== undefined && { prerequisites: parsePrerequisites(data.prerequisites) }),
    });

    if (data.credit) {
        const [credit] = await Credit.findOrCreate({
            where: { subject_id: subject.id },
            defaults: { subject_id: subject.id },
        });
        await credit.update({
            lecture: Number(data.credit.lecture || 0),
            tutorial: Number(data.credit.tutorial || 0),
            practical: Number(data.credit.practical || 0),
            total: calculateTotalCredits(data.credit),
        });
    }

    return Subject.findByPk(subject.id, { include: academicIncludes.subject });
};

export const deleteSubjectService = async (id) => {
    const subject = await Subject.findByPk(id);
    if (!subject) return null;
    await subject.destroy();
    return true;
};

export const getCoursesService = () => Course.findAll({ include: academicIncludes.course, order: [['createdAt', 'DESC']] });

export const createCourseService = async (data) => Course.create({
    ...data,
    duration_semesters: Number(data.duration_semesters || 8),
    status: data.status !== undefined ? data.status : true,
});

export const updateCourseService = async (id, data) => {
    const course = await Course.findByPk(id);
    if (!course) return null;
    await course.update({
        ...data,
        ...(data.duration_semesters !== undefined && { duration_semesters: Number(data.duration_semesters) }),
    });
    return Course.findByPk(id, { include: academicIncludes.course });
};

export const deleteCourseService = async (id) => {
    const course = await Course.findByPk(id);
    if (!course) return null;
    await course.destroy();
    return true;
};

export const getSemestersService = () => Semester.findAll({ include: academicIncludes.semester, order: [['course_id', 'ASC'], ['semester_number', 'ASC']] });

export const createSemesterService = (data) => Semester.create({
    ...data,
    semester_number: Number(data.semester_number),
    status: data.status !== undefined ? data.status : true,
});

export const updateSemesterService = async (id, data) => {
    const semester = await Semester.findByPk(id);
    if (!semester) return null;
    await semester.update({
        ...data,
        ...(data.semester_number !== undefined && { semester_number: Number(data.semester_number) }),
    });
    return Semester.findByPk(id, { include: academicIncludes.semester });
};

export const deleteSemesterService = async (id) => {
    const semester = await Semester.findByPk(id);
    if (!semester) return null;
    await semester.destroy();
    return true;
};

export const getCurriculumService = () => Curriculum.findAll({ include: academicIncludes.curriculum, order: [['createdAt', 'DESC']] });

export const createCurriculumService = (data) => Curriculum.create({
    ...data,
    is_mandatory: data.is_mandatory !== undefined ? data.is_mandatory : true,
    status: data.status !== undefined ? data.status : true,
});

export const updateCurriculumService = async (id, data) => {
    const curriculum = await Curriculum.findByPk(id);
    if (!curriculum) return null;
    await curriculum.update(data);
    return Curriculum.findByPk(id, { include: academicIncludes.curriculum });
};

export const deleteCurriculumService = async (id) => {
    const curriculum = await Curriculum.findByPk(id);
    if (!curriculum) return null;
    await curriculum.destroy();
    return true;
};

export const getCreditsService = () => Credit.findAll({ include: [{ model: Subject, as: 'subject', attributes: ['id', 'name', 'code'] }] });

export const upsertCreditService = async (data) => {
    const [credit] = await Credit.findOrCreate({
        where: { subject_id: data.subject_id },
        defaults: { subject_id: data.subject_id },
    });
    return credit.update({
        lecture: Number(data.lecture || 0),
        tutorial: Number(data.tutorial || 0),
        practical: Number(data.practical || 0),
        total: calculateTotalCredits(data),
    });
};

export const getAllocationsService = () => SubjectAllocation.findAll({ include: academicIncludes.allocation, order: [['createdAt', 'DESC']] });

export const createAllocationService = (data) => SubjectAllocation.create({
    ...data,
    weekly_periods: Number(data.weekly_periods || 4),
    status: data.status !== undefined ? data.status : true,
});

export const updateAllocationService = async (id, data) => {
    const allocation = await SubjectAllocation.findByPk(id);
    if (!allocation) return null;
    await allocation.update({
        ...data,
        ...(data.weekly_periods !== undefined && { weekly_periods: Number(data.weekly_periods) }),
    });
    return SubjectAllocation.findByPk(id, { include: academicIncludes.allocation });
};

export const deleteAllocationService = async (id) => {
    const allocation = await SubjectAllocation.findByPk(id);
    if (!allocation) return null;
    await allocation.destroy();
    return true;
};
