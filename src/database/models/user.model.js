import { Schema, model } from 'mongoose';
import { roles } from '../enums/user.enum.js';
import ImageSchema from '../schemas/image.schema.js';

const userSchema = new Schema({
    role: {
        type: String,
        enum: Object.values(roles),
        default: roles.USER,
    },
    name: {
        type: String,
        required: true,
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
    emailVerifiedAt: {
        type: Date,
    },
}, {
    timestamps: true,
});

const User = model('User', userSchema);

export default User;
