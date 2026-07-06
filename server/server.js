import "./config/env.js";
import app from "./app.js";

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`Vermilion API running on http://localhost:${PORT}`);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received — shutting down");
  server.close(() => process.exit(0));
});

process.on("SIGINT", () => {
  console.log("SIGINT received — shutting down");
  server.close(() => process.exit(0));
});