import { createLogger, format, transports } from "winston";
import dotenv from "dotenv";

dotenv.config();

const isLocal = process.env.APP_ENV === "local";
const isDebug = process.env.APP_DEBUG === "true";
const logFile = "storage/logs/app.log";

const logger = createLogger({
  level: "info",
  silent: !isLocal || !isDebug,
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => `[${timestamp}] ${level.toUpperCase()}: ${message}`)
  ),
  transports: [
    ...(isLocal && isDebug ? [new transports.File({ filename: logFile })] : [])
  ],
});

export default logger;
