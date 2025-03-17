import jwt from 'jsonwebtoken';
import User from '../database/models/user.model.js';
import { roles } from '../database/enums/user.enum.js';

const authenticate = (role = roles.USER) => async (req, res, next) => {    
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token is required' });
        }

        const { id } = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(id);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        if (role && user.role !== role) {
            return res.status(403).json({ message: 'Access denied' });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid Token' });
    }
};

export default authenticate;
