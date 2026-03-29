import User from '../models/User.js';
import Message from '../models/Message.js';

// @desc    Get all users for chat contact list
// @route   GET /api/users
// @access  Public (should be protected in prod)
export const getUsers = async (req, res) => {
    try {
        const { currentUserId } = req.query;
        const users = await User.find({}, '-password').sort({ name: 1 });
        
        let usersWithUnread = [];
        
        for (let user of users) {
             const userObj = user.toObject();
             if (currentUserId) {
                 const unreadCount = await Message.countDocuments({
                     senderId: user._id.toString(),
                     receiverId: currentUserId,
                     isRead: false
                 });
                 userObj.unreadCount = unreadCount;
             }
             usersWithUnread.push(userObj);
        }

        res.json(usersWithUnread);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
