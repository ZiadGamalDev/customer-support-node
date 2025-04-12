import { Router } from "express";
import PasswordController from "./password.controller.js";
import PasswordValidation from "./password.validation.js";
import validate from "../../middleware/validate.js";
import authenticate from "../../middleware/authenticate.js";
import { roles } from "../../database/enums/user.enum.js";

const passwordRoutes = Router();

passwordRoutes.post(
  "/forgot",
  validate(PasswordValidation.forgot),
  PasswordController.forgot
);
passwordRoutes.post(
  "/reset",
  validate(PasswordValidation.reset),
  PasswordController.reset
);
passwordRoutes.post(
  "/confirm",
  authenticate(roles.USER),
  validate(PasswordValidation.confirm),
  PasswordController.confirm
);
passwordRoutes.post(
  "/update",
  authenticate([roles.USER, roles.AGENT, roles.ADMIN]),
  PasswordController.updatePass
);
export default passwordRoutes;
