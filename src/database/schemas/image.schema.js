import { Schema } from 'mongoose';

const ImageSchema = new Schema({
    url: {
        type: String,
        required: true,
    },
    publicId: {
        type: String,
        required: true,
    },
}, { _id: false });

export default ImageSchema;
