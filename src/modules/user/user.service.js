import file from "../../utils/file.js";
import User from "../../database/models/user.model.js";

class UserService {
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

  async findByRole(role) {
    return await User.find({
      role,
    }).select("_id name email image");
  }
}

export default new UserService();
