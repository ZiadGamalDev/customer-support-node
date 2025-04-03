import NotificationService from "./notification.service.js";

class NotificationController {
  async getUserNotifications(req, res, next) {
    try {
      const { limit, offset, read } = req.query;
      const options = {
        limit: limit ? parseInt(limit) : 20,
        offset: offset ? parseInt(offset) : 0,
      };

      if (read !== undefined) {
        options.read = read === "true";
      }

      const result = await NotificationService.getUserNotifications(
        req.user._id,
        options
      );

      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  async getUnreadCount(req, res, next) {
    try {
      const count = await NotificationService.getUnreadCount(req.user._id);

      res.status(200).json({ count });
    } catch (err) {
      next(err);
    }
  }

  async markAsRead(req, res, next) {
    try {
      const notification = await NotificationService.markAsRead(
        req.params.notificationId,
        req.user._id
      );

      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }

      res.status(200).json(notification);
    } catch (err) {
      next(err);
    }
  }

  async markAllAsRead(req, res, next) {
    try {
     
      const { type, referenceModel } = req.body;
      const filter = {};

      if (type) filter.type = type;
      if (referenceModel) filter["reference.model"] = referenceModel;

      const count = await NotificationService.markAllAsRead(
        req.user._id,
        filter
      );

      res.status(200).json({ markedAsRead: count });
    } catch (err) {
      next(err);
    }
  }

  async deleteNotification(req, res, next) {
    try {
      const result = await NotificationService.deleteNotification(
        req.params.notificationId,
        req.user._id
      );

      if (!result) {
        return res.status(404).json({ message: "Notification not found" });
      }

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

export default new NotificationController();
