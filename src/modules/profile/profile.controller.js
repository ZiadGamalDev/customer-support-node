import ProfileService from './profile.service.js';
import profileResponse from './profile.response.js';

class ProfileController {
    async show(req, res, next) {
        try {
            res.status(200).json(profileResponse(req.user));
        } catch (err) {
            next(err);
        }
    }

    async update(req, res, next) {
        try {
            const user = await ProfileService.update(req);

            res.status(200).json(profileResponse(user));
        } catch (err) {
            next(err);
        }
    }

    async agentUpdateStatus(req, res, next) {
        try {
            const user = await ProfileService.updateStatus(req.user.id, req.params.status);

            res.status(200).json(profileResponse(user));
        } catch (err) {
            next(err)
        }
    }
}

export default new ProfileController();
