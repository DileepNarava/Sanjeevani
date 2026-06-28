import express from "express";
import cors from "cors";
import "dotenv/config";

import authRoutes from "./routes/auth.routes.js";
import requestRoutes from "./routes/request.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SERVER UPDATED 2026",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/requests", requestRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});