import express from 'express';
import { getMessages, sendMessage, markAsRead, getUnreadCounts } from '../controllers/messageController.js';

const router = express.Router();

router.get('/unread-count', getUnreadCounts);
router.get('/:recipientId', getMessages);
router.post('/send', sendMessage);
router.put('/mark-read/:senderId', markAsRead);

export default router;
