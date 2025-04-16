import { statuses } from "../../database/enums/chat.enum.js";
import { roles } from "../../database/enums/user.enum.js";
import Chat from "../../database/models/chat.model.js";
import User from "../../database/models/user.model.js";

const LIMIT = 4;

class DashboardService {
  async statistics() {
    const totalAgents = await User.countDocuments({ role: roles.AGENT });
    const totalUsers = await User.countDocuments({ role: roles.USER });

    const totalChats = await Chat.countDocuments();
    const resolvedChats = await Chat.countDocuments({ status: statuses.RESOLVED });
    const pendingChats = await Chat.countDocuments({ status: statuses.PENDING });
    const openChats = await Chat.countDocuments({ status: statuses.OPEN });
    const newChats = await Chat.countDocuments({ status: statuses.NEW });

    return {
      user: {
        totalAgents,
        totalUsers,
      },
      chat: {
        total: totalChats,
        resolved: resolvedChats,
        pending: pendingChats,
        open: openChats,
        new: newChats,
      },
    };
  }

  async recentChats() {
    return await Chat.find()
      .sort({ createdAt: -1 })
      .limit(LIMIT)
      .populate("agentId", "name email");
  }
}

export default new DashboardService();
