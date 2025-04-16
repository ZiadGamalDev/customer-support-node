import { Router } from "express";
import ProfileController from "./profile.controller.js";
import ProfileValidation from "./profile.validation.js";
import validate from "../../middleware/validate.js";
import upload from "../../middleware/upload.js";
import authenticate from "../../middleware/authenticate.js";
import { roles } from "../../database/enums/user.enum.js";

const profileRoutes = Router();

profileRoutes.get("/", authenticate(roles.AGENT), ProfileController.show);

profileRoutes.put(
  "/",
  authenticate(roles.AGENT),
  // validate(ProfileValidation.updateProfile),
  upload.single("image"),
  ProfileController.update
);

profileRoutes.put(
  "/agent/:status",
  authenticate(roles.AGENT),
  validate(ProfileValidation.updateStatus),
  ProfileController.agentUpdateStatus
);

export default profileRoutes;
