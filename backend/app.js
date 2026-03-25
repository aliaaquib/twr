require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { runStartupAutoWriterCheck, startWeeklyAutoWriter } = require("./services/autoWriterService");
const connectDatabase = require("./utils/db");
const postRoutes = require("./routes/postRoutes");
const { seedInitialPosts } = require("./services/seedService");

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
  })
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/", postRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found.` });
});

app.use((err, _req, res, _next) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    message: err.message || "Something went wrong.",
  });
});

const startServer = async () => {
  await connectDatabase();
  await seedInitialPosts();

  app.listen(port, () => {
    console.log(`Weekly Roundup backend listening on http://localhost:${port}`);

    if (process.env.ENABLE_AUTO_WRITER === "true") {
      startWeeklyAutoWriter();
      runStartupAutoWriterCheck().catch((error) => {
        console.error("Startup auto-writer check failed:", error);
      });
    } else {
      console.log("Weekly auto-writer disabled. Set ENABLE_AUTO_WRITER=true to enable it.");
    }
  });
};

if (require.main === module) {
  startServer().catch((error) => {
    console.error("Failed to start backend:", error);
    process.exit(1);
  });
}

module.exports = {
  app,
  startServer,
};
