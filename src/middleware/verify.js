import User from '../database/models/user.model.js';
import logger from '../utils/logger.js';

const verify = (type = 'email') => async (req, res, next) => {
    try {
        const value = req.body[type];

        if (!value) {
            return res.status(400).json({ message: `Missing ${type}` });
        }

        const user = await User.findOne({ [type]: value });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const verifiedAtField = type === 'email' ? 'emailVerifiedAt' : 'phoneVerifiedAt';
        if (!user[verifiedAtField]) {
            return res.status(400).json({ message: `Please verify your ${type}` });
        }

        next();
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export default verify;
