import User from '../../database/models/user.model.js';
import userResponse from './user.response.js';
import UserService from './user.service.js';

class UserController {
    async index(req, res, next) {
        try {
            const users = await User.find();

            res.status(200).json(users.map(userResponse));
        } catch (err) {
            next(err);
        }
    }

    async show(req, res, next) {
        try {
            const user = await User.findById(req.params.id);

            res.status(200).json(userResponse(user));
        } catch (err) {
            next(err);
        }
    }

    async update(req, res, next) {
        try {
            req.user = await User.findById(req.params.id);

            const user = await UserService.update(req);

            res.status(200).json(userResponse(user));
        } catch (err) {
            next(err);
        }
    }

    async destroy(req, res, next) {
        try {
            const user = await User.findById(req.params.id);

            user.deletedAt = new Date();
            await user.save();

            res.status(200).json({ message: 'User deleted successfully' });
        } catch (err) {
            next(err);
        }
    }
}

export default new UserController();
