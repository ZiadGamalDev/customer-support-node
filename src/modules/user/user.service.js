import file from "../../utils/file.js";
import User from "../../database/models/user.model.js";
import { roles, statuses } from "../../database/enums/user.enum.js";
import updateStatus from "../../services/status.js";

const MAX_CHATS = 3;

class UserService {
  async findById(userId) {
    return await User.findById(userId);
  }

  async create(data) {
    const user = new User(data);

    if (data.image) {
      user.image = await file.store(data.image, "images/user");
    }

    await user.save();
    return user;
  }
  
  async update({ user, body: data, file: image }) {
    if (image) {
      data.image = await file.store(image, "images/user");

      if (user.image) {
        await file.destroy(user.image.publicId);
      }
    }

    if (data.status && user.role == roles.AGENT) {
      await updateStatus.agent(user, data.status);
    }

    Object.assign(user, data);
    await user.save();

    return user;
  }

  async findAvailableAgent() {
    let agent = await User.findOne({ role: roles.AGENT, status: statuses.AVAILABLE });

    if (!agent) {
      agent = await User.findOne({ role: roles.AGENT, status: statuses.BUSY, chatsCount: { $lt: MAX_CHATS } });
    }

    return agent;
  }

  async isAgentAvailable(agent) {
    if (agent.status === statuses.AVAILABLE) {
      return true;
    } else if (agent.status === statuses.BUSY && agent.chatsCount < MAX_CHATS) {
      return true;
    }

    return false;
  }

  async convertToAgent(email) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    } else if (user.role === roles.AGENT) {
      throw new Error("User is already an agent");
    }

    user.role = roles.AGENT;
    user.status = statuses.AWAY;
    await user.save();

    return user;
  }

  async deleteById(userId) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    if (user.role === roles.AGENT && user.status === statuses.BUSY) {
      updateStatus.agent(user, statuses.AWAY);
    }

    if (user.image) {
      file.destroy(user.image.publicId);
    }

    await User.deleteOne({ _id: userId });
  }
}

export default new UserService();
