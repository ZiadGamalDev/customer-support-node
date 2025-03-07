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
}

export default new ProfileService();
