import http from "http";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./database";

// Configuration Config Files
dotenv.config({ path: "./src/configs/.env" });

const app = express();

const PORT: number = Number(process.env.PORT) || 8080;

// Create Server
const server = http.createServer(app);

server.listen(PORT, async () => {
  // Connect DB
  await connectDB();
  console.log(`Server is listening on http://localhost:${PORT} 🚀🚀🚀`);
});
