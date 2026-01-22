import User from '../models/User.js';

// @desc    Get all users with skills
// @route   GET /api/exchanges
// @access  Public
const getExchanges = async (req, res) => {
    try {
        // Find users who have at least one skill
        // We select only necessary fields to be lightweight/safe
        const users = await User.find({ 'skills.0': { $exists: true } })
            .select('name email role bio skills createdAt');

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getExchanges };
