import { Router } from "express";
import DashboardController from "./dashboard.controller.js";

const dashboardRoutes = Router();

dashboardRoutes.get(
  "/statistics", 
  DashboardController.statistics
);

dashboardRoutes.get(
  "/recent-chats",
  DashboardController.recentChats
);

export default dashboardRoutes;
