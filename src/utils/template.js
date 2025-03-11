import fs from 'fs';
import path from 'path';

const template = (filePath) => {
    const templatePath = path.resolve('src/templates', filePath);

    if (!fs.existsSync(templatePath)) {
        throw new Error(`Template file not found: ${templatePath}`);
    }
    
    return fs.readFileSync(templatePath, 'utf-8');
};

export default template;
