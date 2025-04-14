import DashboardService from "./dashboard.service.js";

class DashboardController {
    async statistics(req, res, next) {
        try {
            const statistics = await DashboardService.statistics(req.user.id);

            res.status(200).json({ message: 'Statistics fetched successfully', statistics });
        } catch (err) {
            next(err);
        }
    }
}

export default new DashboardController();
