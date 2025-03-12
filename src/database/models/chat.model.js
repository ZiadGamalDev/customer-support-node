import { Schema, model } from 'mongoose';

const chatSchema = new Schema({
    participants: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true,
    }],
    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: 'Message',
    },
    unreadCount: { 
        type: Map, 
        of: Number,
        default: {},
    }
}, { timestamps: true });

const Chat = model('Chat', chatSchema);

export default Chat;
