import User from '../../database/models/user.model.js';
import userResponse from './user.response.js';

class UserController {
    async index(req, res) {
        try {
            const users = await User.find();

            res.status(200).json(users.map(userResponse));
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch users' });
        }
    }
}

export default new UserController();
