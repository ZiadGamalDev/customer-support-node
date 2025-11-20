import { Schema, model } from 'mongoose';
import { roles, statuses } from '../enums/user.enum.js';
import ImageSchema from '../schemas/image.schema.js';

const userSchema = new Schema({
    role: {
        type: String,
        enum: Object.values(roles),
        default: roles.USER,
    },
    status: {
        type: String,
        enum: Object.values(statuses),
        default: statuses.AWAY,
    },
    name: {
        type: String,
        // required: true, // Made optional to support ecommerce users
        trim: true,
    },
    username: { // Added to support ecommerce users
        type: String,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    // image: {
    //     type: String,
    //     trim: true,
    // },
    image: ImageSchema,
    age: {
        type: Number,
        trim: true,
    },
    chatsCount: {
        type: Number,
        default: 0,
    },
    emailVerifiedAt: {
        type: Date,
    },
    otp: {
        code: {
            type: String,
        },
        expiry: {
            type: Date,
        },
    },
}, {
    timestamps: true,
});


const User = model('User', userSchema);

export default User;
