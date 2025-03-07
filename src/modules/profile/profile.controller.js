import ProfileService from './profile.service.js';
import profileResponse from './profile.response.js';

class ProfileController {
    async show(req, res) {
        try {
            res.status(200).json(profileResponse(req.user));
        } catch (err) {
            res.status(500).json({ message: err.message || 'Internal server error' });
        }
    }

    async update(req, res) {
        try {
            const user = await ProfileService.update(req);

            res.status(200).json(profileResponse(user));
        } catch (err) {
            res.status(400).json({ message: err.message || 'Failed to update profile' });
        }
    }
}

export default new ProfileController();
