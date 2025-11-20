import jwt from 'jsonwebtoken';
import User from '../database/models/user.model.js';
import axios from 'axios';

const authenticateSocket = async (socket, next) => {
    try {
        const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];

        if (!token) {
            return next(new Error('Authentication error: Token is missing'));
        }

        // Try to verify with customer-support JWT secret first
        try {
            const { id } = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(id);

            if (user) {
                socket.user = user;
                socket.userId = user._id.toString();
                socket.userType = user.role;
                return next();
            }
        } catch (err) {
            // If that fails, try with ecommerce JWT secret (for customers)
            try {
                const ecommerceSecret = process.env.ECOMMERCE_JWT_SECRET || process.env.JWT_SECRET;
                const { id } = jwt.verify(token, ecommerceSecret);
                
                // For customers, verify with ecommerce API
                const response = await axios.get(`${process.env.CLIENT_BASE_URL}/profile`, {
                    headers: {
                        accesstoken: `accesstoken_${token}`,
                    },
                });

                if (response.status === 200 && response.data?.user) {
                    socket.user = response.data.user;
                    socket.userId = response.data.user._id || id;
                    socket.userType = 'customer';
                    return next();
                } else {
                    return next(new Error('Authentication error: Invalid customer data'));
                }
            } catch (ecommerceErr) {
                return next(new Error('Authentication error: Invalid token'));
            }
        }

        return next(new Error('Authentication error: User not found'));
    } catch (err) {
        next(new Error('Authentication error: Invalid token'));
    }
};

export default authenticateSocket;
