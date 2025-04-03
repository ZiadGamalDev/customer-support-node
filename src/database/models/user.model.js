import { Schema, model } from 'mongoose';
import { roles, statuses } from '../enums/user.enum.js';
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
    status: {
        type: String,
        enum: Object.values(statuses),
        default: statuses.ONLINE,
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
    deletedAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});

// Auto-exclude deleted users in all `find` queries (unless overridden)
userSchema.pre(/^find/, function (next) {
    if (!this.getFilter().includeDeleted) {
        this.where({ deletedAt: null });
    }
    next();
});

const User = model('User', userSchema);

export default User;
