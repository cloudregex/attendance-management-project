import express from 'express';
import { saveToken, sendNotification } from '../controller/notification.controller.js';

const router = express.Router();

router.post('/token', saveToken);
router.post('/send', sendNotification);

export default router;
