import file from "../../utils/file.js";
import User from "../../database/models/user.model.js";
import { roles, statuses } from "../../database/enums/user.enum.js";

class UserService {
  async findById(userId) {
    return await User.findById(userId);
  }
  
  async update({ user, body: data, file: image }) {
    if (image) {
      data.image = await file.store(image, "images/user");

      if (user.image) {
        file.destroy(user.image.publicId);
      }
    }

    Object.assign(user, data);
    await user.save();

    return user;
  }

  async findAvailableAgent() {
    let agent = await User.findOne({ role: roles.AGENT, status: statuses.ONLINE });

    if (!agent) {
      agent = await User.findOne({ role: roles.AGENT, status: statuses.BUSY, chatsCount: { $lt: 3 } });
    }

    if (!agent) {
      throw new Error("No agents available");
    }

    this.updateAgentStatus(agent, statuses.BUSY);

    return agent;
  }

  async updateAgentStatus(agent, status) {
    if (!Object.values(statuses).includes(status)) {
      throw new Error("Invalid status value");
    }

    agent.status = status;
    await agent.save();

    return agent;
  }
}

export default new UserService();
