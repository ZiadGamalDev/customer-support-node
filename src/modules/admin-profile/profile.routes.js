import { Router } from "express";
import ProfileController from "./profile.controller.js";
import ProfileValidation from "./profile.validation.js";
import validate from "../../middleware/validate.js";
import upload from "../../middleware/upload.js";

const adminRoutes = Router();

adminRoutes.get(
  "/", 
  ProfileController.show
);

adminRoutes.put(
  "/",
  validate(ProfileValidation.profileData),
  upload.single("image"),
  ProfileController.update
);

export default adminRoutes;
