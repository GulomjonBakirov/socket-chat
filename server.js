import http from "http";
import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import { connectDB } from "./database/index.js";
import socket from "./socket.js";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import groupRoute from "./routes/group.route.js";

dotenv.config({
  path: "./config/config.env",
});

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

app.use("/auth/", authRoute);
app.use("/user/", userRoute);
app.use("/group/", groupRoute);

//  Database Connection
await connectDB();

// Create Server
const server = http.createServer(app);

// Socket
await socket(server);

// Set PORT
const port = process.env.PORT || 3333;

server.listen(port, () => {
  console.log(`Server is running... on port: ${port}`);
});
