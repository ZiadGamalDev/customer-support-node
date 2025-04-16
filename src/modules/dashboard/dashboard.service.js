import { statuses } from "../../database/enums/chat.enum.js";
import Chat from "../../database/models/chat.model.js";

const LIMIT = 4;

class DashboardService {
  async statistics(agentId) {
    const totalChats = await Chat.countDocuments({ agentId: agentId });
    const resolvedChats = await Chat.countDocuments({ agentId: agentId, status: statuses.RESOLVED });
    const pendingChats = await Chat.countDocuments({ agentId: agentId, status: statuses.PENDING });
    const openChats = await Chat.countDocuments({ agentId: agentId, status: statuses.OPEN });
    const newChats = await Chat.countDocuments({ agentId: agentId, status: statuses.NEW });

    return {
      chat: {
        total: totalChats,
        resolved: resolvedChats,
        pending: pendingChats,
        open: openChats,
        new: newChats,
      },
    };
  }

  async recentChats(agentId) {
    return await Chat.find({ agentId: agentId })
      .sort({ createdAt: -1 })
      .limit(LIMIT)
      .populate("agentId", "name email");
  }
}

export default new DashboardService();
