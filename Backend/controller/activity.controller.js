import * as activityService from '../services/activity.service.js';

export const getActivityLogs = async (req, res) => {
    try {
        const { limit = 100, offset = 0 } = req.query;
        const logs = await activityService.getAllActivityLogs(parseInt(limit), parseInt(offset));
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: "Error fetching activity logs" });
    }
};
