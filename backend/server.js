const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://localhost:4173",
  "https://feedback-collection-system-subhambhuyan889-sys.vercel.app",
  "https://feedback-collection-system-delta.vercel.app",
  process.env.CLIENT_URL,
].filter(Boolean));

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) return callback(null, true);
      return callback(new Error("CORS origin not allowed"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) =>
  res.status(200).json({ success: true, message: "Feedback Collection System API is running" })
);
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/forms", require("./routes/formRoutes"));
app.use("/api/feedback", require("./routes/feedbackRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));

app.use((req, res) => res.status(404).json({ success: false, message: "Route not found" }));

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
