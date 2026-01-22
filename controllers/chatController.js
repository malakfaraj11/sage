import Message from '../models/Message.js';

// @desc    Get chat history for a room
// @route   GET /api/chat/history/:roomId
// @access  Public (should be protected in prod)
const getChatHistory = async (req, res) => {
    try {
        const { roomId } = req.params;
        const messages = await Message.find({ roomId }).sort({ timestamp: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getChatHistory };
