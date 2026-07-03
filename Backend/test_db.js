import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env') });
import sequelize from './config/db.js';
import LectureSlot from './model/lectureSlot.model.js';

async function run() {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB');
        const res = await LectureSlot.create({
            day_of_week: 'Monday',
            start_time: '18:00',
            end_time: '19:00',
            slot_type: 'lecture',
            sequence: 12
        });
        console.log('Created slot:', res.toJSON());
    } catch (e) {
        console.error('Error:', e.message);
    }
    process.exit();
}
run();
