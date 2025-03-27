import file from "../../utils/file.js";
import User from "../../database/models/user.model.js";

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
    const agents = await User.find({ role: "agent" }); // Todo: find isAvailable: true
    if (!agents.length) {
      throw new Error("No agents available");
    }

    return agents[Math.floor(Math.random() * agents.length)];
  }
}

export default new UserService();
