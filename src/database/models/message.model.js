import { Schema, model } from 'mongoose';
import { statuses } from '../enums/message.enum.js';

const messageSchema = new Schema({
    chatId: {
        type: Schema.Types.ObjectId,
        ref: 'Chat',
        required: true,
        index: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    message: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: Object.values(statuses),
        default: statuses.SENT,
    },
}, { timestamps: true });

const Message = model('Message', messageSchema);

export default Message;
