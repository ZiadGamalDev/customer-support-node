import { Router } from "express";
import ProfileController from "./profile.controller.js";
import ProfileValidation from "./profile.validation.js";
import validate from "../../middleware/validate.js";
import upload from "../../middleware/upload.js";

const profileRoutes = Router();

profileRoutes.get(
  "/", 
  ProfileController.show
);

profileRoutes.put(
  "/",
  upload.single("image"),
  validate(ProfileValidation.profileData),
  ProfileController.update
);

export default profileRoutes;
