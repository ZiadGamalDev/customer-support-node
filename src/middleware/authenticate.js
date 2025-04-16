import jwt from "jsonwebtoken";
import User from "../database/models/user.model.js";
import { roles } from "../database/enums/user.enum.js";
import axios from "axios";
import logger from "../utils/logger.js";

const authenticate = (role = null) => async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token is required" });
    }

    const { id } = jwt.verify(token, process.env.JWT_SECRET);

    if (role == roles.CUSTOMER) {
      const response = await axios.get(`${process.env.CLIENT_BASE_URL}/profile`, {
        headers: {
          accesstoken: `accesstoken_${token}`,
        },
      });

      if (response.status === 200 && response.data?.user) {
        req.customer = response.data.user;
        next();
        return;
      } else {
        return res.status(401).json({ message: "Invalid customer data" });
      }
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(401).json({ message: "Please ensure you are using a valid token" });
    }

    if (role && user.role !== role) {
      return res.status(403).json({ message: "Access denied" });
    }

    req.user = user;
    next();
  } catch (err) {
    logger.error("Authentication error", { error: err.message, stack: err.stack });
    return res.status(401).json({ message: "Invalid Token" });
  }
};

export default authenticate;
