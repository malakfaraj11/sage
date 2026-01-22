import mongoose from 'mongoose';

const messageSchema = mongoose.Schema({
    roomId: {
        type: String,
        required: true,
        index: true // Index for faster queries
    },
    senderId: {
        type: String, // Storing as String for now to match current prototype logic (or ObjectId if refactoring)
        required: true
    },
    text: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Message = mongoose.model('Message', messageSchema);
export default Message;
