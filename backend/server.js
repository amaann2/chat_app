import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";
import connectToDb from "./db/connectToMongodb.js";
import { server, app } from "./socket/socket.js";
import path from "path";
app.use(express.json());

const __dirname = path.resolve();
app.use(
  cors({
    // origin: "http://localhost:5173",
    // methods: ["POST", "GET"],
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/users", userRoutes);
app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});
dotenv.config();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  connectToDb();
  console.log(`App is running on port ${PORT}`);
});
