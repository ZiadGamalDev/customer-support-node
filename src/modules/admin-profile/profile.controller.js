import profileResponse from "./profile.response.js";
import profileService from "./profile.service.js";

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
            const user = await profileService.update(req);

            res.status(200).json(profileResponse(user));
        } catch (err) {
            next(err);
        }
    }
}

export default new ProfileController();
