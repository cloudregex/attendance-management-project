import express from 'express';
import { getActivityLogs } from '../controller/activity.controller.js';
import { checkAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/get', checkAuth, getActivityLogs);

export default router;
