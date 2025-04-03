import schedule from "node-schedule";
import NotificationService from "../modules/notification/notification.service.js";
import logger from "./logger.js";

class NotificationScheduler {
  init() {
    this.cleanupJob = schedule.scheduleJob("0 3 * * *", async () => {
      try {
        logger.info("Running notification cleanup job");
        const deletedCount = await NotificationService.deleteOldNotifications(
          30
        );
        logger.info(`Deleted ${deletedCount} old notifications`);
      } catch (error) {
        logger.error("Notification cleanup job failed:", error);
      }
    });

    logger.info("Notification cleanup job scheduled");

    return this.cleanupJob;
  }

  scheduleCustomCleanup(cronExpression, daysOld = 30) {
    return schedule.scheduleJob(cronExpression, async () => {
      try {
        logger.info(
          `Running custom notification cleanup job (${daysOld} days)`
        );
        const deletedCount = await NotificationService.deleteOldNotifications(
          daysOld
        );
        logger.info(`Deleted ${deletedCount} old notifications`);
      } catch (error) {
        logger.error("Custom notification cleanup job failed:", error);
      }
    });
  }

  cancelAll() {
    if (this.cleanupJob) {
      this.cleanupJob.cancel();
      logger.info("Notification cleanup job canceled");
    }
  }
}

export default new NotificationScheduler();
