import ActivityLog from '../model/activityLog.model.js';

/**
 * Log an activity to the database
 * @param {number|string} adminId - ID of the admin performing the action
 * @param {string} action - Action performed (e.g., 'CREATE', 'UPDATE', 'DELETE')
 * @param {string} entityType - Type of entity (e.g., 'User', 'Role', 'Permission')
 * @param {string|number} entityId - ID of the entity affected
 * @param {object} details - Additional details about the change
 */
export const logActivity = async (adminId, action, entityType, entityId, details = {}) => {
    try {
        await ActivityLog.create({
            adminId,
            action,
            entityType,
            entityId: entityId ? String(entityId) : null,
            details
        });
    } catch (error) {
        console.error("❌ Error logging activity:", error);
    }
};

export const getAllActivityLogs = async (limit = 100, offset = 0) => {
    return await ActivityLog.findAll({
        limit,
        offset,
        order: [['createdAt', 'DESC']]
    });
};
