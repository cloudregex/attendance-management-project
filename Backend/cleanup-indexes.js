import 'dotenv/config';
import sequelize from './config/db.js';

const cleanup = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connected to DB, checking for duplicate indexes...");

        const [results] = await sequelize.query('SHOW INDEX FROM departments;');
        
        // Find all indexes that look like duplicates (e.g. name_unique_1, name_unique_2)
        const allIndexes = results.map(r => r.Key_name);
        const duplicateIndexes = allIndexes.filter(name => name.includes('unique_') && /\d+$/.test(name));

        // Deduplicate the list (SHOW INDEX returns one row per column in the index)
        const uniqueDuplicates = [...new Set(duplicateIndexes)];

        console.log(`Found ${uniqueDuplicates.length} duplicate indexes.`);

        for (const idxName of uniqueDuplicates) {
            console.log(`Dropping index: ${idxName}...`);
            await sequelize.query(`DROP INDEX \`${idxName}\` ON departments;`);
        }

        // Also do the same for 'code_2', 'code_3' etc.
        const codeDuplicates = allIndexes.filter(name => name.startsWith('code_') && /\d+$/.test(name));
        const uniqueCodeDuplicates = [...new Set(codeDuplicates)];
        for (const idxName of uniqueCodeDuplicates) {
            console.log(`Dropping index: ${idxName}...`);
            await sequelize.query(`DROP INDEX \`${idxName}\` ON departments;`);
        }

        console.log("Cleanup complete!");
        process.exit(0);
    } catch (e) {
        console.error("Cleanup failed:", e);
        process.exit(1);
    }
};

cleanup();
