import dotenv from 'dotenv';
dotenv.config();
import sequelize from './config/db.js';
import * as timetableService from './services/timetable.service.js';

async function run() {
    try {
        await sequelize.authenticate();
        console.log('Connected.');
        const res = await timetableService.createLectureSlotService({
            day_of_week: 'Monday',
            start_time: '18:00',
            end_time: '19:00',
            slot_type: 'lecture',
            sequence: 15
        });
        console.log('Success:', res.toJSON());
    } catch (error) {
        console.error('Error:', error.message);
    }
    process.exit();
}

run();
