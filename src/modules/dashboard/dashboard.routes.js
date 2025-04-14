import { Router } from "express";
import DashboardController from "./dashboard.controller.js";

const dashboardRoutes = Router();

dashboardRoutes.get(
  "/statistics", 
  DashboardController.statistics
);

export default dashboardRoutes;
