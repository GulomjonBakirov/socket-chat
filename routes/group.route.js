import { Router } from "express";
import GroupController from "../controller/group.controller.js";
import authenticateToken from "../middleware/auth.middleware.js";

const route = new Router();

// User
route.post("/", authenticateToken, GroupController.createGroup);

export default route;
