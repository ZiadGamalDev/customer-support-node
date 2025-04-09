import { chatStatusesByAgent } from "../database/enums/chat.enum.js";
import { userStatusesByAgent } from "../database/enums/user.enum.js";
import { _handleAvailableAgent, _handleAwayAgent, _handlePendingChat, _handleResolvedChat } from "./helpers.js";

const updateStatus = {
  async agent(agent, status) {
    if (status === userStatusesByAgent.AWAY) {
      await _handleAwayAgent(agent);
    } else if (status === userStatusesByAgent.AVAILABLE) {
      await _handleAvailableAgent(agent)
    }
  },

  async chat(chat, status) {
    if (status === chatStatusesByAgent.PENDING) {
      await _handlePendingChat(chat);
    } else if (status === chatStatusesByAgent.RESOLVED) {
      await _handleResolvedChat(chat);
    }
  },
};

export default updateStatus;
