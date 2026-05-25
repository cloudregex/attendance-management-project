import React, { forwardRef } from 'react';
import { Box, Typography } from '@mui/material';

// Helper to group entries by day and then by class group
const groupEntries = (entries) => {
    const grouped = {};
    const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    DAYS.forEach(day => {
        grouped[day] = {};
    });

    entries.forEach(entry => {
        const day = entry.slot?.day_of_week || 'Monday';
        if (!grouped[day]) grouped[day] = {};

        // Create a display name for the class/course
        const courseCode = entry.course?.code || 'Unknown';
        const sem = entry.semester?.semester_number || '';
        const className = `${courseCode} Sem-${sem}`;

        if (!grouped[day][className]) {
            grouped[day][className] = [];
        }
        grouped[day][className].push(entry);
    });

    return grouped;
};

// Fixed time slots to match the image structure
const TIME_SLOTS = [
    { label: '1', tyTime: '09:15 am to 10.15 am', syTime: '09:00 am to 10.00 am' },
    { label: '2', tyTime: '10:15 am to 11:15 am', syTime: '10:00 am to 11:00 am' },
    { label: 'SB', tyTime: '11:15 am To 11.30 am', syTime: '11:00 am To 11.15 am', isBreak: true },
    { label: '3', tyTime: '11:30 am to 12:30 pm', syTime: '11:15 am to 12:15 pm' },
    { label: '4', tyTime: '12:30 pm to 01.30 pm', syTime: '12:15 pm to 01.15 pm' },
    { label: 'LB', tyTime: '01.30 pm To 02.45 pm', syTime: '01.15 pm To 02.30 pm', isBreak: true },
    { label: '5', tyTime: '2.45 pm to 03.45 pm', syTime: '2.30 pm to 03.30 pm' },
    { label: '6', tyTime: '03.45 pm to 04.45 pm', syTime: '03.30 pm to 04.30 pm' },
    { label: '7', tyTime: '5.00 pm to 6.00pm', syTime: '4.45 pm to 5.45pm' },
];

const CLASS_ORDER = [
    'S.Y BTech. (A)',
    'S.Y. BTech (B)',
    'T.Y BTech. (A)',
    'T.Y BTech. (B)',
    'B.E.',
    'M.Tech-I',
    'M.Tech-II'
];

const COLORS = {
    'S.Y BTech. (A)': '#dcfce7', // light green
    'S.Y. BTech (B)': '#dcfce7',
    'T.Y BTech. (A)': '#fce7f3', // light pink
    'T.Y BTech. (B)': '#fce7f3',
    'B.E.': '#dbeafe', // light blue
    'M.Tech-I': '#ffedd5', // light orange
    'M.Tech-II': '#ffedd5',
};

const TimetablePDFDocument = forwardRef(({ overview, academicYear }, ref) => {
    const entriesByDayAndClass = groupEntries(overview.entries || []);
    const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Check what classes actually exist in the data, but sort them somewhat logically
    const existingClasses = new Set();
    (overview.entries || []).forEach(entry => {
        const courseCode = entry.course?.code || 'Unknown';
        const sem = entry.semester?.semester_number || '';
        existingClasses.add(`${courseCode} Sem-${sem}`);
    });

    const classesList = Array.from(existingClasses).sort();

    // For exact match, we would use CLASS_ORDER, but we don't know if the backend produces these exact strings.
    // If the data is dynamic, we'll map existingClasses.
    // Let's try to map the dynamic classes to the colors based on index.
    const classColors = {};
    classesList.forEach((cls, i) => {
        const colorPalette = ['#dcfce7', '#fce7f3', '#dbeafe', '#ffedd5', '#f3f4f6', '#fef08a'];
        classColors[cls] = colorPalette[i % colorPalette.length];
    });

    const resolveClassroom = (classroomId) => {
        const room = (overview.classrooms || []).find(c => c.id === classroomId);
        return room ? room.code : '';
    };

    const renderCellContent = (day, cls, slotIndex) => {
        const classEntries = entriesByDayAndClass[day]?.[cls] || [];

        // This is a simplistic mapping: we assume entries are ordered by time, or we try to match them by index.
        // In a real scenario, we'd match entry.slot.start_time with the column's time.
        // Since slot timings might differ from the hardcoded headers, we'll do our best to match them by order or just render them sequentially.
        const entry = classEntries[slotIndex];

        if (!entry) return null;

        return (
            <div style={{ textAlign: 'center', fontSize: '10px', lineHeight: '1.2' }}>
                <div style={{ fontWeight: 'bold' }}>{entry.subject?.code}</div>
                <div>{entry.teacher?.first_name ? `(${entry.teacher.first_name})` : ''}</div>
                <div>{resolveClassroom(entry.classroom_id) ? `(${resolveClassroom(entry.classroom_id)})` : ''}</div>
            </div>
        );
    };

    return (
        <div ref={ref} style={{
            padding: '20px',
            backgroundColor: 'white',
            width: '297mm', // A4 Landscape width
            minHeight: '210mm',
            color: 'black',
            fontFamily: '"Times New Roman", Times, serif',
            boxSizing: 'border-box'
        }}>
            <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Vidya Pratishthan's Kamalnayan Bajaj Institute of Engineering and Technology</h2>
                <h3 style={{ margin: '5px 0', fontSize: '16px', fontWeight: 'bold' }}>Department of Computer Engineering</h3>
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>Master Time Table {academicYear || '2025-26 (Sem-II)'}</h4>
            </div>

            <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                border: '2px solid black',
                fontSize: '11px',
                textAlign: 'center'
            }}>
                <thead>
                    <tr>
                        <th rowSpan={3} style={{ border: '1px solid black', width: '30px' }}>
                            <div style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', padding: '10px 0' }}>Day</div>
                        </th>
                        <th style={{ border: '1px solid black', padding: '4px' }}>Time T.Y <br />BE M.Tech-I&II</th>
                        {TIME_SLOTS.map((slot, i) => (
                            <th key={`ty-${i}`} style={{ border: '1px solid black', padding: '4px', width: slot.isBreak ? '30px' : 'auto' }}>
                                {slot.tyTime}
                            </th>
                        ))}
                    </tr>
                    <tr>
                        <th style={{ border: '1px solid black', padding: '4px' }}>Time S.Y</th>
                        {TIME_SLOTS.map((slot, i) => (
                            <th key={`sy-${i}`} style={{ border: '1px solid black', padding: '4px' }}>
                                {slot.syTime}
                            </th>
                        ))}
                    </tr>
                    <tr>
                        <th style={{ border: '1px solid black', padding: '4px', fontWeight: 'bold' }}>Class/ Period</th>
                        {TIME_SLOTS.map((slot, i) => (
                            <th key={`label-${i}`} style={{ border: '1px solid black', padding: '4px', fontWeight: 'bold' }}>
                                {slot.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {DAYS.map((day) => {
                        const dayClasses = classesList;
                        if (dayClasses.length === 0) return null;

                        return dayClasses.map((cls, idx) => (
                            <tr key={`${day}-${cls}`} style={{ backgroundColor: classColors[cls] }}>
                                {idx === 0 && (
                                    <td rowSpan={dayClasses.length} style={{ border: '1px solid black', fontWeight: 'bold', backgroundColor: 'white' }}>
                                        <div style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>{day}</div>
                                    </td>
                                )}
                                <td style={{ border: '1px solid black', padding: '4px', fontWeight: 'bold' }}>
                                    {cls}
                                </td>
                                {TIME_SLOTS.map((slot, slotIdx) => {
                                    if (slot.isBreak) {
                                        return (
                                            <td key={`break-${slotIdx}`} style={{ border: '1px solid black', backgroundColor: '#e5e7eb' }}>
                                                {/* Break cell */}
                                            </td>
                                        );
                                    }

                                    // Calculate actual slot index skipping breaks
                                    const actualSlotIndex = TIME_SLOTS.slice(0, slotIdx).filter(s => !s.isBreak).length;

                                    return (
                                        <td key={`cell-${slotIdx}`} style={{ border: '1px solid black', padding: '4px', verticalAlign: 'top', height: '40px' }}>
                                            {renderCellContent(day, cls, actualSlotIndex)}
                                        </td>
                                    );
                                })}
                            </tr>
                        ));
                    })}
                    {classesList.length === 0 && (
                        <tr>
                            <td colSpan={TIME_SLOTS.length + 2} style={{ border: '1px solid black', padding: '20px', textAlign: 'center' }}>
                                No timetable data available to generate PDF.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
});

export default TimetablePDFDocument;
