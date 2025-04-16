import chatResponse from "../chat/chat.response.js";
import DashboardService from "./dashboard.service.js";

class DashboardController {
	async statistics(req, res, next) {
		try {
			const statistics = await DashboardService.statistics();

			res.status(200).json({ message: 'Statistics fetched successfully', statistics });
		} catch (err) {
			next(err);
		}
	}

	async recentChats(req, res, next) {
		try {
			const recentChats = await DashboardService.recentChats();

      res.status(200).json(recentChats.map(chat => chatResponse(chat)));
		} catch (err) {
			next(err);
		}
	}
}

export default new DashboardController();
