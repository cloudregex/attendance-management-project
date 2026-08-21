import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';

const token = jwt.sign(
    { id: 1, role: 'admin', email: 'admin@example.com' },
    'attendance_pro_secret_key_2026',
    { expiresIn: '1h' }
);

async function test() {
    try {
        const res = await fetch('http://localhost:5000/api/timetable/slots', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                day_of_week: 'Monday',
                start_time: '09:00',
                end_time: '09:55',
                slot_type: 'lecture',
                sequence: 1
            })
        });
        const data = await res.json();
        console.log('Status:', res.status);
        console.log('Response:', data);
    } catch (e) {
        console.error(e);
    }
}
test();
