import { createLogger, format, transports } from "winston";
import dotenv from "dotenv";

dotenv.config();

const silent = process.env.APP_DEBUG?.toLowerCase().trim() === "false";

const logger = createLogger({
  level: "info",
  silent,
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => `[${timestamp}] ${level.toUpperCase()}: ${message}`)
  ),
  transports: [
    // new transports.File({ filename: "storage/logs/app.log" }),
    new transports.Console(),
  ],
});

export default logger;
