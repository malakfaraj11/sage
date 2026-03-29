import Message from '../models/Message.js';

// @desc    Get messages between two users
// @route   GET /api/messages/:recipientId
// @access  Public (should be protected in prod)
export const getMessages = async (req, res) => {
    try {
        const { recipientId } = req.params;
        const currentUserId = req.query.currentUserId; // Passed via query for now

        if (!currentUserId || !recipientId) {
            return res.status(400).json({ message: 'currentUserId and recipientId required' });
        }

        // Room logic
        const roomId = [currentUserId, recipientId].sort().join('-');

        const messages = await Message.find({ roomId }).sort({ timestamp: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Send a message
// @route   POST /api/messages/send
// @access  Public (should be protected in prod)
export const sendMessage = async (req, res) => {
    try {
        const { senderId, receiverId, content } = req.body;

        if (!senderId || !receiverId || !content) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const roomId = [senderId, receiverId].sort().join('-');

        const message = await Message.create({
            roomId,
            senderId,
            receiverId,
            text: content,
            isRead: false
        });

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get unread counts for all contacts
// @route   GET /api/messages/unread-count?currentUserId=X
// @access  Public
export const getUnreadCounts = async (req, res) => {
    try {
        const { currentUserId } = req.query;
        if (!currentUserId) return res.status(400).json({ message: 'currentUserId is required' });

        const unreadMessages = await Message.aggregate([
            { $match: { receiverId: currentUserId, isRead: false } },
            { $group: { _id: "$senderId", count: { $sum: 1 } } }
        ]);

        const unreadMap = {};
        unreadMessages.forEach(item => {
            unreadMap[item._id] = item.count;
        });

        res.json(unreadMap);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark messages as read
// @route   PUT /api/messages/mark-read/:senderId
// @access  Public (require currentUserId in body)
export const markAsRead = async (req, res) => {
    try {
        const { senderId } = req.params;
        const { currentUserId } = req.body;

        if (!senderId || !currentUserId) {
            return res.status(400).json({ message: 'senderId and currentUserId are required' });
        }

        // Marquer comme lus
        await Message.updateMany(
            { senderId: senderId, receiverId: currentUserId, isRead: false },
            { $set: { isRead: true } }
        );

        res.json({ message: 'Messages marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
