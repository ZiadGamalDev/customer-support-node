import logger from "../utils/logger.js";

const errorHandler = (err, req, res, next) => {
  if (err.name === "Error") {
    return res.status(400).json({ message: err.message });
  } else {
    logger.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default errorHandler;
