import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import surveyRoutes from "./routes/surveyRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/api/surveys", surveyRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/chat", chatRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});