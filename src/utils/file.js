import fs from 'fs';
import path from 'path';
import cloudinary from '../config/cloudinary.js';

const file = {
    async store(file, targetFolder = 'common', useCloudinary = true, customName = null) {
        console.log(`[file.store] useCloudinary: ${useCloudinary}`);

        if (useCloudinary) {
            try {
                const result = await cloudinary.uploader.upload(file.path, { folder: targetFolder });
                fs.unlinkSync(file.path);
                return { url: result.secure_url, publicId: result.public_id };
            } catch (err) {
                console.error('Cloudinary Upload Error:', err);
                throw new Error('Failed to upload image');
            }
        }

        const folderPath = path.join('storage', targetFolder);
        fs.mkdirSync(folderPath, { recursive: true });

        const fileName = customName || file.filename;
        const targetPath = path.join(folderPath, fileName);
        fs.renameSync(file.path, targetPath);
        
        return targetPath;
    },

    async destroy(filePath, useCloudinary = true) {
        if (useCloudinary) {
            try {
                await cloudinary.uploader.destroy(filePath);
                return;
            } catch (err) {
                console.error('Cloudinary Delete Error:', err);
            }
        }

        const resolvedPath = path.resolve(filePath);
        if (fs.existsSync(resolvedPath)) {
            fs.unlinkSync(resolvedPath);
        }
    },
};

export default file;
