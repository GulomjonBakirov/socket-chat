import http from "http";
import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";

import { connectDB } from "./database";
import socket from "./socket";
import { authRouter } from "./routes";

// Configuration Config Files
dotenv.config({ path: "./src/configs/.env" });

const app = express();

// Body Parser
app.use(bodyParser.json());

// Routes
app.use("/auth", authRouter);

const PORT: number = Number(process.env.PORT) || 8080;

// Create Server
const server = http.createServer(app);

// Socket Server
socket(server);

server.listen(PORT, async () => {
  // Connect DB
  await connectDB();
  console.log(`Server is listening on http://localhost:${PORT} 🚀🚀🚀`);
});
