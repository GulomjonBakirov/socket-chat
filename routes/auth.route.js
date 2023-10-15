import { Router } from "express";
import UserController from "../controller/user.controller.js";

const route = new Router();

// Authorization
route.post("/registration", UserController.registration);
route.post("/login", UserController.login);

export default route;
