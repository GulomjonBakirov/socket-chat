import { Router } from "express";
import UserController from "../controller/user.controller.js";
import authenticateToken from "../middleware/auth.middleware.js";

const route = new Router();

// User
route.get("/", authenticateToken, UserController.getUsers);

export default route;
