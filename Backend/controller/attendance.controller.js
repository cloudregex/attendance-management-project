import Attendance from '../model/attendance.model.js';
import Student from '../model/student.model.js';
import Timetable from '../model/timetable.model.js';
import Subject from '../model/subject.model.js';
import Course from '../model/course.model.js';
import { Op } from 'sequelize';

export const getAttendanceReport = async (req, res) => {
    try {
        const { startDate, endDate, course_id, status } = req.query;

        // Build filter options
        const whereOptions = {};
        if (startDate && endDate) {
            whereOptions.date = {
                [Op.between]: [startDate, endDate],
            };
        } else if (startDate) {
            whereOptions.date = {
                [Op.gte]: startDate,
            };
        } else if (endDate) {
            whereOptions.date = {
                [Op.lte]: endDate,
            };
        }

        if (status) {
            whereOptions.status = status;
        }

        const includeTimetable = {
            model: Timetable,
            as: 'timetable',
            include: [
                { model: Subject, as: 'subject', attributes: ['id', 'name', 'code'] },
                { model: Course, as: 'course', attributes: ['id', 'name', 'code'] },
            ]
        };

        if (course_id) {
            includeTimetable.where = { course_id };
        }

        const attendanceRecords = await Attendance.findAll({
            where: whereOptions,
            include: [
                {
                    model: Student,
                    as: 'student',
                    attributes: ['id', 'first_name', 'last_name', 'roll_number'],
                },
                includeTimetable
            ],
            order: [['date', 'DESC']],
        });

        // Calculate summary metrics
        const summary = {
            total: attendanceRecords.length,
            present: 0,
            absent: 0,
            late: 0,
            excused: 0,
        };

        attendanceRecords.forEach(record => {
            if (summary[record.status] !== undefined) {
                summary[record.status]++;
            }
        });

        // Add overall attendance rate
        const attendableRecords = summary.present + summary.absent + summary.late;
        const attendanceRate = attendableRecords > 0 
            ? ((summary.present + summary.late) / attendableRecords) * 100 
            : 0;

        res.status(200).json({
            success: true,
            data: attendanceRecords,
            summary: {
                ...summary,
                attendanceRate: attendanceRate.toFixed(2),
            },
        });
    } catch (error) {
        console.error('Error fetching attendance report:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
