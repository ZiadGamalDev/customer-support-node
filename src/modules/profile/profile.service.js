import { statuses } from '../../database/enums/user.enum.js';
import User from '../../database/models/user.model.js';
import file from '../../utils/file.js';
import ChatService from '../chat/chat.service.js';
import UserService from '../user/user.service.js';

class ProfileService {
  async update({ user, body: data, file: image }) {
    if (image) {
      data.image = await file.store(image, 'images/user');

      if (user.image) {
        file.destroy(user.image.publicId);
      }
    }

    Object.assign(user, data);
    await user.save();

    return user;
  }

  async updateStatus(userId, status) {
    const user = await User.findById(userId);

    if (!user) throw new Error('User not found');

    user.status = status;
    await user.save();

    if (status = statuses.AWAY) {
      this.handleAwayAgent(user);
    }

    return user;
  }

  async handleAwayAgent(agent) {
    agent.status = statuses.AWAY;
    agent.chatsCount = 0;
    await agent.save();

    const chats = await ChatService.all(agent._id);
    for (const chat of chats) {
      await ChatService.awayAgent(chat)
      const availableAgent = await UserService.findAvailableAgent();
      await ChatService.reAssignAgent(chat, availableAgent);
      // TODO: notify the agent
    }
  }
}

export default new ProfileService();
