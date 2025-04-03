import User from '../../database/models/user.model.js';
import file from '../../utils/file.js';

class ProfileService {
    async update({user, body: data, file: image}) {
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

      return user;
    }
}

export default new ProfileService();
